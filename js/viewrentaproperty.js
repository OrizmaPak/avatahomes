let viewrentapropertyid
let organizationData = null;

async function fetchOrganization() {
    try {
        const response = await fetch('../controllers/fetchorganisation');
        const data = await response.json();
        if (data?.status) {
            organizationData = Array.isArray(data.data) ? data.data[0] : data.data;
        }
    } catch (error) {
        console.error('Org fetch error', error);
    }
}

function formatViewRentNumber(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return '0';
    return formatNumber(numericValue);
}

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
        <td class="text-right">${formatViewRentNumber(item.rentdata.amountpaid)}</td>
        <td class="hidden text-right">${formatViewRentNumber(item.rentdata.otherfees)}</td>
        <td class="text-right">${formatViewRentNumber(item.rentdata.otherfees)}</td>
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
                            <td class="text-right">${formatViewRentNumber(fee.amount)}</td>
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
    // make sure we have our org info
    if (typeof organizationData === 'undefined' || !organizationData) {
      console.error('Organization data not loaded');
      return;
    }
  
    // build the HTML
    const receiptHTML = generateReceiptHTML(data);
  
    // open a new window and write the receipt
    const printWindow = window.open('', '_blank');
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
              <button class="btn" onclick="downloadPDF()" style="padding: .5rem 1rem; border:none; background:#10b981; color:white; cursor:pointer;">
                Download PDF
              </button>
            </div>
          </div>
          <script>
            function downloadPDF() {
              const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
              doc.html(document.querySelector('.receipt-container'), {
                callback: function(pdf) {
                  pdf.save('Receipt-${data.rentdata.reference}.pdf');
                },
                margin: [40, 40, 40, 40],
                html2canvas: { scale: 0.75 }
              });
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
