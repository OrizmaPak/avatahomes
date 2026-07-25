let viewrentapropertyid
let organizationData = null;
async function viewrentapropertyActive() {
    const form = document.querySelector('#viewrentapropertysform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>viewrentapropertyFormSubmitHandler('payload'))
    datasource = []
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startdate').value = today;
    document.getElementById('enddate').value = today;
    // await viewrentapropertyFormSubmitHandler()
    fetchOrganization()
}

async function fetchOrganization() {
    try {
        const request = await httpRequest2('../controllers/fetchorganisationscript', null, null, 'json')
        if(request.status) {
            organizationData = request?.data?.data?.[0] || request?.data?.[0] || request?.data || null
        }
    } catch (error) {
        console.error('Unable to load organization data for receipt', error)
    }
}

async function fetchviewrentapropertys(id) {
    document.getElementById('addproducts').click()
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchproperty', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewrentapropertyTableDataSignal)
            }
        }else{
             viewrentapropertyid = request.data[0].id
             addproductsid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function viewrentapropertyremove(id) {
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
    // viewrentapropertyFormSubmitHandler()
    return notification(request.message);
    
}


async function onviewrentapropertyTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.property}</td>
        <td>${item.tenant}</td>
        <td>${item.unitname}</td>
        <td>${formatNumber(item.rentdata.amountpaid)}</td>
        <td class="hidden">${formatNumber(item.rentdata.otherfees)}</td>
        <td>${formatNumber(item.rentdata.otherfees)}</td>
        <td>${formatDate(item.rentdata.begindate)}</td>
        <td>${formatDate(item.rentdata.expirationdate)}</td>
        <td>${formatDate(item.rentdata.paymentdate.split(' ')[0])}</td>
        <td>${item.rentdata.reference}</td>
        <td>
        <div class="table-content">
            <table class="mb-0">
                <thead>
                    <tr style="background:#64748b !important; color: white !important;">
                        <th>Fee Name</th>
                        <th>Amount</th>
                        <th>Instalment</th>
                    </tr>
                </thead>
                <tbody>
                    ${item.rentalfees.map(fee => `
                        <tr>
                            <td>${fee.feename || 'N/A'}</td>
                            <td>${formatNumber(fee.amount)}</td>
                            <td>${fee.renewable}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table> 
            </div>
        </td>
        <td class="d-flex align-items-center gap-3">
           <button title="Edit row entry" onclick="document.getElementById('rentaproperty').click();rentapropertyid = ${item.rentdata.id}" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="v#ewrentapropertyremove('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
                <button title="Print Receipt" onclick="generateReceipt(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
              class="material-symbols-outlined rounded-full !bg-blue-600 h-8 w-8 text-white drop-shadow-md text-xs" 
              style="font-size: 18px;background:#0000ff87">receipt</button>
        </td>
    </tr>`).join('');
    
    injectPaginatatedTable(rows);
}


// Receipt generation functions
function generateReceipt(data) {
    // build the HTML
    const receiptHTML = generateReceiptHTML(data);
  
    // open a new window and write the receipt
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      notification('Unable to open receipt window. Please allow popups and try again.', 0);
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Receipt - ${data.rentdata.reference}</title>
          <style>
            body { background: #f3f4f6; margin: 0; padding: 2rem; font-family: sans-serif; }
            .receipt-container { background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 768px; margin: 0 auto; }
            header { border-bottom: 2px solid #22c55e; padding: 1rem 2rem; }
            header h1 { margin: 0; font-size: 1.875rem; color: #1f2937; }
            header p { margin: .25rem 0; color: #4b5563; }
            .logo { height: 5rem; width: 5rem; object-fit: contain; }
            .title-block { text-align: center; padding: 1.5rem 2rem; }
            .title-block h2 { margin: 0; font-size: 1.5rem; color: #22c55e; }
            .title-block p { margin: .5rem 0 0; color: #6b7280; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 0 2rem; }
            .info-grid p { margin: .25rem 0; }
            .info-grid .label { font-weight: 600; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
            th, td { padding: 0.75rem 2rem; }
            thead tr { background: #f3f4f6; }
            tbody tr + tr { border-top: 1px solid #e5e7eb; }
            .total-row td { font-weight: 600; border-top: 2px solid #e5e7eb; }
            .footer { text-align: center; padding: 1rem 2rem; font-size: 0.875rem; color: #6b7280; }
            @media print {
              body { background: none; padding: 0; }
              .btn { display: none; }
              .receipt-container { box-shadow: none; border: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${receiptHTML}
            <div style="text-align: center; padding: 1rem;">
              <button class="btn" onclick="window.print()" style="margin-right: .5rem; padding: .5rem 1rem; border:none; background:#22c55e; color:white; cursor:pointer;">
                Print
              </button>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

function escapeReceiptText(value) {
    return String(value ?? '').replace(/[&<>"']/g, function(character) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[character];
    });
}

function getReceiptCurrency(value) {
    const amount = Number(value || 0);
    return Number.isFinite(amount) ? formatNumber(amount) : formatNumber(0);
}

function generateReceiptHTML(data) {
    const rentdata = data?.rentdata || {};
    const fees = Array.isArray(data?.rentalfees) ? data.rentalfees : [];
    const org = organizationData || {};
    const orgName = org.companyname || org.organisationname || 'Avatar Homes';
    const orgPhone = org.telephone || org.phone || '';
    const orgLogo = org.logo && org.logo !== '-' ? `../images/${org.logo}` : '';
    const totalFees = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

    return `
      <header>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <h1>${escapeReceiptText(orgName)}</h1>
            <p>${escapeReceiptText(org.address || '')}</p>
            <p>${escapeReceiptText([orgPhone, org.email].filter(Boolean).join(' | '))}</p>
          </div>
          ${orgLogo ? `<img class="logo" src="${escapeReceiptText(orgLogo)}" alt="Logo">` : ''}
        </div>
      </header>

      <div class="title-block">
        <h2>PROPERTY SALES PAYMENT RECEIPT</h2>
        <p>Official Payment Confirmation</p>
      </div>

      <div class="info-grid">
        <div>
          <p><span class="label">Client:</span> ${escapeReceiptText(data?.tenant || '')}</p>
          <p><span class="label">Property:</span> ${escapeReceiptText(data?.property || '')}</p>
          <p><span class="label">Unit:</span> ${escapeReceiptText(data?.unitname || '')}</p>
        </div>
        <div>
          <p><span class="label">Payment Date:</span> ${escapeReceiptText(formatDate((rentdata.paymentdate || '').split(' ')[0] || rentdata.paymentdate || ''))}</p>
          <p><span class="label">Reference No:</span> ${escapeReceiptText(rentdata.reference || '')}</p>
          <p><span class="label">Receipt Date:</span> ${escapeReceiptText(formatDate(new Date().toISOString().split('T')[0]))}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Description</th>
            <th style="text-align:right;">Amount</th>
            <th style="text-align:right;">Deposit</th>
            <th style="text-align:right;">Discount</th>
          </tr>
        </thead>
        <tbody>
          ${fees.length ? fees.map(fee => `
            <tr>
              <td>${escapeReceiptText(fee.feename || 'Sales Fee')}</td>
              <td style="text-align:right;">${getReceiptCurrency(fee.amount)}</td>
              <td style="text-align:right;">${getReceiptCurrency(fee.deposit)}</td>
              <td style="text-align:right;">${getReceiptCurrency(fee.discount)}</td>
            </tr>
          `).join('') : `
            <tr>
              <td>Property payment</td>
              <td style="text-align:right;">${getReceiptCurrency(rentdata.amountpaid)}</td>
              <td style="text-align:right;">${getReceiptCurrency(rentdata.amountpaid)}</td>
              <td style="text-align:right;">${getReceiptCurrency(0)}</td>
            </tr>
          `}
          <tr class="total-row">
            <td>Total Fees</td>
            <td style="text-align:right;">${getReceiptCurrency(totalFees || rentdata.amountpaid)}</td>
            <td style="text-align:right;">Amount Paid</td>
            <td style="text-align:right;">${getReceiptCurrency(rentdata.amountpaid)}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>Authorized Signature</p>
      </div>
    `;
}
  
  

async function viewrentapropertyFormSubmitHandler(payloadd='') {
    if(payloadd)if(!validateForm('viewrentapropertysform', [`startdate`, `enddate`])) return
    document.getElementById('tabledata').innerHTML = ''
    
    
    let payload

    
    if(!payloadd){payload = null}else{payload = getFormData2(document.querySelector('#viewrentapropertysform'), viewrentapropertyid ? [['id', viewrentapropertyid]] : null)}
    let request = await httpRequest2('../controllers/fetchrentaproperty', payload, payloadd ? document.querySelector('#viewrentapropertysform #submit'):null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    // request = JSON.parse(request)
    if(request.status == true) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewrentapropertyTableDataSignal)
            }else document.getElementById('tabledata').innerHTML = `No records retrieved`
    }
    else return notification(request.message)
}


// function runAdviewrentapropertyFormValidations() {
//     let form = document.getElementById('viewrentapropertysform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewrentapropertyname'))  controls.push([form.querySelector('#viewrentapropertyname'), 'viewrentaproperty name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
