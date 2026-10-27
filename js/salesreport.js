let salesReportRows = [];
let salesReportPage = 1;

function salesReportText(value, fallback = '—') {
    const text = `${value ?? ''}`.trim();
    return text || fallback;
}

function salesReportEscape(value) {
    return `${value ?? ''}`.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function salesReportMoney(value) {
    const amount = Number(`${value ?? 0}`.replace(/,/g, ''));
    return Number.isFinite(amount) ? amount.toLocaleString() : '0';
}

function salesReportDate(value) {
    const rawValue = `${value ?? ''}`.trim();
    return rawValue ? formatDate(rawValue.split(' ')[0]) : '—';
}

function salesReportIsPendingDiscount(record) {
    const sale = record?.rentdata || {};
    const approvalStatus = `${sale.discountstatus ?? sale.discountapprovalstatus ?? sale.approvalstatus ?? ''}`.trim().toUpperCase();
    return Number(sale.discount || 0) > 0 && ['PENDING', 'PENDING_APPROVAL', 'PENDING APPROVAL'].includes(approvalStatus);
}

function salesReportCompletedSales(records) {
    return (Array.isArray(records) ? records : []).filter(record => {
        const sale = record?.rentdata || {};
        return `${sale.exitmode || ''}`.trim().toUpperCase() === 'SALE' && !salesReportIsPendingDiscount(record);
    });
}

function salesReportFees(record) {
    const fees = Array.isArray(record?.rentalfees) ? record.rentalfees : [];
    const salesFees = fees.filter(fee => {
        const name = `${fee?.feename ?? ''}`.trim().toUpperCase();
        return name.startsWith('SALES ') || name.startsWith('PROPERTY SALES');
    });
    const displayFees = salesFees.length ? salesFees : fees;
    if (!displayFees.length) return '—';
    return `<table class="sales-report-fees-table"><thead><tr><th>Fee name</th><th>Currency</th><th>Amount</th></tr></thead><tbody>${displayFees.map(fee => {
        const currency = salesReportText(fee.currency || fee.currencycode || fee.currency_code, 'NGN');
        return `<tr><td>${salesReportEscape(salesReportText(fee.feename, 'Sales fee'))}</td><td class="sales-report-fee-currency">${salesReportEscape(currency)}</td><td class="sales-report-fee-amount">₦${salesReportMoney(fee.amount)}</td></tr>`;
    }).join('')}</tbody></table>`;
}

function salesReportInstallments(record) {
    const installments = Array.isArray(record?.instalments) ? record.instalments : [];
    const saleId = record?.rentdata?.id;
    if (!installments.length || !saleId) return '<span class="sales-report-no-schedule">No schedule</span>';
    return `<button type="button" class="sales-report-schedule-button" data-sales-report-schedule="${salesReportEscape(saleId)}">View (${installments.length})</button>`;
}

function salesReportShowInstallments(record) {
    const sale = record?.rentdata || {};
    const installments = Array.isArray(record?.instalments) ? record.instalments : [];
    let modal = document.getElementById('salesreportinstallmentmodal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'salesreportinstallmentmodal';
        modal.className = 'sales-report-modal hidden';
        document.body.appendChild(modal);
    }
    const rows = installments.map((installment, index) => `<div class="sales-report-installment-row"><span class="sales-report-installment-index">${index + 1}</span><div><small>Due date</small><strong>${salesReportDate(installment.duedate)}</strong></div><div><small>Scheduled amount</small><strong>₦${salesReportMoney(installment.instalmentamount)}</strong></div><div><small>Amount paid</small><strong>₦${salesReportMoney(installment.amountpaid)}</strong></div><span class="sales-report-installment-status">${salesReportEscape(salesReportText(installment.status, 'Pending'))}</span></div>`).join('');
    modal.innerHTML = `<div class="sales-report-modal-backdrop" data-close-sales-report-modal></div><div class="sales-report-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="salesreportinstallmenttitle"><div class="sales-report-modal-header"><div><span class="sales-report-modal-eyebrow">Sale transaction</span><h2 id="salesreportinstallmenttitle">Instalment schedule</h2><p>${salesReportEscape(salesReportText(record?.property))} · ${salesReportEscape(salesReportText(record?.unitname))}</p></div><div class="sales-report-modal-actions" data-print-exclude><button type="button" class="sales-report-modal-print" data-print-sales-report-schedule><span class="material-symbols-outlined">print</span> Print</button><button type="button" class="sales-report-modal-close" data-close-sales-report-modal aria-label="Close">×</button></div></div><div class="sales-report-modal-summary"><div><small>Client</small><strong>${salesReportEscape(salesReportText(record?.tenant))}</strong></div><div><small>Sales amount</small><strong>₦${salesReportMoney((Number(sale.totalamount) || 0) + (Number(sale.discount) || 0))}</strong></div><div><small>Discount</small><strong>₦${salesReportMoney(sale.discount)}</strong></div><div><small>Final total</small><strong>₦${salesReportMoney(sale.totalamount)}</strong></div><div><small>Amount paid</small><strong>₦${salesReportMoney(sale.amountpaid)}</strong></div><div><small>Status</small><strong>${salesReportEscape(salesReportText(sale.status))}</strong></div></div><div class="sales-report-schedule-list">${rows}</div></div>`;
    modal.classList.remove('hidden');
    modal.querySelectorAll('[data-close-sales-report-modal]').forEach(element => element.addEventListener('click', () => modal.classList.add('hidden')));
    modal.querySelector('[data-print-sales-report-schedule]')?.addEventListener('click', () => printModalContent('salesreportinstallmentmodal', '.sales-report-modal-dialog', 'AVATA HOMES Sales Instalment Schedule'));
}

function salesReportPageSize() {
    return Number(document.getElementById('salesreportpaginationlimit')?.value || 20);
}

function salesReportRender() {
    const body = document.getElementById('salesreporttabledata');
    if (!body) return;
    const pageSize = salesReportPageSize();
    const totalPages = Math.max(1, Math.ceil(salesReportRows.length / pageSize));
    salesReportPage = Math.min(salesReportPage, totalPages);
    const start = (salesReportPage - 1) * pageSize;
    const pageRows = salesReportRows.slice(start, start + pageSize);
    body.innerHTML = pageRows.length ? pageRows.map((record, offset) => {
        const sale = record?.rentdata || {};
        return `<tr>
            <td>${start + offset + 1}</td>
            <td>${salesReportEscape(salesReportText(record.property))}</td>
            <td class="sales-report-fees">${salesReportFees(record)}</td>
            <td>${salesReportEscape(salesReportText(record.tenant))}</td>
            <td>${salesReportEscape(salesReportText(record.unitname))}</td>
            <td class="text-right">₦${salesReportMoney(sale.amountpaid)}</td>
            <td>${salesReportDate(sale.paymentdate)}</td>
            <td>${salesReportEscape(salesReportText(sale.reference))}</td>
            <td>${salesReportInstallments(record)}</td>
        </tr>`;
    }).join('') : '<tr><td colspan="9">No completed sales match the selected filters.</td></tr>';

    const status = document.getElementById('salesreportpaginationstatus');
    if (status) status.textContent = salesReportRows.length ? `Showing ${start + 1} - ${Math.min(start + pageSize, salesReportRows.length)} of ${salesReportRows.length}` : 'No completed sales found';
    const previous = document.getElementById('salesreportprev');
    const next = document.getElementById('salesreportnext');
    if (previous) previous.disabled = salesReportPage === 1;
    if (next) next.disabled = salesReportPage === totalPages;
    const numbers = document.getElementById('salesreportpagenumbers');
    if (numbers) numbers.innerHTML = Array.from({ length: totalPages }, (_, index) => `<button type="button" class="${index + 1 === salesReportPage ? 'pagination-number active' : 'pagination-number'}" data-sales-report-page="${index + 1}">${index + 1}</button>`).join('');
    document.querySelectorAll('[data-sales-report-page]').forEach(button => button.addEventListener('click', () => { salesReportPage = Number(button.dataset.salesReportPage); salesReportRender(); }));
    document.querySelectorAll('[data-sales-report-schedule]').forEach(button => button.addEventListener('click', () => {
        const record = salesReportRows.find(item => `${item?.rentdata?.id}` === button.dataset.salesReportSchedule);
        if (record) salesReportShowInstallments(record);
    }));
}

async function salesreportActive() {
    const form = document.getElementById('salesreportform');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('salesreportstartdate').value = today;
    document.getElementById('salesreportenddate').value = today;
    document.getElementById('salesreportsubmit').addEventListener('click', salesReportLoad);
    document.getElementById('salesreportpaginationlimit').addEventListener('change', () => { salesReportPage = 1; salesReportRender(); });
    document.getElementById('salesreportprev').addEventListener('click', () => { salesReportPage--; salesReportRender(); });
    document.getElementById('salesreportnext').addEventListener('click', () => { salesReportPage++; salesReportRender(); });
}

async function salesReportLoad() {
    if (!validateForm('salesreportform', ['salesreportstartdate', 'salesreportenddate'])) return;
    const form = document.getElementById('salesreportform');
    const payload = getFormData2(form);
    const response = await httpRequest2('../controllers/fetchrentaproperty', payload, document.getElementById('salesreportsubmit'), 'json');
    if (!response?.status) return notification(response?.message || 'Unable to retrieve sales.', 0);
    const records = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
    salesReportRows = salesReportCompletedSales(records);
    salesReportPage = 1;
    salesReportRender();
}

function printSalesReport() {
    const table = document.getElementById('salesreporttable');
    if (!table) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return notification('Unable to open print window. Please allow popups for this site.', 0);
    printWindow.document.write(`<html><head><title>AVATA HOMES Sales Report</title><style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;vertical-align:top}th{background:#64748b;color:#fff}.sales-report-fees div{margin-bottom:4px}.sales-report-fees small{display:block;color:#475569}</style></head><body><h1>AVATA HOMES Sales Report</h1>${table.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); printWindow.print(); };
}

function exportSalesReport() {
    exportToExcel('salesreporttable', 'avata-homes-sales-report');
}
