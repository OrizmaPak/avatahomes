let floorplansState = {
    properties: [],
    sales: [],
    salesLoaded: false,
    selectedPropertyId: '',
    selectedFloor: '',
    selectedUnitId: '',
    view: 'plan'
};

const floorplansLayout = {
    A: {
        A101: 'a-top-1', A102: 'a-top-2', A103: 'a-mid-1', A104: 'a-mid-2', A105: 'a-bottom-1', A106: 'a-bottom-2'
    },
    B: {
        B101: 'b-top-1', B102: 'b-top-2', 'STUDIO11': 'b-studio-1', B103: 'b-main', 'STUDIO12': 'b-studio-2', B104: 'b-bottom-1', B105: 'b-bottom-2'
    }
};

function floorplansPositionClass(code, unit) {
    const normalized = floorplansNormalize(unit?.unitname);
    const number = normalized.match(/(\d)$/)?.[1];
    if (code === 'A' && number && ['1', '2', '3', '4', '5', '6'].includes(number)) return `a-${number === '1' ? 'top-1' : number === '2' ? 'top-2' : number === '3' ? 'mid-1' : number === '4' ? 'mid-2' : number === '5' ? 'bottom-1' : 'bottom-2'}`;
    if (code === 'B') {
        if (normalized.startsWith('STUDIO') && number === '1') return 'b-studio-1';
        if (normalized.startsWith('STUDIO') && number === '2') return 'b-studio-2';
        if (number === '1') return 'b-top-1';
        if (number === '2') return 'b-top-2';
        if (number === '3') return 'b-main';
        if (number === '4') return 'b-bottom-1';
        if (number === '5') return 'b-bottom-2';
    }
    return '';
}

function floorplansEscape(value) {
    return `${value ?? ''}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function floorplansText(value, fallback = '-') {
    const text = `${value ?? ''}`.trim();
    return text || fallback;
}

function floorplansStatusMarkup(status) {
    const statusClass = { AVAILABLE: 'available', TAKEN: 'taken', NEEDS_REVIEW: 'review', UNCONFIRMED: 'unconfirmed' }[status.key] || 'unconfirmed';
    return `<span class="floorplans-status-marker ${statusClass}" aria-hidden="true"></span>${status.label}`;
}

function floorplansNormalize(value) {
    return `${value ?? ''}`.toUpperCase().replace(/\s+/g, '');
}

function floorplansPropertyId(item) {
    return `${item?.property?.id ?? item?.property?.propertyid ?? item?.id ?? ''}`;
}

function floorplansUnitId(unit) {
    return `${unit?.id ?? unit?.unitid ?? ''}`;
}

function floorplansPropertyName(item) {
    return item?.property?.propertyname ?? item?.propertyname ?? 'Unnamed building';
}

function floorplansUnits(item) {
    const units = item?.propertyunits ?? item?.units ?? [];
    return Array.isArray(units) ? units : [];
}

function floorplansFloor(unit) {
    return floorplansText(unit?.floor ?? unit?.floornumber ?? unit?.floorno, 'Floor not assigned');
}

function floorplansSalesPropertyId(item) {
    return `${item?.rentdata?.propertyid ?? item?.propertyid ?? item?.property?.id ?? ''}`;
}

function floorplansSalesUnitId(item) {
    return `${item?.rentdata?.unitid ?? item?.unitid ?? item?.unit?.id ?? ''}`;
}

function floorplansStatus(unit, propertyId) {
    const transaction = floorplansState.sales.find(item => floorplansSalesPropertyId(item) === propertyId && floorplansSalesUnitId(item) === floorplansUnitId(unit));
    if (transaction) return { key: 'TAKEN', label: 'Taken', icon: 'lock' };

    const occupied = `${unit?.rented ?? unit?.isrented ?? unit?.occupied ?? ''}`.trim().toUpperCase();
    if (['YES', 'TRUE', '1', 'SOLD', 'RENTED', 'TAKEN', 'OCCUPIED', 'ALLOCATED'].includes(occupied)) return { key: 'TAKEN', label: 'Taken', icon: 'lock' };
    if (occupied && !['NO', 'FALSE', '0', 'AVAILABLE', 'OPEN', 'VACANT'].includes(occupied)) return { key: 'NEEDS_REVIEW', label: 'Needs review', icon: 'help' };
    if (!floorplansState.salesLoaded) return { key: 'UNCONFIRMED', label: 'Unconfirmed', icon: 'help' };
    return { key: 'AVAILABLE', label: 'Available', icon: 'check_circle' };
}

function floorplansDecoratedUnits(item) {
    const propertyId = floorplansPropertyId(item);
    return floorplansUnits(item).map(unit => ({ ...unit, _propertyId: propertyId, _status: floorplansStatus(unit, propertyId) }));
}

function floorplansSummary(units) {
    return units.reduce((summary, unit) => {
        summary[unit._status.key] = (summary[unit._status.key] || 0) + 1;
        return summary;
    }, { AVAILABLE: 0, TAKEN: 0, NEEDS_REVIEW: 0, UNCONFIRMED: 0 });
}

async function floorplansActive() {
    floorplansBindEvents();
    await floorplansLoad();
}

function floorplansBindEvents() {
    const page = document.getElementById('floorplansPage');
    if (!page || page.dataset.bound) return;
    page.dataset.bound = '1';
    document.getElementById('floorplansRefresh')?.addEventListener('click', floorplansLoad);
    document.getElementById('floorplansSearch')?.addEventListener('input', floorplansRender);
    document.getElementById('floorplansBuilding')?.addEventListener('change', event => {
        floorplansState.selectedPropertyId = event.target.value;
        floorplansState.selectedFloor = '';
        floorplansState.selectedUnitId = '';
        floorplansRender();
    });
    document.getElementById('floorplansFloor')?.addEventListener('change', event => {
        floorplansState.selectedFloor = event.target.value;
        floorplansState.selectedUnitId = '';
        floorplansRenderExplorer();
    });
    document.getElementById('floorplansStatus')?.addEventListener('change', floorplansRender);
    page.querySelectorAll('[data-floorplans-view]').forEach(button => button.addEventListener('click', () => {
        floorplansState.view = button.dataset.floorplansView;
        page.querySelectorAll('[data-floorplans-view]').forEach(item => item.classList.toggle('is-active', item === button));
        floorplansRender();
    }));
}

async function floorplansLoad() {
    const message = document.getElementById('floorplansMessage');
    if (message) { message.className = 'floorplans-message'; message.textContent = 'Loading property data...'; }
    try {
        const propertyResponse = await httpRequest2('../controllers/fetchproperty', null, null, 'json');
        if (!propertyResponse?.status || !Array.isArray(propertyResponse.data)) throw new Error(propertyResponse?.message || 'Property data could not be loaded.');
        floorplansState.properties = propertyResponse.data;
        floorplansState.sales = [];
        floorplansState.salesLoaded = false;

        try {
            const salesResponse = await httpRequest2('../controllers/fetchrentaproperty', null, null, 'json');
            if (salesResponse?.status && Array.isArray(salesResponse.data)) {
                floorplansState.sales = salesResponse.data;
                floorplansState.salesLoaded = true;
            }
        } catch (error) {
            console.warn('Floor plan sales data unavailable', error);
        }

        const propertyIds = floorplansState.properties.map(floorplansPropertyId);
        if (!propertyIds.includes(floorplansState.selectedPropertyId)) floorplansState.selectedPropertyId = propertyIds[0] || '';
        floorplansState.selectedFloor = '';
        floorplansState.selectedUnitId = '';
        document.getElementById('floorplansUpdated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        if (message) message.textContent = floorplansState.salesLoaded ? 'Availability is based on registered property and sales records.' : 'Sales records could not be checked. Apartments are marked Unconfirmed until the data is available.';
        floorplansRender();
    } catch (error) {
        floorplansState.properties = [];
        const message = document.getElementById('floorplansMessage');
        if (message) { message.className = 'floorplans-message error'; message.textContent = error.message || 'Unable to load floor plan data.'; }
        floorplansRender();
    }
}

function floorplansFilteredProperties() {
    const search = `${document.getElementById('floorplansSearch')?.value || ''}`.trim().toLowerCase();
    return floorplansState.properties.filter(item => {
        if (!search) return true;
        const haystack = [floorplansPropertyName(item), ...floorplansUnits(item).map(unit => unit.unitname)].join(' ').toLowerCase();
        return haystack.includes(search);
    });
}

function floorplansRender() {
    const properties = floorplansFilteredProperties();
    const buildingSelect = document.getElementById('floorplansBuilding');
    if (buildingSelect) buildingSelect.innerHTML = `<option value="">All buildings</option>${properties.map(item => `<option value="${floorplansEscape(floorplansPropertyId(item))}" ${floorplansPropertyId(item) === floorplansState.selectedPropertyId ? 'selected' : ''}>${floorplansEscape(floorplansPropertyName(item))}</option>`).join('')}`;
    const overview = document.getElementById('floorplansOverview');
    if (overview) overview.innerHTML = properties.map(item => floorplansBuildingCard(item)).join('') || '<div class="floorplans-message">No buildings match your search.</div>';
    overview?.querySelectorAll('[data-floorplans-property]').forEach(card => card.addEventListener('click', () => {
        floorplansState.selectedPropertyId = card.dataset.floorplansProperty;
        floorplansState.selectedFloor = '';
        floorplansState.selectedUnitId = '';
        document.getElementById('floorplansBuilding').value = floorplansState.selectedPropertyId;
        floorplansRender();
    }));
    const selected = floorplansState.properties.find(item => floorplansPropertyId(item) === floorplansState.selectedPropertyId);
    document.getElementById('floorplansExplorer')?.classList.toggle('hidden', !selected || floorplansState.view !== 'plan');
    document.getElementById('floorplansList')?.classList.toggle('hidden', floorplansState.view !== 'list');
    if (floorplansState.view === 'plan') floorplansRenderExplorer();
    else floorplansRenderList(properties);
}

function floorplansBuildingCard(item) {
    const units = floorplansDecoratedUnits(item); const summary = floorplansSummary(units); const selected = floorplansPropertyId(item) === floorplansState.selectedPropertyId;
    const total = units.length || 1;
    return `<article class="floorplans-building-card ${selected ? 'selected' : ''}" data-floorplans-property="${floorplansEscape(floorplansPropertyId(item))}"><h3>${floorplansEscape(floorplansPropertyName(item))}</h3><p>${floorplansEscape(floorplansText(item?.property?.location ?? item?.property?.address, 'Location not specified'))}</p><div class="floorplans-stats"><div><strong>${units.length}</strong><span>Units</span></div><div><strong>${summary.AVAILABLE}</strong><span>Available</span></div><div><strong>${summary.TAKEN}</strong><span>Taken</span></div></div><div class="floorplans-bar"><i class="available" style="width:${summary.AVAILABLE / total * 100}%"></i><i class="taken" style="width:${summary.TAKEN / total * 100}%"></i><i class="review" style="width:${summary.NEEDS_REVIEW / total * 100}%"></i><i class="unconfirmed" style="width:${summary.UNCONFIRMED / total * 100}%"></i></div></article>`;
}

function floorplansRenderExplorer() {
    const item = floorplansState.properties.find(property => floorplansPropertyId(property) === floorplansState.selectedPropertyId);
    if (!item) return;
    const units = floorplansDecoratedUnits(item);
    const floors = [...new Set(units.map(floorplansFloor))].sort((a, b) => floorplansFloorSort(b) - floorplansFloorSort(a));
    if (!floors.includes(floorplansState.selectedFloor)) floorplansState.selectedFloor = floors[0] || '';
    const floorSelect = document.getElementById('floorplansFloor');
    if (floorSelect) floorSelect.innerHTML = `<option value="">All floors</option>${floors.map(floor => `<option value="${floorplansEscape(floor)}" ${floor === floorplansState.selectedFloor ? 'selected' : ''}>${floorplansEscape(floor)}</option>`).join('')}`;
    const rail = document.getElementById('floorplansFloorRail');
    if (rail) rail.innerHTML = `<h3>Floors</h3>${floors.map(floor => { const floorUnits = units.filter(unit => floorplansFloor(unit) === floor); const summary = floorplansSummary(floorUnits); return `<button type="button" class="floorplans-floor-button ${floor === floorplansState.selectedFloor ? 'selected' : ''}" data-floorplans-floor="${floorplansEscape(floor)}"><strong>${floorplansEscape(floor)}</strong><small>${summary.AVAILABLE} available · ${summary.TAKEN} taken</small></button>`; }).join('')}`;
    rail?.querySelectorAll('[data-floorplans-floor]').forEach(button => button.addEventListener('click', () => { floorplansState.selectedFloor = button.dataset.floorplansFloor; floorplansState.selectedUnitId = ''; floorplansRenderExplorer(); }));
    const floorUnits = units.filter(unit => floorplansFloor(unit) === floorplansState.selectedFloor);
    document.getElementById('floorplansSelectedBuilding').textContent = floorplansPropertyName(item);
    document.getElementById('floorplansSelectedFloor').textContent = `${floorplansState.selectedFloor || 'All floors'} · ${floorUnits.length} registered unit${floorUnits.length === 1 ? '' : 's'}`;
    const plan = document.getElementById('floorplansPlan');
    const code = /BLOCK\s*A/i.test(floorplansPropertyName(item)) ? 'A' : /BLOCK\s*B/i.test(floorplansPropertyName(item)) ? 'B' : '';
    const visibleUnits = floorUnits;
    if (plan) plan.innerHTML = visibleUnits.map(unit => floorplansUnitMarkup(unit, code, floorUnits)).join('') || '<div class="floorplans-message" style="grid-column:1/-1">No apartments match the current filters.</div>';
    document.querySelectorAll('[data-floorplans-unit]').forEach(button => button.addEventListener('click', () => { floorplansState.selectedUnitId = button.dataset.floorplansUnit; floorplansRenderDetails(units); floorplansRenderExplorer(); }));
    const additional = document.getElementById('floorplansAdditional');
    const positioned = code ? visibleUnits.filter(unit => floorplansPositionClass(code, unit)) : visibleUnits;
    const extra = visibleUnits.filter(unit => !positioned.includes(unit));
    if (additional) { additional.classList.toggle('hidden', !extra.length); additional.innerHTML = extra.length ? `<h3>Additional units</h3>${extra.map(unit => floorplansUnitMarkup(unit, '', floorUnits)).join('')}` : ''; }
    floorplansRenderDetails(units);
}

function floorplansFloorSort(value) { const number = `${value}`.match(/\d+/); return number ? Number(number[0]) : -1; }

function floorplansUnitMatchesFilters(unit) {
    const search = `${document.getElementById('floorplansSearch')?.value || ''}`.trim().toLowerCase(); const status = document.getElementById('floorplansStatus')?.value || 'ALL';
    return (!search || `${unit.unitname || ''} ${unit.description || ''}`.toLowerCase().includes(search)) && (status === 'ALL' || unit._status.key === status);
}

function floorplansUnitMarkup(unit, code, floorUnits) {
    const position = floorplansPositionClass(code, unit); const search = `${document.getElementById('floorplansSearch')?.value || ''}`.trim().toLowerCase(); const statusFilter = document.getElementById('floorplansStatus')?.value || 'ALL'; const dimmed = (search && !`${unit.unitname || ''} ${unit.description || ''}`.toLowerCase().includes(search)) || (statusFilter !== 'ALL' && unit._status.key !== statusFilter);
    const cssClass = position || `auto-${Math.max(0, floorUnits.indexOf(unit))}`;
    const statusClass = { AVAILABLE: 'available', TAKEN: 'taken', NEEDS_REVIEW: 'review', UNCONFIRMED: 'unconfirmed' }[unit._status.key] || 'unconfirmed';
    return `<button type="button" class="floorplans-unit ${cssClass} ${statusClass} ${dimmed ? 'dimmed' : ''}" data-floorplans-unit="${floorplansEscape(floorplansUnitId(unit))}"><strong>${floorplansEscape(floorplansText(unit.unitname))}</strong><small>${floorplansEscape(floorplansText(unit.description, 'Unit'))}</small><em>${floorplansStatusMarkup(unit._status)}</em></button>`;
}

function floorplansRenderDetails(units) {
    const selected = units.find(unit => floorplansUnitId(unit) === floorplansState.selectedUnitId); const panel = document.getElementById('floorplansDetails');
    if (!panel || !selected) { if (panel) panel.innerHTML = '<div class="floorplans-empty-detail"><span class="material-symbols-outlined">touch_app</span><p>Select an apartment to view its details.</p></div>'; return; }
    const transaction = floorplansState.sales.find(item => floorplansSalesPropertyId(item) === selected._propertyId && floorplansSalesUnitId(item) === floorplansUnitId(selected));
    const detailStatusClass = { AVAILABLE: 'available', TAKEN: 'taken', NEEDS_REVIEW: 'review', UNCONFIRMED: 'unconfirmed' }[selected._status.key] || 'unconfirmed';
    panel.innerHTML = `<h3>${floorplansEscape(floorplansText(selected.unitname))}</h3><span class="floorplans-detail-status ${detailStatusClass}">${floorplansStatusMarkup(selected._status)}</span><dl class="floorplans-detail-grid"><div><dt>Floor</dt><dd>${floorplansEscape(floorplansFloor(selected))}</dd></div><div><dt>Fee name</dt><dd>${floorplansEscape(floorplansText(selected.feename))}</dd></div><div><dt>Description</dt><dd>${floorplansEscape(floorplansText(selected.description))}</dd></div><div><dt>Listed amount</dt><dd>${floorplansEscape(floorplansText(selected.amount ?? selected.rent))}</dd></div>${transaction ? `<div><dt>Payment status</dt><dd>Recorded transaction</dd></div><div><dt>Client</dt><dd>${floorplansEscape(floorplansText(transaction.tenant, 'Restricted'))}</dd></div>` : ''}</dl><p class="floorplans-detail-note">Availability is determined separately from payment amount and expiration date.</p>`;
}

function floorplansRenderList(properties) {
    const list = document.getElementById('floorplansList'); if (!list) return;
    const rows = properties.flatMap(item => floorplansDecoratedUnits(item).filter(floorplansUnitMatchesFilters).map(unit => `<tr data-floorplans-list-unit="${floorplansEscape(floorplansUnitId(unit))}" data-floorplans-list-property="${floorplansEscape(unit._propertyId)}"><td>${floorplansEscape(floorplansPropertyName(item))}</td><td>${floorplansEscape(floorplansFloor(unit))}</td><td>${floorplansEscape(floorplansText(unit.unitname))}</td><td>${floorplansEscape(floorplansText(unit.description))}</td><td>${floorplansEscape(floorplansText(unit.amount ?? unit.rent))}</td><td class="floorplans-status-cell">${floorplansStatusMarkup(unit._status)}</td></tr>`)).join('');
    list.innerHTML = `<table><thead><tr><th>Building</th><th>Floor</th><th>Unit</th><th>Description</th><th>Listed amount</th><th>Status</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No apartments match the current filters.</td></tr>'}</tbody></table>`;
    list.querySelectorAll('[data-floorplans-list-unit]').forEach(row => row.addEventListener('click', () => { floorplansState.selectedPropertyId = row.dataset.floorplansListProperty; floorplansState.selectedFloor = floorplansFloor(floorplansDecoratedUnits(floorplansState.properties.find(item => floorplansPropertyId(item) === floorplansState.selectedPropertyId)).find(unit => floorplansUnitId(unit) === row.dataset.floorplansListUnit)); floorplansState.selectedUnitId = row.dataset.floorplansListUnit; floorplansState.view = 'plan'; document.querySelector('[data-floorplans-view="plan"]')?.click(); }));
}
