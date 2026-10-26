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
    return displayFees.length
        ? displayFees.map(fee => `<div><strong>${salesReportEscape(salesReportText(fee.feename, 'Sales fee'))}</strong><small>₦${salesReportMoney(fee.amount)}</small></div>`).join('')
        : '—';
}

function salesReportInstallments(record) {
    const installments = Array.isArray(record?.instalments) ? record.instalments : [];
    if (!installments.length) return '—';
    return `${installments.length} schedule${installments.length === 1 ? '' : 's'}`;
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
            <td class="text-right">₦${salesReportMoney(sale.otherfees)}</td>
            <td>${salesReportDate(sale.paymentdate)}</td>
            <td>${salesReportEscape(salesReportText(sale.reference))}</td>
            <td>${salesReportInstallments(record)}</td>
        </tr>`;
    }).join('') : '<tr><td colspan="10">No completed sales match the selected filters.</td></tr>';

    const status = document.getElementById('salesreportpaginationstatus');
    if (status) status.textContent = salesReportRows.length ? `Showing ${start + 1} - ${Math.min(start + pageSize, salesReportRows.length)} of ${salesReportRows.length}` : 'No completed sales found';
    const previous = document.getElementById('salesreportprev');
    const next = document.getElementById('salesreportnext');
    if (previous) previous.disabled = salesReportPage === 1;
    if (next) next.disabled = salesReportPage === totalPages;
    const numbers = document.getElementById('salesreportpagenumbers');
    if (numbers) numbers.innerHTML = Array.from({ length: totalPages }, (_, index) => `<button type="button" class="${index + 1 === salesReportPage ? 'pagination-number active' : 'pagination-number'}" data-sales-report-page="${index + 1}">${index + 1}</button>`).join('');
    document.querySelectorAll('[data-sales-report-page]').forEach(button => button.addEventListener('click', () => { salesReportPage = Number(button.dataset.salesReportPage); salesReportRender(); }));
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
