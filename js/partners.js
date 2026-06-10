let partnersid
async function partnersRouteActive() {
    const form = document.querySelector('#partnerssform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', partnersFormSubmitHandler)
    datasource = []
    await fetchpartnerss()
}

async function fetchpartnerss(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchpartners', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onpartnersTableDataSignal)
            }
        }else{
             partnersid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removepartners(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this partners?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removepartners', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchpartnerss()
    return notification(request.message);
    
}


async function onpartnersTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.partnername}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchpartnerss('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removepartners('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function partnersFormSubmitHandler() {
    if(!validateForm('partnerssform', [`owner`, `partnername`, `partnerlogo`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#partnerssform'), partnersid ? [['id', partnersid]] : null)
    let request = await httpRequest2('../controllers/partnerscript', payload, document.querySelector('#partnerssform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#partnerssform').reset();
        fetchpartnerss();
        return
    }
    document.querySelector('#partnersform').reset();
    fetchpartnerss();
    return notification(request.message, 0);
}


// function runAdpartnersFormValidations() {
//     let form = document.getElementById('partnerssform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#partnersname'))  controls.push([form.querySelector('#partnersname'), 'partners name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }