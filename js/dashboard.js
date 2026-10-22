function dashboardUser() {
    try { return JSON.parse(localStorage.getItem('user') || '{}') || {}; }
    catch { return {}; }
}

function dashboardCan(...permissions) {
    const user = dashboardUser();
    const saved = `${user.permissions || ''}`.toUpperCase().split('|').map(value => value.trim());
    return user.role === 'SUPERADMIN' || permissions.some(permission => saved.includes(permission));
}

function dashboardEscape(value) {
    return `${value ?? ''}`.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function dashboardAmount(value) {
    if (value === null || value === undefined || `${value}`.trim() === '') return null;
    const amount = Number(`${value}`.replace(/,/g, ''));
    return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function dashboardMoney(value) {
    return value === null ? 'Not supplied' : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(value);
}

function dashboardRecords(records) {
    const seen = new Set();
    return records.filter(record => {
        const sale = record?.rentdata || {};
        if (!sale.id) return true;
        if (seen.has(`${sale.id}`)) return false;
        seen.add(`${sale.id}`);
        return true;
    });
}

function dashboardNextPayments(records) {
    const closed = ['PAID', 'FULLY PAID', 'COMPLETED', 'SETTLED', 'CANCELLED', 'VOID'];
    return records.flatMap(record => {
        const sale = record?.rentdata || {};
        if (`${sale.exitmode}`.toUpperCase() !== 'SALE' || ['CANCELLED', 'VOID', 'DELETED'].includes(`${sale.status}`.toUpperCase())) return [];
        const pending = (Array.isArray(record.instalments) ? record.instalments : []).map((schedule, index) => ({
            schedule,
            number: schedule.whichinstalment ?? index + 1,
            status: `${schedule.status || ''}`.trim().toUpperCase().replace(/[_-]+/g, ' '),
            date: /^\d{4}-\d{2}-\d{2}/.test(`${schedule.duedate || ''}`) ? `${schedule.duedate}`.slice(0, 10) : ''
        })).filter(row => !closed.includes(row.status)).sort((first, second) => (first.date || '9999').localeCompare(second.date || '9999'));
        return pending.length ? [{ ...pending[0], record }] : [];
    }).sort((first, second) => (first.date || '9999').localeCompare(second.date || '9999'));
}

async function dashboardActive() {
    const page = document.getElementById('avataDashboard');
    if (!page || page.dataset.bound) return;
    if (!dashboardCan('DASHBOARD')) {
        page.innerHTML = '<p class="dashboard-message">Dashboard access is not enabled for your account. Ask an administrator to grant the DASHBOARD permission.</p>';
        return;
    }
    if (typeof floorplansBindEvents !== 'function') return;
    page.dataset.bound = '1';
    document.getElementById('dashboardDate').textContent = new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const links = [
        ['propertyregistration', 'Register property', ['REGISTER PROPERTY', 'PROPERTY REGISTRATION']],
        ['rentaproperty', 'New sale / rental', ['PROPERTY SALES', 'RENT A PROPERTY']],
        ['installmentpayments', 'Make payments', ['INSTALLMENT PAYMENTS']]
    ];
    document.getElementById('dashboardLinks').innerHTML = links.filter(link => dashboardCan(...link[2])).map(link => `<a href="index.php?r=${link[0]}">${link[1]} <span aria-hidden="true">↗</span></a>`).join('');
    const canViewSales = dashboardCan('VIEW PROPERTY SALES', 'VIEW RENTED PROPERTY');
    const canPay = canViewSales && dashboardCan('INSTALLMENT PAYMENTS');
    const canApprove = dashboardCan('APPROVEDISCOUNT', 'APPROVE SALES DISCOUNTS', 'APPROVAL SALES DISCOUNTS');
    document.getElementById('dashboardFinance').hidden = !canViewSales;
    document.getElementById('dashboardPayments').hidden = !canPay;
    document.getElementById('dashboardApprovals').hidden = !canApprove;
    document.getElementById('dashboardAttention').hidden = !canPay && !canApprove;
    document.getElementById('dashboardFloorLink').hidden = !dashboardCan('FLOOR PLANS');
    document.getElementById('dashboardRefresh').addEventListener('click', dashboardRefresh);
    page.addEventListener('click', event => {
        const link = event.target.closest('a[href^="index.php?r="]');
        if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        routerEvent(new URL(link.href).searchParams.get('r'));
    });
    floorplansBindEvents();
    await dashboardRefresh();
}

async function dashboardRefresh() {
    const page = document.getElementById('avataDashboard');
    const button = document.getElementById('dashboardRefresh');
    if (!page || page.dataset.loading) return;
    page.dataset.loading = '1';
    page.setAttribute('aria-busy', 'true');
    button.disabled = true;
    document.getElementById('dashboardMessage').textContent = 'Refreshing buildings, availability and your permitted summaries…';
    try {
        await Promise.allSettled([floorplansLoad(), dashboardLoadApprovals(page)]);
        if (page !== document.getElementById('avataDashboard')) return;
        dashboardRender();
        document.getElementById('dashboardUpdated').textContent = `Last checked ${new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}`;
    } finally {
        delete page.dataset.loading;
        page.removeAttribute('aria-busy');
        button.disabled = false;
    }
}

async function dashboardLoadApprovals(page) {
    if (!dashboardCan('APPROVEDISCOUNT', 'APPROVE SALES DISCOUNTS', 'APPROVAL SALES DISCOUNTS')) return;
    const target = page.querySelector('#dashboardApprovalSummary');
    target.innerHTML = '<p class="dashboard-empty">Checking requests…</p>';
    try {
        const payload = new FormData();
        payload.append('startdate', '');
        payload.append('enddate', '');
        const response = await httpRequest2('../controllers/fetchsalesdraft', payload, null, 'json');
        if (!page.isConnected) return;
        const records = Array.isArray(response?.data) ? response.data : response?.data?.data;
        if (!response?.status || !Array.isArray(records) || Number(response.data?.totalpages || 1) > 1) throw new Error('Unavailable');
        const pending = dashboardRecords(records).filter(record => `${record.rentdata?.discountstatus || ''}`.toUpperCase() === 'PENDING' && dashboardAmount(record.rentdata?.discount) > 0);
        const unknown = records.filter(record => dashboardAmount(record.rentdata?.discount) > 0 && !['PENDING', 'APPROVED', 'DENIED', 'DECLINED', 'REJECTED'].includes(`${record.rentdata?.discountstatus || ''}`.toUpperCase()));
        target.innerHTML = `<strong class="dashboard-approval-count">${pending.length.toLocaleString()}</strong><p>${pending.length === 1 ? 'request awaits' : 'requests await'} your review</p>${unknown.length ? `<p class="dashboard-note">${unknown.length} request(s) have an unrecognised status. Check the approval list.</p>` : ''}`;
    } catch {
        if (page.isConnected) target.innerHTML = '<p class="dashboard-empty">Approval requests are unavailable. Refresh to retry.</p>';
    }
}

function dashboardRender() {
    const ready = floorplansState.propertiesLoaded;
    const units = floorplansState.properties.flatMap(floorplansDecoratedUnits);
    const counts = { Available: 0, Sold: 0, Rented: 0, 'Needs review': 0, Unconfirmed: 0 };
    units.forEach(unit => { counts[unit._status.label] = (counts[unit._status.label] || 0) + 1; });
    const message = document.getElementById('dashboardMessage');
    message.textContent = !ready ? 'Buildings could not be loaded. Refresh to try again; unavailable data is not counted as zero.'
        : !floorplansState.salesLoaded ? 'Partial overview: sales records are unavailable. Unverified units are Unconfirmed and payment summaries are hidden.'
        : 'Portfolio-wide totals from the latest fetched records. Floor-plan filters only affect the explorer below.';
    const metrics = [
        ['Buildings', floorplansState.properties.length, 'Registered properties', 'neutral'],
        ['Apartments', units.length, 'Registered units across all buildings', 'neutral'],
        ['Available', counts.Available, 'Ready to explore', 'available'],
        ['Sold / Rented', counts.Sold + counts.Rented, `${counts.Sold} sold · ${counts.Rented} rented`, 'occupied']
    ];
    document.getElementById('dashboardMetrics').innerHTML = metrics.map(metric => `<article class="dashboard-metric ${metric[3]}"><span>${metric[0]}</span><strong>${ready ? metric[1].toLocaleString() : '—'}</strong><small>${ready ? metric[2] : 'Data unavailable'}</small></article>`).join('');
    const palette = ['#258566', '#c55b57', '#6275b5', '#d49c35', '#a2aab8'];
    let offset = 0;
    const segments = Object.keys(counts).map((label, index) => {
        const start = offset;
        offset += units.length ? counts[label] / units.length * 100 : 0;
        return `${palette[index]} ${start}% ${offset}%`;
    });
    document.getElementById('dashboardMix').innerHTML = ready ? `<div class="dashboard-ring" style="background:${units.length ? `conic-gradient(${segments.join(',')})` : '#e7e9ec'}" role="img" aria-label="${dashboardEscape(Object.entries(counts).map(([label, count]) => `${count} ${label}`).join(', '))}"><div><strong>${units.length ? Math.round(counts.Available / units.length * 100) + '%' : '—'}</strong><span>available</span></div></div><ul>${Object.keys(counts).map((label, index) => `<li><span><i style="background:${palette[index]}"></i>${label}</span><strong>${counts[label].toLocaleString()}</strong></li>`).join('')}</ul>` : '<p class="dashboard-empty">Availability could not be loaded.</p>';
    document.getElementById('dashboardBuildings').innerHTML = floorplansState.properties.map(property => {
        const propertyUnits = floorplansDecoratedUnits(property);
        const available = propertyUnits.filter(unit => unit._status.key === 'AVAILABLE').length;
        const floors = new Set(propertyUnits.map(floorplansFloor).filter(floor => floor !== 'Floor not assigned')).size;
        return `<button type="button" class="dashboard-building" data-dashboard-building="${dashboardEscape(floorplansPropertyId(property))}"><span class="dashboard-building-name">${dashboardEscape(floorplansPropertyName(property))}<small>${floors} assigned floors · ${propertyUnits.length} units</small></span><strong>${available}<small>available</small></strong><span class="dashboard-building-track"><i style="width:${propertyUnits.length ? available / propertyUnits.length * 100 : 0}%"></i></span></button>`;
    }).join('') || `<p class="dashboard-empty">${ready ? 'No registered buildings yet.' : 'Building data is unavailable.'}</p>`;
    document.querySelectorAll('[data-dashboard-building]').forEach(button => button.addEventListener('click', () => {
        floorplansState.selectedPropertyId = button.dataset.dashboardBuilding;
        floorplansState.selectedFloor = '';
        floorplansState.selectedUnitId = '';
        document.getElementById('floorplansSearch').value = '';
        document.getElementById('floorplansStatus').value = 'ALL';
        document.querySelector('[data-floorplans-view="plan"]').click();
        document.getElementById('floorplansBuilding').focus({ preventScroll: true });
        document.getElementById('floorplansPage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    if (dashboardCan('VIEW PROPERTY SALES', 'VIEW RENTED PROPERTY')) dashboardRenderTransactions();
}

function dashboardRenderTransactions() {
    const finance = document.getElementById('dashboardFinanceValues');
    const payments = document.getElementById('dashboardPaymentRows');
    if (!floorplansState.salesLoaded) {
        finance.innerHTML = '<p class="dashboard-empty">Transaction data is unavailable. Refresh to retry.</p>';
        payments.innerHTML = '<p class="dashboard-empty">Instalment schedules are unavailable.</p>';
        return;
    }
    const records = dashboardRecords(floorplansState.sales).filter(record => !['CANCELLED', 'VOID', 'DELETED'].includes(`${record.rentdata?.status}`.toUpperCase()));
    const totals = { SALE: 0, RENT: 0, paid: 0, balance: 0 };
    let excluded = 0;
    records.forEach(record => {
        const sale = record.rentdata || {};
        const mode = `${sale.exitmode}`.toUpperCase();
        const total = dashboardAmount(sale.totalamount);
        const paid = dashboardAmount(sale.amountpaid);
        if (!['SALE', 'RENT'].includes(mode) || total === null || paid === null) { excluded++; return; }
        totals[mode] += total;
        totals.paid += paid;
        totals.balance += Math.max(0, total - paid);
    });
    finance.innerHTML = [['Sales final value', totals.SALE], ['Rental final value', totals.RENT], ['Recorded amount paid', totals.paid], ['Outstanding balance', totals.balance]].map(([label, amount]) => `<div><span>${label}</span><strong>${dashboardMoney(amount)}</strong></div>`).join('');
    document.getElementById('dashboardFinanceNote').textContent = `Final totals are after discount; amount paid is taken from each sale/rental record, not added again from instalments. Cancelled/void records are excluded. ${excluded ? `${excluded} record(s) excluded because amounts or transaction type were not supplied. ` : ''}This is not a general-ledger report.`;
    if (!dashboardCan('INSTALLMENT PAYMENTS')) return;
    const next = dashboardNextPayments(records);
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    payments.innerHTML = next.slice(0, 5).map(row => {
        const knownStatus = ['PENDING', 'UNPAID', 'PARTIAL', 'PARTIALLY PAID', 'OPEN'].includes(row.status);
        const timing = !knownStatus ? 'Check status' : !row.date ? 'Date not supplied' : row.date < todayKey ? 'Overdue' : row.date === todayKey ? 'Due today' : 'Upcoming';
        return `<article class="dashboard-payment"><div><strong>${dashboardEscape(row.record.tenant || 'Client not supplied')}</strong><span>${dashboardEscape(row.record.property || 'Property')} · ${dashboardEscape(row.record.unitname || 'Unit')}</span><small>Instalment ${dashboardEscape(row.number)} · ${dashboardEscape(row.date || 'No due date')}</small></div><div><span class="dashboard-chip ${timing === 'Overdue' ? 'overdue' : ''}">${timing}</span><strong>${dashboardMoney(dashboardAmount(row.schedule.instalmentamount))}</strong><small>Paid: ${dashboardMoney(dashboardAmount(row.schedule.amountpaid))}</small></div></article>`;
    }).join('') || '<p class="dashboard-empty">No outstanding instalments in the returned schedules.</p>';
    if (next.length > 5) payments.innerHTML += `<p class="dashboard-note">Showing the earliest 5 of ${next.length} sales with remaining instalments.</p>`;
}
