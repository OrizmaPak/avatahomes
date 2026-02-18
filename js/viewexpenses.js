let viewexpensesid
async function viewexpensesActive() {
    const form = document.querySelector('#viewexpensesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', e=>viewexpensesFormSubmitHandler('payload'))
    datasource = []
    await fetchviewexpensess()
}

async function fetchviewexpensess(id) {
    // document.getElementById('addproducts').click()
    // scrollToTop('scrolldiv')
    document.getElementById('total11').innerHTML = 0;
    document.getElementById('total22').innerHTML = 0;
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/expenseshistory', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){ 
            if(request.data.length) {
                datasource = request.data
document.getElementById('total22').innerHTML = formatNumber(request.data.reduce((acc, curr) => parseInt(acc) + parseInt(curr.debit), 0));
document.getElementById('total11').innerHTML = formatNumber(request.data.reduce((acc, curr) => parseInt(acc) + parseInt(curr.debit), 0));
                resolvePagination(datasource, onviewexpensesTableDataSignal)
            }
        }else{
             viewexpensesid = request.data[0].id
             addproductsid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function viewexpensesremove(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this record?");

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
    // viewexpensesFormSubmitHandler()
    return notification(request.message);
    
}


async function onviewexpensesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${formatDate(item.transactiondate)}</td>
        <td>${item.propertyidno??item.propertyid}</td>
        <td class="hidden">${item.accountname}</td>
        <td>${item.propertyname??''}</td>
        <td>${item.description}</td>
        <td>${item.reference}</td>
        <td>${formatNumber(item.debit)}</td>
        <td class="fle x items-center gap-3 hidden">
            <button title="Edit row entry" onclick="document.getElementById('otherpayments').click();otherpaymentsid = ${item.id}" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" onclick="viewexpensesremove('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function viewexpensesFormSubmitHandler(payloadd='') {
    if(payloadd)if(!validateForm('viewexpensesform', [`startdate`, `enddate`])) return
    document.getElementById('tabledata').innerHTML = ''
    
    
    let payload

    
    if(!payloadd){payload = null}else{payload = getFormData2(document.querySelector('#viewexpensesform'), viewexpensesid ? [['id', viewexpensesid]] : null)}
    let request = await httpRequest2('../controllers/expenseshistory', payload, payloadd ? document.querySelector('#viewexpensesform #submit'):null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    // request = JSON.parse(request)
    if(request.status == true) {
            if(request.data.length) {
                datasource = request.data
                document.getElementById('total22').innerHTML = formatNumber(request.data.reduce((acc, curr) => parseInt(acc) + parseInt(curr.debit), 0));
document.getElementById('total11').innerHTML = formatNumber(request.data.reduce((acc, curr) => parseInt(acc) + parseInt(curr.debit), 0));
                resolvePagination(datasource, onviewexpensesTableDataSignal)
            }else document.getElementById('tabledata').innerHTML = `No records retrieved`
    }
    else return notification(request.message)
}


// function runAdviewexpensesFormValidations() {
//     let form = document.getElementById('viewexpensesform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#viewexpensesname'))  controls.push([form.querySelector('#viewexpensesname'), 'viewexpenses name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
