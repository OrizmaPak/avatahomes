(function () {
let salesPaymentReportRows = [];

const salesPaymentReportColumns = [
    ['Client', ['tenant', 'client', 'clientname', 'tenantname', 'tenantdata.firstname', 'customername']],
    ['Property', ['property', 'propertyname', 'propertydata.propertyname']],
    ['Property ID', ['propertyidno', 'propertydata.propertyidno']],
    ['Unit', ['unitname', 'unitdata.unitname']],
    ['Instalment', ['whichinstalment', 'instalmentnumber', 'instalmentno', 'number']],
    ['Due Date', ['duedate']],
    ['Scheduled Amount', ['instalmentamount', 'scheduledamount', 'amountdue']],
    ['Amount Paid', ['amountpaid']],
    ['Balance', ['balance', 'amountremaining', 'remainingamount']],
    ['Status', ['status', 'paymentstatus']],
    ['Sale ID', ['salerentid', 'saleid', 'rentdata.id', 'id']]
];

function salesPaymentReportText(value, fallback = '—') {
    if (value === undefined || value === null || `${value}`.trim() === '') return fallback;
    return `${value}`.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function salesPaymentReportMoney(value) {
    if (value === undefined || value === null || value === '') return '—';
    const amount = Number(`${value}`.replaceAll(',', ''));
    return Number.isFinite(amount) ? `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}` : salesPaymentReportText(value);
}

function salesPaymentReportLookup(record, paths) {
    for (const path of paths) {
        const value = path.split('.').reduce((current, key) => current?.[key], record);
        if (value !== undefined && value !== null && `${value}`.trim() !== '') return value;
    }
    return undefined;
}

function salesPaymentReportResponseRows(response) {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
}

function salesPaymentReportNormalize(records) {
    return records.flatMap(record => {
        const sale = record?.rentdata || record?.sale || {};
        const schedules = record?.instalments || record?.installments || record?.schedules;
        if (!Array.isArray(schedules) || !schedules.length) return [{ ...record, rentdata: sale }];
        return schedules.map((schedule, index) => ({
            ...record,
            ...schedule,
            rentdata: sale,
            whichinstalment: schedule?.whichinstalment ?? schedule?.instalmentnumber ?? index + 1,
            client: record?.tenant ?? record?.client ?? record?.clientname,
            property: record?.property ?? record?.propertyname,
            propertyidno: record?.propertyidno ?? record?.propertydata?.propertyidno,
            unitname: record?.unitname,
            salerentid: schedule?.salerentid ?? sale?.id
        }));
    });
}

function renderSalesPaymentReport() {
    const body = document.getElementById('salesPaymentReportBody');
    if (!body) return;
    const query = `${document.getElementById('salesPaymentReportSearch')?.value || ''}`.trim().toLowerCase();
    const rows = salesPaymentReportRows.filter(record => JSON.stringify(record).toLowerCase().includes(query));
    body.innerHTML = rows.length ? rows.map((record, index) => {
        const cells = salesPaymentReportColumns.map(([label, paths]) => {
            const value = salesPaymentReportLookup(record, paths);
            if (label === 'Scheduled Amount' || label === 'Amount Paid' || label === 'Balance') return `<td class="text-right">${salesPaymentReportMoney(value)}</td>`;
            if (label === 'Client' && !value) {
                const tenant = record?.tenantdata || {};
                return `<td>${salesPaymentReportText([tenant.firstname, tenant.lastname].filter(Boolean).join(' '))}</td>`;
            }
            return `<td>${salesPaymentReportText(value)}</td>`;
        }).join('');
        return `<tr><td>${index + 1}</td>${cells}</tr>`;
    }).join('') : '<tr><td colspan="12">No matching payment records found.</td></tr>';
}

async function salesPaymentReportActive() {
    const page = document.getElementById('salesPaymentReport');
    if (!page || page.dataset.bound) return;
    page.dataset.bound = '1';
    document.getElementById('salesPaymentReportSearch')?.addEventListener('input', renderSalesPaymentReport);
    document.getElementById('salesPaymentReportRefresh')?.addEventListener('click', fetchSalesPaymentReport);
    await fetchSalesPaymentReport();
}

async function fetchSalesPaymentReport() {
    const route = new URLSearchParams(window.location.search).get('r');
    const isOverdue = route === 'overduepayments';
    const controller = isOverdue ? 'fetchoverduepayments' : 'fetchduepaymentsfromsales';
    const message = document.getElementById('salesPaymentReportMessage');
    if (message) message.textContent = isOverdue ? 'Loading overdue payments...' : 'Loading due payments...';
    const response = await httpRequest2(`../controllers/${controller}`, null, document.getElementById('salesPaymentReportRefresh'), 'json');
    if (!response?.status) {
        salesPaymentReportRows = [];
        renderSalesPaymentReport();
        if (message) message.textContent = response?.message || `Unable to retrieve ${isOverdue ? 'overdue' : 'due'} sales payments.`;
        return;
    }
    salesPaymentReportRows = salesPaymentReportNormalize(salesPaymentReportResponseRows(response));
    renderSalesPaymentReport();
    if (message) message.textContent = `${salesPaymentReportRows.length} ${isOverdue ? 'overdue' : 'due'} instalment payment${salesPaymentReportRows.length === 1 ? '' : 's'}.`;
}
window.salesPaymentReportActive = salesPaymentReportActive;
})();
