let viewtenantsid
async function viewtenantsActive() {
    const form = document.querySelector('#viewtenantssform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>viewtenantsFormSubmitHandler('payload'))
    datasource = []
    await viewtenantsFormSubmitHandler()
}

async function fetchviewtenantss(id) {
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
                resolvePagination(datasource, onviewtenantsTableDataSignal)
            } 
        }else{
             viewtenantsid = request.data[0].id
             addproductsid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function viewtenantsremove(id) {
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
    viewtenantsFormSubmitHandler()
    return notification(request.message);
    
}


async function onviewtenantsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.tenantdata.firstname}</td>
        <td>${item.tenantdata.lastname}</td>
        <td>${item.tenantdata.occupation}</td>
        <td>${item.tenantdata.phone}</td>
        <td>${item.tenantdata.placeofbirth}</td>
        <td>${item.tenantdata.referee1}</td>
        <td>${item.tenantdata.referee2}</td>
        <td>
            ${item.dependentdata.length == 0 ? "NO DEPENDENTS" : item.dependentdata.length + " DEPENDENTS"}
            ${item.dependentdata.length > 0 ? `<button title="View dependents" onclick="showDependantModal('${item.tenantdata.id}', '${item.tenantdata.firstname} ${item.tenantdata.lastname}')" class="material-symbols-outlined rounded-full bg-blue-500 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>` : ""}
        </td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="document.getElementById('registeratenant').click();registeratenantid = ${item.tenantdata.id}" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="viewtenantsremove('${item.tenantdata.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

// Make sure Bootstrap 5 CSS (or a custom table style) and dayjs are loaded once in your project.

async function showDependantModal(tenantId, tenantName) {
    // 1️⃣  Fetch the right tenant record
    const record = datasource.find(d => d.tenantdata.id === tenantId);
    if (!record) {
      console.warn('Client not found:', tenantId);
      return; 
    }
   
    // 2️⃣  Build table rows
    const rowsHtml = record.dependentdata.map(dep => `
      <tr>
        <td>${dep.fullname}</td>
        <td>${dep.occupation}</td>
        <td>${dep.relationship}</td>
        <td>${dep.phone}</td>
      </tr>
    `).join('');
  
    // 3️⃣  SweetAlert2 popup
    await Swal.fire({
      title: `<h4 class="m-0" style="color:black">${tenantName}'s Dependants (Client)</h4>`,
      html: `
        <style>
          .swal2-popup table { border-collapse: collapse; width: 100%; }
          .swal2-popup th, .swal2-popup td { padding: .75rem 1rem; }
          .swal2-popup thead { background: #001833; color: #fff; }
          .swal2-popup tbody tr:nth-child(odd) { background: #f8f9fa; }
          .swal2-popup tbody tr:hover { background: #ebf1ff; }
          .table-responsive { max-height: 60vh; overflow-y: auto; }
        </style>
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>Full Name</th>
                <th>Occupation</th>
                <th>Relationship</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `,
      width: '70rem',          // nice wide layout
      showCloseButton: true,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'rounded-4 shadow-lg p-0',
        title: 'bg-primary text-white py-3 px-4 rounded-top-4',
        confirmButton: 'btn btn-secondary my-3'
      }
    });
  }
  


async function viewtenantsFormSubmitHandler(payloadd='') {
    if(payloadd)if(!validateForm('viewtenantssform', [`searchtext`])) return
    document.getElementById('tabledata').innerHTML = ''
    
    
    let payload

    
    if(!payloadd){payload = null}else{payload = getFormData2(document.querySelector('#viewtenantssform'), viewtenantsid ? [['id', viewtenantsid]] : null)}
    let request = await httpRequest2('../controllers/fetchtenants', payload, payloadd ? document.querySelector('#viewtenantssform #submit'):null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    // request = JSON.parse(request)
    if(request.status == true) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewtenantsTableDataSignal)
            }else document.getElementById('tabledata').innerHTML = `No records retrieved`
    }
    else return notification(request.message)
}


// function runAdviewtenantsFormValidations() {
//     let form = document.getElementById('viewtenantssform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewtenantsname'))  controls.push([form.querySelector('#viewtenantsname'), 'viewtenants name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
