let viewpropertyregistrationid
async function viewpropertyregistrationActive() {
    // const form = document.querySelector('#viewpropertyregistrationsform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', viewpropertyregistrationFormSubmitHandler)
    datasource = []
    await viewpropertyregistrationFormSubmitHandler()
}

async function fetchviewpropertyregistrations(id) {
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
                resolvePagination(datasource, onviewpropertyregistrationTableDataSignal)
            }
        }else{
             viewpropertyregistrationid = request.data[0].id
             addproductsid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeviewpropertyregistration(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this property?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchviewpropertyregistrations()
    return notification(request.message);
    
}


async function onviewpropertyregistrationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1 }</td>
        <td>${item.property.propertyname}</td>
        <td>${item.property.propertymanager}</td> 
        <td>${item.property.numberofunits}</td>
        <td>${item.property.state}</td> 
        <td>  
        <div class="table-content"> y
        <table>
wren                    <tr style="background: 64748b !important; color: white !important">
                        <th  style="background: 64748b !important; color: black !important">s/n</th>
                        <th  style="background: 64748b !important; color: black !important">unit name</th>
                        <th  style="background: 64748b !important; color: black !important">fee name</th>
                        <th  style="background: 64748b !important; color: black !important">amount</th>
                        <th  style="display: none; background: 64748b !important; color: black !important">rental period (MNTH)</th>
                        <th  style="background: 64748b !important; color: black !important">rented</th>
                    </tr>
                </thead>
                <tbody> 
                ${
                      item.propertyunits.map((data, index)=>`
                      <tr>
                        <td>${index+1}</td> 
                        <td>${data.unitname}</td>
                        <td>${data.feename ?? ''}</td>
                        <td>${(data.amount ?? data.rent) ?? ''}</td>
                        <td class="hidden">${data.rentalperiod ?? ''}</td>
                        <td>${(data.rented ?? '').toString().toUpperCase()}</td>
                        </tr>
                      `).join('')  
                    }
                    </tbody>
                 </table>
            </div>
            </td>
                    <td>${item.property.propertyidno??''}</td>
        <td class="flex items-center gap-3">
            <button style="background:blue" title="Edit row entry" onclick="document.getElementById('propertyregistration').click();propertyregistrationid = ${item.property.id}" class="material-symbols-outlined rounded-full bg-[blue] h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removevisaprocessingcountries('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function viewpropertyregistrationFormSubmitHandler(id) {
    // if(!validateForm('viewpropertyregistrationsform', [`enddate `, `startdate`])) return
    
    let payload

    // payload = getFormData2(document.querySelector('#viewpropertyregistrationsform'), viewpropertyregistrationid ? [['id', viewpropertyregistrationid]] : null)
    let request = await httpRequest2('../controllers/fetchproperty')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    request = JSON.parse(request)
    if(request.status == true) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onviewpropertyregistrationTableDataSignal)
            }else document.getElementById('tabledata').innerHTML = `No records retrieved`
    }
    else return notification('No records retrieved')
}


// function runAdviewpropertyregistrationFormValidations() {
//     let form = document.getElementById('viewpropertyregistrationsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewpropertyregistrationname'))  controls.push([form.querySelector('#viewpropertyregistrationname'), 'viewpropertyregistration name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
