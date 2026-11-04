let discountDraftRow = 0;

function discountEscape(value) {
    return `${value ?? ''}`.replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[character]);
}

function discountRecords(response) {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
}

function discountValue(record) {
    return record?.discount ?? record?.discountpercentage ?? record?.discount_percent ?? record?.discountvalue ?? '';
}

function discountInstalments(record) {
    return record?.numberofinstalment ?? record?.numberofinstallment ?? record?.instalments ?? '';
}

function renumberDiscountRows() {
    document.querySelectorAll('#discountentryrows tr').forEach((row, index) => {
        const number = row.querySelector('[data-discount-row-number]');
        if (number) number.textContent = index + 1;
    });
}

function addDiscountRow(values = {}) {
    const body = document.getElementById('discountentryrows');
    if (!body) return;
    discountDraftRow += 1;
    const row = document.createElement('tr');
    row.dataset.discountRow = discountDraftRow;
    row.innerHTML = `
        <td data-discount-row-number></td>
        <td><input type="number" name="rulepercentage" class="form-control discount-value" min="0" max="100" step="0.01" inputmode="decimal" value="${discountEscape(values.discount || '')}" placeholder="e.g. 5"></td>
        <td><input type="number" name="ruleinstalmentcount" class="form-control discount-instalments" min="1" step="1" inputmode="numeric" value="${discountEscape(values.numberofinstalment || '')}" placeholder="e.g. 6"></td>
        <td><button type="button" class="discount-remove-button" title="Remove row" aria-label="Remove row"><span class="material-symbols-outlined">remove</span></button></td>`;
    row.querySelector('.discount-remove-button').addEventListener('click', () => {
        row.remove();
        if (!body.children.length) addDiscountRow();
        renumberDiscountRows();
    });
    body.appendChild(row);
    renumberDiscountRows();
}

async function fetchDiscountData() {
    const body = document.getElementById('discountstabledata');
    const button = document.getElementById('discountrefresh');
    if (body) body.innerHTML = '<tr><td colspan="3" class="text-center opacity-70">Loading discount rules...</td></tr>';
    const response = await httpRequest2('../controllers/fetchdiscountdata', null, button, 'json');
    if (!response?.status) {
        if (body) body.innerHTML = '<tr><td colspan="3" class="text-center opacity-70">No discount rules retrieved.</td></tr>';
        return notification(response?.message || 'Unable to retrieve discount rules.', 0);
    }
    const records = discountRecords(response);
    if (body) body.innerHTML = records.length ? records.map((record, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><span class="discount-percent-badge">${discountEscape(discountValue(record))}%</span></td>
            <td>${discountEscape(discountInstalments(record))}</td>
        </tr>`).join('') : '<tr><td colspan="3" class="text-center opacity-70">No discount rules have been saved.</td></tr>';
}

async function submitDiscountData() {
    const rows = [...document.querySelectorAll('#discountentryrows tr')];
    if (!rows.length) return notification('Add at least one discount rule.', 0);
    const payload = new FormData();
    for (let index = 0; index < rows.length; index += 1) {
        const discount = Number(rows[index].querySelector('.discount-value')?.value);
        const instalments = Number(rows[index].querySelector('.discount-instalments')?.value);
        if (!Number.isFinite(discount) || discount < 0 || discount > 100) return notification(`Enter a discount between 0 and 100 on row ${index + 1}.`, 0);
        if (!Number.isInteger(instalments) || instalments < 1) return notification(`Enter a valid number of instalments on row ${index + 1}.`, 0);
        payload.append(`discount${index + 1}`, discount.toString());
        payload.append(`numberofinstalment${index + 1}`, instalments.toString());
    }
    payload.append('rowcount', rows.length.toString());
    const response = await httpRequest2('../controllers/adddiscountdata', payload, document.getElementById('discountsubmit'), 'json');
    if (!response?.status) return notification(response?.message || 'Unable to save discount rules.', 0);
    notification(response?.message || 'Discount rules saved successfully.', 1);
    document.getElementById('discountentryrows').innerHTML = '';
    addDiscountRow();
    await fetchDiscountData();
}

async function discountsActive() {
    const page = document.querySelector('.discounts-page');
    if (!page || page.dataset.bound === 'true') return;
    page.dataset.bound = 'true';
    document.getElementById('discountaddrow')?.addEventListener('click', () => addDiscountRow());
    document.getElementById('discountsubmit')?.addEventListener('click', submitDiscountData);
    document.getElementById('discountrefresh')?.addEventListener('click', fetchDiscountData);
    addDiscountRow();
    await fetchDiscountData();
}
