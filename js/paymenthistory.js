let organizationData = null;   // org info for receipts
let paymenthistoryid;

/* -------- INITIALISE -------- */
async function paymenthistoryActive() {
  document.querySelector('#paymenthistoryform #submit')
          .addEventListener('click', () => paymenthistoryFormSubmitHandler('payload'));

  /* Tenants */
  const tRes = await httpRequest2('../controllers/fetchtenants', null, null, 'json');
  if (tRes.status) {
    document.getElementById('ownerid').innerHTML =
      `<option value="">-- Select Client --</option>` +
      tRes.data.map(t => `<option value="${t.tenantdata.id}">${t.tenantdata.firstname} ${t.tenantdata.lastname} ${t.tenantdata.othernames}</option>`).join('');
  } else notification('Unable to retrieve clients, please reload.');

  /* Org */
  try {
    const res = await fetch('../controllers/fetchorganisation');
    const data = await res.json();
    if (data.status) organizationData = data.data[0];
  } catch (err) { console.error('Org fetch error', err); } 
}

/* -------- FORM SUBMIT -------- */
async function paymenthistoryFormSubmitHandler(flag = '') {
  if (flag && !validateForm('paymenthistoryform', ['startdate', 'enddate'])) return;

  document.getElementById('tabledata').innerHTML = '';

  const payload = flag ? getFormData2(document.querySelector('#paymenthistoryform'),
                                      paymenthistoryid ? [['id', paymenthistoryid]] : null)
                       : null;

  const req = await httpRequest2('../controllers/paymenthistory', payload,
                                 flag ? document.querySelector('#paymenthistoryform #submit') : null,
                                 'json');

  if (!req.status) return notification(req.message || 'No records retrieved');

  datasource = req.data || [];
  if (!datasource.length) {
    document.getElementById('tabledata').innerHTML = 'No records retrieved';
    updateTotals(0,0,0);
    updatePaginationStatus();
    return;
  }

  resolvePagination(datasource, renderTablePage);
  updateTotals(); // totals on full dataset
}


async function paymenthistoryremove(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this client?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removetenant', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    document.getElementById('tabledata').innerHTML = ''
    // paymenthistoryFormSubmitHandler()
    return notification(request.message);
    
}

/**
 * Opens a SweetAlert2 modal showing the receipt details.
 */
function viewReceipt(id) {
  const item = datasource.find(r => r.id === id);
  if (!item) return;

  // generateReceiptHTML is your existing function
  const receiptHtml = generateReceiptHTML(item);

  Swal.fire({
    html: receiptHtml,
    width: 800,
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: 'swal-wide'   // you can define .swal-wide in your CSS if you need extra styling
    },
  });
}


/* -------- RENDER PAGED ROWS -------- */
function renderTablePage() {
  const rows = getSignaledDatasource().map((item, i) => {
    const discount = Number(item.discount || 0);
    const balance  = Number(item.debit || 0) - Number(item.credit || 0) - discount;
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${formatDate(item.transactiondate)}</td>
        <td>${item.reference}</td>
        <td>${item.description || ''}</td>
        <td>${item.firstname} ${item.lastname}</td>
        <td class="text-right">${formatNumber(item.debit)}</td>
        <td class="text-right">${formatNumber(item.credit)}</td>
        <td class="text-right">${formatNumber(discount)}</td>
        <td class="text-right">${formatNumber(balance)}</td>
        <td class="flex items-center gap-2">
        <button style="color:blue;display:none" title="Edit row entry" onclick="document.getElementById('otherpayments').click();otherpaymentsid = ${item.id}" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
         <button
            title="View receipt"
            onclick="viewReceipt('${item.id}')"
            class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs"
            style="font-size:18px;"
          >visibility</button>
          <button style="background:orange" title="Print receipt"
            onclick="printReceipt('${item.id}')"   class="material-symbols-outlined rounded-full h-8 w-8 text-white text-xs">print</button>
          <button style="background:teal"   title="Download receipt"
            onclick="downloadReceipt('${item.id}')" class="material-symbols-outlined rounded-full h-8 w-8 text-white text-xs">download</button>
            <button title="Delete row entry" onclick="paymenthistoryremove('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
       
        </td>
      </tr>
    `;
  }).join('');

  injectPaginatatedTable(rows);
  updatePaginationStatus();
}

/* -------- TOTALS -------- */
function updateTotals(overDebit, overCredit, overDiscount) {
  const debitSum    = overDebit    ?? datasource.reduce((s, r) => s + Number(r.debit    || 0), 0);
  const creditSum   = overCredit   ?? datasource.reduce((s, r) => s + Number(r.credit   || 0), 0);
  const discountSum = overDiscount ?? datasource.reduce((s, r) => s + Number(r.discount || 0), 0);
  const balanceSum  = debitSum - creditSum - discountSum;

  // top card
  document.getElementById('totalDebit').textContent    = formatNumber(debitSum);
  document.getElementById('totalCredit').textContent   = formatNumber(creditSum);
  document.getElementById('totalDiscount').textContent = formatNumber(discountSum);
  document.getElementById('totalBalance').textContent  = formatNumber(balanceSum);

  // bottom card
  document.getElementById('totalDebit2').textContent    = formatNumber(debitSum);
  document.getElementById('totalCredit2').textContent   = formatNumber(creditSum);
  document.getElementById('totalDiscount2').textContent = formatNumber(discountSum);
  document.getElementById('totalBalance2').textContent  = formatNumber(balanceSum);
}

/* -------- PAGINATION STATUS -------- */
function updatePaginationStatus() {
  const { start, end, total } = getPaginationStatus(); // implement in your pagination util
  document.getElementById('pagination-status').textContent = `Showing ${start} – ${end} of ${total}`;
}

/* -------- RECEIPT (unchanged apart from discount/balance if desired) -------- */
function generateReceiptHTML(item) {
    const discount = Number(item.discount || 0);
    const balance  = Number(item.debit   || 0)
                   - Number(item.credit  || 0)
                   - discount;
    const payDate  = formatDate(item.transactiondate);
  
    return `
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Receipt ${item.reference}</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body {
              width: 210mm; height: 297mm;
              margin: 0; padding: 0;
              font-family: Arial, sans-serif;
              color: #333;
            }
            .receipt-container {
              box-sizing: border-box;
              width: 100%; height: 100%;
              padding: 20mm;
              display: flex; flex-direction: column;
            }
            header {
              display: flex; justify-content: space-between;
              align-items: center; margin-bottom: 20px;
              border-bottom: 2px solid #22c55e;
              padding-bottom: 10px;
            }
            header .org-info h1 {
              margin: 0; font-size: 24pt; color: #1f2937;
            }
            header .org-info p {
              margin: 2px 0; font-size: 10pt; color: #4b5563;
            }
            header img.logo {
              max-height: 60px; object-fit: contain;
            }
            .title {
              text-align: center;
              font-size: 20pt;
              font-weight: bold;
              color: #22c55e;
              margin: 20px 0;
            }
            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 20px;
              font-size: 10pt;
            }
            .details div p {
              margin: 2px 0;
            }
            table.line-items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              font-size: 10pt;
            }
            table.line-items th,
            table.line-items td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: right;
            }
            table.line-items th {
              background: #f3f4f6;
              font-weight: bold;
            }
            table.line-items th:first-child,
            table.line-items td:first-child {
              text-align: left;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: auto;
              font-size: 10pt;
            }
            .signatures div {
              width: 45%;
              border-top: 1px solid #999;
              text-align: center;
              padding-top: 5px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <header>
              <div class="org-info">
                <h1>${organizationData.organisationname}</h1>
                <p>${organizationData.address}</p>
                <p>${organizationData.phone} | ${organizationData.email}</p>
              </div>
              ${organizationData.logo
                ? `<img class="logo" src="https://nglohitech.com/werentv2/assets/media/${organizationData.logo}" alt="Logo">`
                : ''
              }
            </header>
  
            <div class="title">RECEIPT</div>
  
            <div class="details">
              <div>
                <p><strong>Receipt No:</strong> ${item.reference}</p>
                <p><strong>Date:</strong> ${payDate}</p>
              </div>
              <div>
                <p><strong>Client:</strong> ${item.firstname} ${item.lastname}</p>
                <p><strong>Description:</strong> ${item.description || '—'}</p>
              </div>
            </div>
  
            <table class="line-items">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Debit (₦)</th>
                  <th>Credit (₦)</th>
                  <th>Discount (₦)</th>
                  <th>Balance (₦)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Payment details</td>
                  <td>${formatNumber(item.debit)}</td>
                  <td>${formatNumber(item.credit)}</td>
                  <td>${formatNumber(discount)}</td>
                  <td>${formatNumber(balance)}</td>
                </tr>
              </tbody>
            </table>
  
            <div class="signatures">
              <div>Payer’s Signature</div>
              <div>Receiver’s Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  


/**
 * Opens a print‑ready window at true A4 size.
 */
function printReceipt(id) {
    const item = datasource.find(r => r.id === id);
    if (!item) return;
  
    const receiptHtml = generateReceiptHTML(item);
    const win = window.open('', '_blank');
    win.document.write(receiptHtml);
    win.document.close();
    // allow CSS to load, then trigger print
    setTimeout(() => win.print(), 500);
  }

async function downloadReceipt(id) {
  const item = datasource.find(r => r.id === id);
  if (!item) return;
  const div = document.createElement('div');
  div.innerHTML = generateReceiptHTML(item);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  await pdf.html(div, { margin:[10,10,10,10], autoPaging:'text',
                        callback: d => d.save(`receipt-${item.reference}.pdf`) });
}

/* -------- KICK‑OFF -------- */
