(function () {
let salesPaymentReportRows = [];
let salesPaymentReportPage = 1;

function salesPaymentReportText(value, fallback = '—') {
    if (value === undefined || value === null || `${value}`.trim() === '') return fallback;
    return `${value}`.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function salesPaymentReportMoney(value) {
    if (value === undefined || value === null || value === '') return '—';
    const amount = Number(`${value}`.replace(/,/g, ''));
    return Number.isFinite(amount) ? `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}` : '—';
}

function salesPaymentReportResponseRows(response) {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
}

function salesPaymentReportFilteredRows() {
    const query = `${document.getElementById('salesPaymentReportSearch')?.value || ''}`.trim().toLowerCase();
    return query ? salesPaymentReportRows.filter(record => JSON.stringify(record).toLowerCase().includes(query)) : salesPaymentReportRows;
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

    body.innerHTML = pageRows.length ? pageRows.map((record, index) => `<tr>
        <td>${start + index + 1}</td>
        <td>${salesPaymentReportText(record?.propertyname ?? record?.property)}</td>
        <td>${salesPaymentReportText(record?.tenant)}</td>
        <td>${salesPaymentReportText(record?.unitname)}</td>
        <td class="text-right">${salesPaymentReportMoney(record?.amountdue)}</td>
        <td><span class="sales-payment-report-installment">${salesPaymentReportText(record?.status ?? record?.paymentstatus, 'DUE')}</span></td>
        <td><button type="button" class="sales-payment-pay-button" data-sales-payment-row="${salesPaymentReportRows.indexOf(record)}">Pay</button></td>
    </tr>`).join('') : '<tr><td colspan="7">No matching payment records found.</td></tr>';

    const status = document.getElementById('salesPaymentReportPaginationStatus');
    if (status) status.textContent = rows.length ? `Showing ${start + 1} - ${Math.min(start + pageSize, rows.length)} of ${rows.length}` : 'No matching payments found';
    const previous = document.getElementById('salesPaymentReportPrev');
    const next = document.getElementById('salesPaymentReportNext');
    if (previous) previous.disabled = salesPaymentReportPage === 1;
    if (next) next.disabled = salesPaymentReportPage === totalPages;
    const pageNumbers = document.getElementById('pagination-numbers');
    if (pageNumbers) pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, index) => `<button type="button" class="${index + 1 === salesPaymentReportPage ? 'pagination-number active' : 'pagination-number'}" data-payment-report-page="${index + 1}">${index + 1}</button>`).join('');
    pageNumbers?.querySelectorAll('[data-payment-report-page]').forEach(button => button.addEventListener('click', () => {
        salesPaymentReportPage = Number(button.dataset.paymentReportPage);
        salesPaymentReportRender();
    }));
    body.querySelectorAll('[data-sales-payment-row]').forEach(button => button.addEventListener('click', () => {
        const record = salesPaymentReportRows[Number(button.dataset.salesPaymentRow)];
        if (record) salesPaymentReportOpenPayment(record);
    }));
}

function salesPaymentReportOpenPayment(record) {
    const originalSaleId = record?.salerentid ?? record?.saleid ?? record?.salesid ?? record?.originalsaleid ?? record?.rentdata?.id ?? '';
    const feeNameId = record?.feenameid ?? record?.fee_name_id ?? '';
    const hasRequiredIds = `${originalSaleId}`.trim() !== '' && `${feeNameId}`.trim() !== '';
    const modal = document.createElement('div');
    modal.className = 'installment-payment-modal sales-payment-modal';
    modal.innerHTML = `<div class="installment-payment-backdrop" data-sales-payment-close></div>
        <div class="installment-payment-dialog" role="dialog" aria-modal="true" aria-labelledby="salesPaymentDialogTitle">
            <div class="installment-payment-dialog-header"><div><small>Sales payment</small><h2 id="salesPaymentDialogTitle">Record due payment</h2><p>${salesPaymentReportText(record?.tenant)} · ${salesPaymentReportText(record?.propertyname ?? record?.property)} · ${salesPaymentReportText(record?.unitname)}</p></div><button type="button" class="installment-payment-close" data-sales-payment-close aria-label="Close">×</button></div>
            <div class="installment-payment-summary"><div><small>Amount due</small><strong>${salesPaymentReportMoney(record?.amountdue)}</strong></div><div><small>Original sale ID</small><strong>${salesPaymentReportText(originalSaleId, 'Not provided')}</strong></div><div><small>Fee name ID</small><strong>${salesPaymentReportText(feeNameId, 'Not provided')}</strong></div></div>
            <form id="salesPaymentReportForm"><input type="hidden" name="id" value="${salesPaymentReportText(originalSaleId, '')}"><input type="hidden" name="feenameid" value="${salesPaymentReportText(feeNameId, '')}">
                <label>Amount paid<input name="amountpaid" class="form-control" type="number" min="0" step="0.01" value="${Number(record?.amountdue) || ''}" required></label>
                <label>Transaction date<input name="transactiondate" class="form-control" type="date" value="${new Date().toISOString().split('T')[0]}" required></label>
                <div class="sales-payment-missing-id-note" ${hasRequiredIds ? 'hidden' : ''}>This report response does not include the original sale ID or fee name ID, so payment cannot be submitted yet.</div>
                <div class="installment-payment-dialog-actions"><button type="button" class="btn installment-payment-cancel" data-sales-payment-close>Cancel</button><button type="submit" class="btn installment-payment-save" ${hasRequiredIds ? '' : 'disabled'}>Pay</button></div>
            </form>
        </div>`;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelectorAll('[data-sales-payment-close]').forEach(element => element.addEventListener('click', close));
    modal.querySelector('form').addEventListener('submit', async event => {
        event.preventDefault();
        if (!hasRequiredIds) return;
        const form = event.currentTarget;
        const payload = new FormData();
        payload.append('id', originalSaleId);
        payload.append('amountpaid', form.elements.amountpaid.value);
        payload.append('transactiondate', form.elements.transactiondate.value);
        payload.append('feenameid', feeNameId);
        const response = await httpRequest2('../controllers/paysalesschedule', payload, event.submitter, 'json');
        if (!response?.status) return notification(response?.message || 'Unable to save payment.', 0);
        close();
        await fetchSalesPaymentReport();
        notification(response.message || 'Payment saved successfully.', 1);
    });
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
    salesPaymentReportRows = salesPaymentReportResponseRows(response);
    salesPaymentReportPage = 1;
    salesPaymentReportRender();
    if (message) message.textContent = `${salesPaymentReportRows.length} ${isOverdue ? 'overdue' : 'due'} payment${salesPaymentReportRows.length === 1 ? '' : 's'}.`;
}

window.salesPaymentReportActive = salesPaymentReportActive;
})();
