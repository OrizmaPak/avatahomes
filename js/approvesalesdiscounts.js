let salesApprovalRows = [];
let selectedSalesApproval = null;

function salesApprovalResponseRows(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (response?.data && typeof response.data === 'object') return [response.data];
  return [];
}

function salesApprovalText(item, ...keys) {
  const sale = item?.rentdata || {};
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item[key] !== '') return item[key];
    if (sale[key] !== undefined && sale[key] !== null && sale[key] !== '') return sale[key];
  }
  return '';
}

function salesApprovalClient(item) { return salesApprovalText(item, 'client', 'tenant', 'clientname', 'tenantname') || `${item?.firstname || ''} ${item?.lastname || ''}`.trim() || 'N/A'; }
function salesApprovalUnit(item) { return salesApprovalText(item, 'unit', 'unitname', 'unit_name') || item?.unitdata?.unitname || 'N/A'; }
function salesApprovalProperty(item) { return salesApprovalText(item, 'property', 'propertyname', 'property_name') || item?.propertydata?.propertyname || 'N/A'; }
function salesApprovalMoney(value) { const number = Number(value || 0); return Number.isFinite(number) ? `₦${number.toLocaleString()}` : '₦0'; }
function salesApprovalOriginalAmount(item) { return (Number(salesApprovalText(item, 'totalamount')) || 0) + (Number(salesApprovalText(item, 'discount')) || 0); }
function salesApprovalStatus(item) { return `${salesApprovalText(item, 'discountstatus', 'discountapprovalstatus', 'approvalstatus', 'status') || 'PENDING'}`.toUpperCase(); }
function salesApprovalStatusMarkup(status) { return `<span class="approval-status approval-status-${status.toLowerCase().replace(/\s+/g, '_')}">${status.replace(/_/g, ' ')}</span>`; }

function renderSalesApprovalList() {
  const query = `${document.getElementById('salesapprovalsearch')?.value || ''}`.trim().toLowerCase();
  const table = document.getElementById('salesapprovaltable');
  if (!table) return;
  const rows = salesApprovalRows.filter(item => `${salesApprovalClient(item)} ${salesApprovalProperty(item)} ${salesApprovalUnit(item)} ${salesApprovalText(item, 'reference', 'id')}`.toLowerCase().includes(query));
  table.innerHTML = rows.length ? rows.map((item) => {
    const id = salesApprovalText(item, 'id', 'saleid', 'rentid');
    const instalments = Array.isArray(item?.instalments) ? item.instalments.length : salesApprovalText(item, 'numberofinstalment');
    return `<tr data-approval-id="${id}"><td>${salesApprovalClient(item)}</td><td>${salesApprovalProperty(item)}</td><td>${salesApprovalUnit(item)}</td><td>${salesApprovalMoney(salesApprovalOriginalAmount(item))}</td><td>${salesApprovalMoney(salesApprovalText(item, 'totalamount'))}</td><td>${salesApprovalMoney(salesApprovalText(item, 'discount'))}</td><td>${instalments || 'N/A'}</td><td>${salesApprovalText(item, 'exitmode') || 'N/A'}</td><td>${salesApprovalStatusMarkup(salesApprovalStatus(item))}</td></tr>`;
  }).join('') : '<tr><td colspan="9">No pending approvals found.</td></tr>';
  table.querySelectorAll('[data-approval-id]').forEach(row => row.addEventListener('click', () => selectSalesApproval(row.dataset.approvalId)));
}

function selectSalesApproval(id) {
  selectedSalesApproval = salesApprovalRows.find(item => `${salesApprovalText(item, 'id', 'saleid', 'rentid')}` === `${id}`) || null;
  renderSalesApprovalDetail();
}

async function fetchSalesApprovalDetail(id) {
  selectedSalesApproval = salesApprovalRows.find(item => `${salesApprovalText(item, 'id', 'saleid', 'rentid')}` === `${id}`) || null;
  renderSalesApprovalDetail();
}

function renderSalesApprovalDetail() {
  const panel = document.getElementById('salesapprovaldetail');
  if (!panel || !selectedSalesApproval) return;
  const item = selectedSalesApproval;
  const id = salesApprovalText(item, 'id', 'saleid', 'rentid');
  const instalments = Array.isArray(item?.instalments) ? item.instalments : [];
  const instalmentMarkup = instalments.length ? `<div class="approval-installments"><div class="approval-installments-heading"><div><h3>Instalment schedule</h3><small>${instalments.length} scheduled payments</small></div><span class="material-symbols-outlined">event_repeat</span></div><div class="approval-installment-list">${instalments.map((row, index) => `<div class="approval-installment-row"><span class="approval-installment-index">${index + 1}</span><span class="approval-installment-date"><small>Due date</small><strong>${row.duedate || 'No due date'}</strong></span><span class="approval-installment-amount"><small>Amount</small><strong>${salesApprovalMoney(row.instalmentamount)}</strong></span></div>`).join('')}</div></div>` : '';
  panel.innerHTML = `<div class="approval-detail-header"><div><h2>Discount request</h2><p class="text-sm text-gray-500">Sale reference: ${salesApprovalText(item, 'reference') || id}</p></div>${salesApprovalStatusMarkup(salesApprovalStatus(item))}</div>
    <div class="approval-detail-grid">
      <div class="approval-detail-item"><small>Client</small><strong>${salesApprovalClient(item)}</strong></div>
      <div class="approval-detail-item"><small>Property</small><strong>${salesApprovalProperty(item)}</strong></div>
      <div class="approval-detail-item"><small>Unit</small><strong>${salesApprovalUnit(item)}</strong></div>
      <div class="approval-detail-item"><small>Sales amount</small><strong>${salesApprovalMoney(salesApprovalOriginalAmount(item))}</strong></div>
      <div class="approval-detail-item"><small>Requested discount</small><strong>${salesApprovalMoney(salesApprovalText(item, 'discount'))}</strong></div>
      <div class="approval-detail-item"><small>Final total</small><strong>${salesApprovalMoney(salesApprovalText(item, 'totalamount'))}</strong></div>
      <div class="approval-detail-item"><small>Instalments</small><strong>${salesApprovalText(item, 'numberofinstalment') || 'N/A'}</strong></div>
      <div class="approval-detail-item"><small>Begin date</small><strong>${salesApprovalText(item, 'begindate') || 'N/A'}</strong></div>
      <div class="approval-detail-item"><small>Expiry date</small><strong>${salesApprovalText(item, 'expirationdate') || 'N/A'}</strong></div>
      <div class="approval-detail-item"><small>Transaction mode</small><strong>${salesApprovalText(item, 'exitmode') || 'N/A'}</strong></div>
      <div class="approval-detail-item"><small>Submitted by</small><strong>${salesApprovalText(item, 'user', 'username', 'createdby') || 'N/A'}</strong></div>
    </div>
    ${instalmentMarkup}
    <div class="approval-action-row"><button type="button" class="approval-reject" id="rejectsalesdiscount">Reject</button><button type="button" class="approval-approve" id="approvesalesdiscount">Approve Discount</button></div>`;
  document.getElementById('approvesalesdiscount')?.addEventListener('click', () => updateSalesDiscountApproval(id, 'APPROVED'));
  document.getElementById('rejectsalesdiscount')?.addEventListener('click', () => updateSalesDiscountApproval(id, 'REJECTED'));
}

async function updateSalesDiscountApproval(id, status) {
  const controller = status === 'APPROVED' ? 'approvediscount' : 'rejectdiscount';
  const payload = new FormData();
  payload.append('id', id);
  if (status === 'REJECTED') {
    const reason = window.prompt('Reason for rejecting this discount:', 'Discount requires correction');
    if (reason === null) return;
    payload.append('reason', reason);
  }
  const response = await httpRequest2(`../controllers/${controller}`, payload, null, 'json');
  if (!response?.status) return notification(response?.message || `Unable to ${status.toLowerCase()} discount`, 0);
  notification(status === 'APPROVED' ? 'Discount approved' : 'Discount rejected', 1);
  selectedSalesApproval = null;
  await fetchSalesApprovalRows();
  document.getElementById('salesapprovaldetail').innerHTML = '<div class="approval-empty-state">Select a pending sale to review its details.</div>';
}

async function fetchSalesApprovalRows() {
  const payload = new FormData();
  payload.append('startdate', document.getElementById('salesapprovalstartdate')?.value || '');
  payload.append('enddate', document.getElementById('salesapprovalenddate')?.value || '');
  const response = await httpRequest2('../controllers/fetchsalesdraft', payload, document.getElementById('salesapprovalrefresh'), 'json');
  if (!response?.status) {
    salesApprovalRows = [];
    renderSalesApprovalList();
    return notification(response?.message || 'Unable to retrieve approvals', 0);
  }
  salesApprovalRows = salesApprovalResponseRows(response);
  renderSalesApprovalList();
  const requestedId = sessionStorage.getItem('approvalSaleId');
  if (requestedId) {
    sessionStorage.removeItem('approvalSaleId');
    await fetchSalesApprovalDetail(requestedId);
  }
}

async function approvesalesdiscountsActive() {
  document.getElementById('salesapprovalsearch')?.addEventListener('input', renderSalesApprovalList);
  document.getElementById('salesapprovalrefresh')?.addEventListener('click', fetchSalesApprovalRows);
  document.getElementById('salesapprovalstartdate')?.addEventListener('change', fetchSalesApprovalRows);
  document.getElementById('salesapprovalenddate')?.addEventListener('change', fetchSalesApprovalRows);
  await fetchSalesApprovalRows();
}
