let installmentPaymentRows = [];

function installmentPaymentText(value, fallback = 'N/A') { const text = `${value ?? ''}`.trim(); return text || fallback; }
function installmentPaymentMoney(value) { const amount = Number(value || 0); return Number.isFinite(amount) ? `₦${amount.toLocaleString()}` : '₦0'; }
function installmentPaymentMode(record) { return `${record?.rentdata?.exitmode || ''}`.toUpperCase() === 'RENT' ? 'Rented' : 'Sold'; }
function installmentPaymentRowsFromResponse(response) { return Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.data) ? response.data.data : []; }

function buildInstallmentPaymentRows(records) {
    return records.flatMap(record => {
        const sale = record?.rentdata || {};
        const schedules = Array.isArray(record?.instalments) ? record.instalments : [];
        const remaining = schedules.filter(item => !['PAID', 'COMPLETED', 'SETTLED', 'CANCELLED'].includes(`${item?.status || ''}`.toUpperCase()));
        const nextId = remaining.slice().sort((a, b) => `${a?.duedate || ''}`.localeCompare(`${b?.duedate || ''}`))[0]?.id;
        return schedules.map((schedule, index) => ({
            record,
            sale,
            schedule,
            index,
            remaining: remaining.includes(schedule),
            isNext: `${schedule?.id}` === `${nextId}`
        }));
    });
}

function renderInstallmentPayments() {
    const query = `${document.getElementById('installmentPaymentsSearch')?.value || ''}`.trim().toLowerCase();
    const filter = document.getElementById('installmentPaymentsStatus')?.value || 'REMAINING';
    const rows = installmentPaymentRows.filter(row => (filter === 'ALL' || row.remaining) && `${row.record?.tenant || ''} ${row.record?.property || ''} ${row.record?.unitname || ''}`.toLowerCase().includes(query));
    const table = document.getElementById('installmentPaymentsTable');
    if (!table) return;
    table.innerHTML = rows.length ? rows.map((row, index) => `<tr><td>${index + 1}</td><td>${installmentPaymentText(row.record?.tenant)}</td><td>${installmentPaymentText(row.record?.property)}</td><td>${installmentPaymentText(row.record?.unitname)}</td><td><span class="installment-mode ${installmentPaymentMode(row.record).toLowerCase()}">${installmentPaymentMode(row.record)}</span></td><td>${row.index + 1}</td><td>${installmentPaymentText(row.schedule?.duedate)}</td><td class="text-right">${installmentPaymentMoney(row.schedule?.instalmentamount)}</td><td><span class="installment-status ${row.remaining ? 'pending' : 'paid'}">${installmentPaymentText(row.schedule?.status)}</span></td><td>${row.isNext && row.remaining ? `<button type="button" class="installment-record-button" data-installment-payment="${row.sale.id}">Make Payments</button>` : row.remaining ? '<span class="installment-next-note">Complete earlier payment first</span>' : '—'}</td></tr>`).join('') : '<tr><td colspan="10">No installment payments found.</td></tr>';
    table.querySelectorAll('[data-installment-payment]').forEach(button => button.addEventListener('click', () => {
        const row = installmentPaymentRows.find(item => item.isNext && item.remaining && `${item.sale.id}` === `${button.dataset.installmentPayment}`);
        if (row) openInstallmentPaymentDialog(row);
    }));
}

function openInstallmentPaymentDialog(row) {
    const modal = document.createElement('div');
    modal.className = 'installment-payment-modal';
    modal.innerHTML = `<div class="installment-payment-backdrop"></div><div class="installment-payment-dialog" role="dialog" aria-modal="true"><div class="installment-payment-dialog-header"><div><small>${installmentPaymentMode(row.record)} transaction</small><h2>Record installment payment</h2><p>${installmentPaymentText(row.record?.tenant)} · ${installmentPaymentText(row.record?.property)} · ${installmentPaymentText(row.record?.unitname)}</p></div><button type="button" class="installment-payment-close" aria-label="Close">×</button></div><div class="installment-payment-summary"><div><small>Original sale ID</small><strong>${row.sale.id}</strong></div><div><small>Due date</small><strong>${installmentPaymentText(row.schedule?.duedate)}</strong></div><div><small>Scheduled amount</small><strong>${installmentPaymentMoney(row.schedule?.instalmentamount)}</strong></div></div><form id="installmentPaymentForm"><label>Amount paid<input id="installmentPaymentAmount" name="amountpaid" class="form-control" type="number" min="0" step="0.01" required></label><label>Transaction date<input id="installmentPaymentDate" name="transactiondate" class="form-control" type="date" value="${new Date().toISOString().split('T')[0]}" required></label><label class="hidden">Payment method<select id="installmentPaymentMethod" name="paymentmethod" class="form-control"><option value="">Select payment method</option><option value="TRANSFER">Transfer</option><option value="CASH">Cash</option><option value="POS">POS</option><option value="CHECK">Check</option></select></label><label class="hidden">Payment details<textarea id="installmentPaymentDetail" name="paymentdetail" class="form-control" rows="3" placeholder="Bank, account, cheque or other payment information"></textarea></label><div class="installment-payment-dialog-actions"><button type="button" class="btn installment-payment-cancel">Cancel</button><button type="submit" class="btn installment-payment-save">Pay</button></div></form><p class="installment-payment-controller-note hidden">The save controller will receive <code>id</code>, <code>amountpaid</code>, <code>transactiondate</code>, <code>paymentmethod</code>, and <code>paymentdetail</code>.</p></div>`;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.installment-payment-close').addEventListener('click', close);
    modal.querySelector('.installment-payment-cancel').addEventListener('click', close);
    modal.querySelector('.installment-payment-backdrop').addEventListener('click', close);
    const method = modal.querySelector('#installmentPaymentMethod');
    const detail = modal.querySelector('#installmentPaymentDetail');
    const updatePaymentDetailRequirement = () => {
        const needsDetail = ['TRANSFER', 'CHECK'].includes(method.value);
        detail.required = needsDetail;
        detail.placeholder = method.value === 'TRANSFER' ? 'Bank name and account details' : method.value === 'CHECK' ? 'Cheque number and bank details' : 'Optional payment information';
    };
    method.addEventListener('change', updatePaymentDetailRequirement);
    modal.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);
        payload.set('id', row.sale.id);
        window.pendingInstallmentPaymentPayload = payload;
        notification('Payment details are ready. The save controller is still pending.', 0);
    });
}

async function installmentpaymentsActive() {
    const page = document.getElementById('installmentPaymentsPage');
    if (!page || page.dataset.bound) return;
    page.dataset.bound = '1';
    document.getElementById('installmentPaymentsSearch')?.addEventListener('input', renderInstallmentPayments);
    document.getElementById('installmentPaymentsStatus')?.addEventListener('change', renderInstallmentPayments);
    document.getElementById('installmentPaymentsRefresh')?.addEventListener('click', fetchInstallmentPayments);
    await fetchInstallmentPayments();
}

async function fetchInstallmentPayments() {
    const message = document.getElementById('installmentPaymentsMessage');
    const response = await httpRequest2('../controllers/fetchrentaproperty', null, document.getElementById('installmentPaymentsRefresh'), 'json');
    if (!response?.status) { installmentPaymentRows = []; renderInstallmentPayments(); if (message) message.textContent = response?.message || 'Unable to retrieve installment schedules.'; return; }
    installmentPaymentRows = buildInstallmentPaymentRows(installmentPaymentRowsFromResponse(response));
    renderInstallmentPayments();
    if (message) message.textContent = `${installmentPaymentRows.filter(row => row.remaining).length} remaining installment payment(s).`;
}
