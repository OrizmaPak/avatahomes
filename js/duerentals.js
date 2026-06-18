let duerentalsid
async function duerentalsActive() {
    // const form = document.querySelector('#duerentalssform')
    // if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>duerentalsFormSubmitHandler('payload'))
    datasource = []
    await duerentalsFormSubmitHandler()
}

async function fetchduerentalss(id) {
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
                resolvePagination(datasource, onduerentalsTableDataSignal)
            }
        }else{
             duerentalsid = request.data[0].id
             addproductsid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function duerentalsremove(id) {
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
    duerentalsFormSubmitHandler()
    return notification(request.message); 
    
}

async function duerentalpay(id, again=''){
    if(!again)return openPaymentDialog(id);
    if(!document.getElementById('paymentdate').value || !document.getElementById('amountpaid').value)return notification('amount paid and payment date must have a value')
    let payload

    payload = getFormData2(document.querySelector('#modalpayrentform'), null)
    
    let request = await httpRequest2('../controllers/renewrent', payload, null, 'json')
    if(request.status){
        notification(request.message, 1)
        closeJmodal()
    }else return notification(request.message, 0)
    
}

function openPaymentDialog(id) {
    if(!id)return notification('something went wrong')
    openJModal(`
        <form id="modalpayrentform">
            <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="form-group">
                        <label for="logoname" class="control-label">reference (optional)</label>
                        <input type="text" name="reference" id="reference" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">payment date</label>
                        <input type="date" name="paymentdate" id="paymentdate" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="logoname" class="control-label">amount paid</label>
                        <input type="text" name="amountpaid" id="amountpaid" class="form-control" placeholder="Enter payment Date">
                    </div>
                    <div class="form-group hidden">
                        <label for="logoname" class="control-label">id</label>
                        <input type="hidden" name="id" id="id" value="${id}" class="form-control">
                    </div>
                </div> 
    
                     <div class="flex justify-end mt-5">
                    <button type="button" id="submit" onclick="duerentalpay(${id}, 'again')" class="btn">
                        <div class="btnloader" style="display: none;" ></div>
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </form>
    `)
}


async function duerentalsvacate(id){
    alert()
    function getunitid(){
        let params = new FormData()
        params.append('id', id)
        return params
    }
    let request = await httpRequest2('../controllers/vacatetenant', getunitid(), null, 'json')
    if(request.status){
        notification(request.message, 1)
        duerentalsFormSubmitHandler()
    }else return notification(request.message, 0)
}



async function onduerentalsTableDataSignal() { 
    let rows = getSignaledDatasource().map((item, index) => `
    <tr> 
        <td>${index + 1 }</td>
        <td>${item.propertydata?.propertyidno || 'N/A'}</td>
        <td>${item.propertydata?.propertyname || 'N/A'}</td>
        <td>${item.unitname || 'N/A'}</td> 
        <td>${[item.propertydata?.state, item.propertydata?.city].filter(Boolean).join(' ') || 'N/A'}</td>
        <td>${formatNumber(item.rent || 0)}</td>
        <td>${formatNumber(item.otherrenewablefees || 0)}</td>
        <td>${formatOtherFeesDetail(item.otherrenewablefeesdetail)}</td>
        <td>${item.propertydata?.propertymanager || 'N/A'}</td>
        <td>${item.propertydata?.typeofunits || 'N/A'}</td>
        <td>${[item.tenantdata?.firstname, item.tenantdata?.lastname].filter(Boolean).join(' ') || 'Vacant'}</td> 
        <td>${item.tenantdata?.phone || 'N/A'}</td>
        <td>${formatNumber(item.lastrentdata?.amountpaid || 0)}</td>
        <td>${formatDate(item.lastrentdata?.paymentdate || '')}</td>
        <td>${formatDate(item.lastrentdata?.expirationdate || '')}</td>
        <td>${formatNumber(item.rent || 0)}</td>
        <td>${item.rentstatus || 'N/A'}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="duerentalpay(${item.unitid})" class="bg-[green]-g h-8 w-fit text-white drop-shadow-md text-sm px-4 rounded-md" style="background: green;font-size: 18px;padding-left: 14px;padding-right: 14px;border-radius: 6px;font-size: small">Record Payment</button>
            <button title="Delete row entry"s onclick="duerentalsvacate('${item.unitid}')" class="bg-red-600 h-8 w-fit text-white drop-shadow-md text-sm px-4 rounded-md" style="font-size: 18px;padding-left: 14px;padding-right: 14px;border-radius: 6px;font-size: small">Vacate</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function formatOtherFeesDetail(details){
    if(!details || !details.length) return 'None';
    return details.map(fee => `${fee?.feename || 'N/A'}: ${formatNumber(fee?.amount || 0)}`).join('<br>');
} 

async function duerentalsFormSubmitHandler(payloadd='') {
    // if(payloadd)if(!validateForm('duerentalssform', [`searchtext`])) return
    document.getElementById('tabledata').innerHTML = ''
    
    
    let payload

    
    // if(!payloadd){payload = null}else{payload = getFormData2(document.querySelector('#duerentalssform'), duerentalsid ? [['id', duerentalsid]] : null)}
    // let request = await httpRequest2('../controllers/duerents', payload, payloadd ? document.querySelector('#duerentalssform #submit'):null, 'json')
    let request = await httpRequest2('../controllers/duerents', null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    // request = JSON.parse(request)
    if(request.status == true) {
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onduerentalsTableDataSignal)
            }else document.getElementById('tabledata').innerHTML = `No records retrieved`
    }
    else return notification(request.message)
}


// function runAdduerentalsFormValidations() {
//     let form = document.getElementById('duerentalssform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#duerentalsname'))  controls.push([form.querySelector('#duerentalsname'), 'duerentals name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
