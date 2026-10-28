(function () {
let salesPaymentReportRows = [];
let salesPaymentReportPage = 1;

function salesPaymentReportText(value, fallback = '—') {
    if (value === undefined || value === null || `${value}`.trim() === '') return fallback;
    return `${value}`.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function salesPaymentReportLookup(record, paths) {
    for (const path of paths) {
        const value = path.split('.').reduce((current, key) => current?.[key], record);
        if (value !== undefined && value !== null && `${value}`.trim() !== '') return value;
    }
    return undefined;
}

function salesPaymentReportMoney(value) {
    if (value === undefined || value === null || value === '') return '—';
    const amount = Number(`${value}`.replace(/,/g, ''));
    return Number.isFinite(amount) ? `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}` : salesPaymentReportText(value);
}

function salesPaymentReportDate(value) {
    const date = `${value ?? ''}`.trim().split(' ')[0];
    return date ? salesPaymentReportText(typeof formatDate === 'function' ? formatDate(date) : date) : '—';
}

function salesPaymentReportClient(record) {
    const client = record?.tenant ?? record?.client ?? record?.clientname ?? record?.tenantname;
    if (typeof client === 'string' || typeof client === 'number') return salesPaymentReportText(client);
    const tenant = record?.tenantdata || client || {};
    return salesPaymentReportText([tenant.firstname, tenant.lastname].filter(Boolean).join(' '));
}

function salesPaymentReportProperty(record) {
    const property = record?.property ?? record?.propertyname ?? record?.propertydata?.propertyname ?? record?.rentdata?.propertyname;
    if (typeof property === 'string' || typeof property === 'number') return salesPaymentReportText(property);
    return salesPaymentReportText(property?.propertyname ?? property?.name);
}

function salesPaymentReportFees(record) {
    const fees = record?.rentalfees || record?.fees || record?.rentdata?.rentalfees || [];
    if (!Array.isArray(fees) || !fees.length) return '<span class="sales-payment-report-muted">—</span>';
    const salesFees = fees.filter(fee => `${fee?.feename ?? fee?.feename_name ?? fee?.fee_name ?? fee?.name ?? ''}`.trim().toUpperCase().startsWith('SALES ') || `${fee?.feename ?? fee?.feename_name ?? fee?.fee_name ?? fee?.name ?? ''}`.trim().toUpperCase().startsWith('PROPERTY SALES'));
    const shownFees = salesFees.length ? salesFees : fees;
    return `<div class="sales-payment-report-fees">${shownFees.map(fee => `<div><span>${salesPaymentReportText(fee?.feename ?? fee?.feename_name ?? fee?.fee_name ?? fee?.name, 'Sales fee')}</span><small>${salesPaymentReportText(fee?.currency ?? fee?.currencycode ?? fee?.currency_code, 'NGN')}</small><strong>₦${salesPaymentReportMoney(fee?.amount).replace(/^₦/, '')}</strong></div>`).join('')}</div>`;
}

function salesPaymentReportResponseRows(response) {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
}

function salesPaymentReportNormalize(records) {
    return records.flatMap(record => {
        const sale = record?.rentdata || record?.sale || {};
        let schedules = record?.instalments || record?.installments || record?.schedules;
        if (!Array.isArray(schedules)) {
            const schedule = record?.instalmentdata || record?.installmentdata || record?.schedule || record?.installment;
            schedules = schedule && typeof schedule === 'object' ? [schedule] : [];
        }
        if (!schedules.length) return [{ ...record, rentdata: sale }];
        return schedules.map((schedule, index) => ({
            ...record,
            ...schedule,
            rentdata: sale,
            whichinstalment: schedule?.whichinstalment ?? schedule?.instalmentnumber ?? schedule?.instalmentno ?? index + 1,
            salerentid: schedule?.salerentid ?? sale?.id
        }));
    });
}

function salesPaymentReportFilteredRows() {
    const query = `${document.getElementById('salesPaymentReportSearch')?.value || ''}`.trim().toLowerCase();
    if (!query) return salesPaymentReportRows;
    return salesPaymentReportRows.filter(record => JSON.stringify(record).toLowerCase().includes(query));
}

function salesPaymentReportRender() {
    const body = document.getElementById('salesPaymentReportBody');
    if (!body) return;
    const rows = salesPaymentReportFilteredRows();
    const pageSize = Number(document.getElementById('salesPaymentReportPageSize')?.value || 20);
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    salesPaymentReportPage = Math.min(Math.max(1, salesPaymentReportPage), totalPages);
    const start = (salesPaymentReportPage - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    body.innerHTML = pageRows.length ? pageRows.map((record, index) => {
        const sale = record?.rentdata || {};
        const scheduledAmount = salesPaymentReportLookup(record, ['instalmentamount', 'amountdue', 'dueamount', 'payabledue', 'payable_due', 'paymentdue', 'scheduledamount', 'amount', 'rentdata.totalamount']);
        const amountPaid = salesPaymentReportLookup(record, ['amountpaid', 'paidamount', 'rentdata.amountpaid', 'lastrentdata.amountpaid']);
        const dueDate = salesPaymentReportLookup(record, ['duedate', 'due_date', 'transactiondate', 'paymentdate']);
        const reference = salesPaymentReportLookup(record, ['reference', 'rentdata.reference']);
        const installmentNumber = salesPaymentReportLookup(record, ['whichinstalment', 'instalmentnumber', 'instalmentno']);
        const installmentStatus = salesPaymentReportLookup(record, ['status', 'paymentstatus']);
        const installmentLabel = [installmentNumber ? `#${installmentNumber}` : '', installmentStatus || 'Due'].filter(Boolean).join(' · ');
        return `<tr>
            <td>${start + index + 1}</td>
            <td>${salesPaymentReportProperty(record)}</td>
            <td>${salesPaymentReportFees(record)}</td>
            <td>${salesPaymentReportClient(record)}</td>
            <td>${salesPaymentReportText(record?.unitname ?? record?.unitdata?.unitname ?? record?.rentdata?.unitname)}</td>
            <td class="text-right">${salesPaymentReportMoney(scheduledAmount)}</td>
            <td class="text-right">${salesPaymentReportMoney(amountPaid)}</td>
            <td>${salesPaymentReportDate(dueDate)}</td>
            <td>${salesPaymentReportText(reference ?? sale.reference)}</td>
            <td><span class="sales-payment-report-installment">${salesPaymentReportText(installmentLabel)}</span></td>
        </tr>`;
    }).join('') : '<tr><td colspan="10">No matching payment records found.</td></tr>';

    const status = document.getElementById('salesPaymentReportPaginationStatus');
    if (status) status.textContent = rows.length ? `Showing ${start + 1} - ${Math.min(start + pageSize, rows.length)} of ${rows.length}` : 'No matching payments found';
    const previous = document.getElementById('salesPaymentReportPrev');
    const next = document.getElementById('salesPaymentReportNext');
    if (previous) previous.disabled = salesPaymentReportPage === 1;
    if (next) next.disabled = salesPaymentReportPage === totalPages;
    const pageNumbers = document.getElementById('salesPaymentReportPageNumbers');
    if (pageNumbers) pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, index) => `<button type="button" class="${index + 1 === salesPaymentReportPage ? 'pagination-number active' : 'pagination-number'}" data-payment-report-page="${index + 1}">${index + 1}</button>`).join('');
    pageNumbers?.querySelectorAll('[data-payment-report-page]').forEach(button => button.addEventListener('click', () => {
        salesPaymentReportPage = Number(button.dataset.paymentReportPage);
        salesPaymentReportRender();
    }));
}

async function salesPaymentReportActive() {
    const page = document.getElementById('salesPaymentReport');
    if (!page || page.dataset.bound) return;
    page.dataset.bound = '1';
    document.getElementById('salesPaymentReportSearch')?.addEventListener('input', () => { salesPaymentReportPage = 1; salesPaymentReportRender(); });
    document.getElementById('salesPaymentReportPageSize')?.addEventListener('change', () => { salesPaymentReportPage = 1; salesPaymentReportRender(); });
    document.getElementById('salesPaymentReportPrev')?.addEventListener('click', () => { salesPaymentReportPage--; salesPaymentReportRender(); });
    document.getElementById('salesPaymentReportNext')?.addEventListener('click', () => { salesPaymentReportPage++; salesPaymentReportRender(); });
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
        salesPaymentReportRender();
        if (message) message.textContent = response?.message || `Unable to retrieve ${isOverdue ? 'overdue' : 'due'} sales payments.`;
        return;
    }
    salesPaymentReportRows = salesPaymentReportNormalize(salesPaymentReportResponseRows(response));
    salesPaymentReportPage = 1;
    salesPaymentReportRender();
    if (message) message.textContent = `${salesPaymentReportRows.length} ${isOverdue ? 'overdue' : 'due'} instalment payment${salesPaymentReportRows.length === 1 ? '' : 's'}.`;
}

window.salesPaymentReportActive = salesPaymentReportActive;
})();
