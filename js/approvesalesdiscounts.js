let salesApprovalRows = [];
let selectedSalesApproval = null;

function salesApprovalResponseRows(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (response?.data && typeof response.data === 'object') return [response.data];
  return [];
}

function salesApprovalText(item, ...keys) {
  for (const key of keys) if (item?.[key] !== undefined && item?.[key] !== null && item[key] !== '') return item[key];
  return '';
}

function salesApprovalClient(item) { return salesApprovalText(item, 'client', 'tenant', 'clientname', 'tenantname') || `${item?.firstname || ''} ${item?.lastname || ''}`.trim() || 'N/A'; }
function salesApprovalUnit(item) { return salesApprovalText(item, 'unit', 'unitname', 'unit_name') || item?.unitdata?.unitname || 'N/A'; }
function salesApprovalProperty(item) { return salesApprovalText(item, 'property', 'propertyname', 'property_name') || item?.propertydata?.propertyname || 'N/A'; }
function salesApprovalMoney(value) { const number = Number(value || 0); return Number.isFinite(number) ? `₦${number.toLocaleString()}` : '₦0'; }
function salesApprovalStatus(item) { return `${salesApprovalText(item, 'discountapprovalstatus', 'approvalstatus', 'status') || 'PENDING'}`.toUpperCase(); }
function salesApprovalStatusMarkup(status) { return `<span class="approval-status approval-status-${status.toLowerCase().replace(/\s+/g, '_')}">${status.replace(/_/g, ' ')}</span>`; }

function renderSalesApprovalList() {
  const query = `${document.getElementById('salesapprovalsearch')?.value || ''}`.trim().toLowerCase();
  const table = document.getElementById('salesapprovaltable');
  if (!table) return;
  const rows = salesApprovalRows.filter(item => `${salesApprovalClient(item)} ${salesApprovalProperty(item)} ${salesApprovalUnit(item)} ${salesApprovalText(item, 'reference', 'id')}`.toLowerCase().includes(query));
  table.innerHTML = rows.length ? rows.map((item) => {
    const id = salesApprovalText(item, 'id', 'saleid', 'rentid');
    return `<tr data-approval-id="${id}"><td>${salesApprovalClient(item)}</td><td>${salesApprovalUnit(item)}</td><td>${salesApprovalMoney(salesApprovalText(item, 'salesdiscount', 'discount', 'discountamount'))}</td><td>${salesApprovalStatusMarkup(salesApprovalStatus(item))}</td></tr>`;
  }).join('') : '<tr><td colspan="4">No pending approvals found.</td></tr>';
  table.querySelectorAll('[data-approval-id]').forEach(row => row.addEventListener('click', () => selectSalesApproval(row.dataset.approvalId)));
}

function selectSalesApproval(id) {
  selectedSalesApproval = salesApprovalRows.find(item => `${salesApprovalText(item, 'id', 'saleid', 'rentid')}` === `${id}`) || null;
  renderSalesApprovalDetail();
}

async function fetchSalesApprovalDetail(id) {
  const payload = new FormData();
  payload.append('id', id);
  const response = await httpRequest2('../controllers/fetchsalesdraft', payload, null, 'json');
  const rows = salesApprovalResponseRows(response);
  if (response?.status && rows.length) {
    selectedSalesApproval = rows[0];
    renderSalesApprovalDetail();
  }
}

function renderSalesApprovalDetail() {
  const panel = document.getElementById('salesapprovaldetail');
  if (!panel || !selectedSalesApproval) return;
  const item = selectedSalesApproval;
  const id = salesApprovalText(item, 'id', 'saleid', 'rentid');
  panel.innerHTML = `<div class="approval-detail-header"><div><h2>Discount request</h2><p class="text-sm text-gray-500">Sale reference: ${salesApprovalText(item, 'reference') || id}</p></div>${salesApprovalStatusMarkup(salesApprovalStatus(item))}</div>
    <div class="approval-detail-grid">
      <div class="approval-detail-item"><small>Client</small><strong>${salesApprovalClient(item)}</strong></div>
      <div class="approval-detail-item"><small>Property</small><strong>${salesApprovalProperty(item)}</strong></div>
      <div class="approval-detail-item"><small>Unit</small><strong>${salesApprovalUnit(item)}</strong></div>
      <div class="approval-detail-item"><small>Original sale amount</small><strong>${salesApprovalMoney(salesApprovalText(item, 'salesamount', 'originalamount', 'amount'))}</strong></div>
      <div class="approval-detail-item"><small>Requested discount</small><strong>${salesApprovalMoney(salesApprovalText(item, 'salesdiscount', 'discount', 'discountamount'))}</strong></div>
      <div class="approval-detail-item"><small>Final total</small><strong>${salesApprovalMoney(salesApprovalText(item, 'totalamount', 'finalsalestotal', 'finaltotal'))}</strong></div>
      <div class="approval-detail-item"><small>Instalments</small><strong>${salesApprovalText(item, 'numberofinstalments', 'instalmentcount') || 'N/A'}</strong></div>
      <div class="approval-detail-item"><small>Submitted by</small><strong>${salesApprovalText(item, 'user', 'username', 'createdby') || 'N/A'}</strong></div>
    </div>
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
  const response = await httpRequest2('../controllers/fetchsalesdraft', null, document.getElementById('salesapprovalrefresh'), 'json');
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
  await fetchSalesApprovalRows();
}
