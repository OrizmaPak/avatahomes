let pendingDiscountRows = [];

function approvalValue(item, ...keys) {
  for (const key of keys) if (item?.[key] !== undefined && item?.[key] !== null && item[key] !== '') return item[key];
  return '';
}

function approvalRowsFromResponse(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.rows)) return response.rows;
  return [];
}

function approvalClient(item) {
  return approvalValue(item, 'client', 'tenant', 'clientname', 'tenantname') || `${item?.firstname || ''} ${item?.lastname || ''}`.trim() || 'N/A';
}

function approvalProperty(item) {
  return approvalValue(item, 'property', 'propertyname', 'property_name') || item?.propertydata?.propertyname || 'N/A';
}

function approvalUnit(item) {
  return approvalValue(item, 'unit', 'unitname', 'unit_name') || item?.unitdata?.unitname || 'N/A';
}

function approvalStatus(item) {
  return `${approvalValue(item, 'discountapprovalstatus', 'approvalstatus', 'status') || 'PENDING'}`.toUpperCase();
}

function approvalMoney(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? `₦${number.toLocaleString()}` : '₦0';
}

function approvalStatusMarkup(status) {
  const normalized = status.toLowerCase().replace(/\s+/g, '_');
  return `<span class="approval-status approval-status-${normalized}">${status.replace(/_/g, ' ')}</span>`;
}

function pendingApprovalMatches(item, query) {
  return `${approvalClient(item)} ${approvalProperty(item)} ${approvalUnit(item)} ${approvalValue(item, 'reference', 'id')}`.toLowerCase().includes(query);
}

function renderPendingDiscountApprovals() {
  const query = `${document.getElementById('pendingapprovalsearch')?.value || ''}`.trim().toLowerCase();
  const rows = pendingDiscountRows.filter(item => pendingApprovalMatches(item, query));
  const table = document.getElementById('pendingapprovaltable');
  const count = document.getElementById('pendingapprovalcount');
  if (count) count.textContent = `${pendingDiscountRows.length} pending request${pendingDiscountRows.length === 1 ? '' : 's'}`;
  if (!table) return;
  table.innerHTML = rows.length ? rows.map((item, index) => {
    const id = approvalValue(item, 'id', 'saleid', 'rentid');
    return `<tr>
      <td>${index + 1}</td><td>${approvalClient(item)}</td><td>${approvalProperty(item)}</td><td>${approvalUnit(item)}</td>
      <td>${approvalMoney(approvalValue(item, 'salesamount', 'amount', 'totalamount'))}</td>
      <td>${approvalMoney(approvalValue(item, 'salesdiscount', 'discount', 'discountamount'))}</td>
      <td>${approvalStatusMarkup(approvalStatus(item))}</td>
      <td><button type="button" class="btn" data-review-approval="${id}">Review</button></td>
    </tr>`;
  }).join('') : '<tr><td colspan="8">No pending discount approvals found.</td></tr>';
  table.querySelectorAll('[data-review-approval]').forEach(button => button.addEventListener('click', () => {
    sessionStorage.setItem('approvalSaleId', button.dataset.reviewApproval);
    document.getElementById('approvesalesdiscounts')?.click();
  }));
}

async function fetchPendingDiscountApprovals() {
  const response = await httpRequest2('../controllers/fetchdiscountapprovals', null, document.getElementById('pendingapprovalrefresh'), 'json');
  if (!response?.status) {
    pendingDiscountRows = [];
    renderPendingDiscountApprovals();
    return notification(response?.message || 'Unable to retrieve pending approvals', 0);
  }
  pendingDiscountRows = approvalRowsFromResponse(response);
  renderPendingDiscountApprovals();
}

async function pendingdiscountapprovalsActive() {
  document.getElementById('pendingapprovalsearch')?.addEventListener('input', renderPendingDiscountApprovals);
  document.getElementById('pendingapprovalrefresh')?.addEventListener('click', fetchPendingDiscountApprovals);
  await fetchPendingDiscountApprovals();
}
