let staticadbannerid
async function staticadbannerRouteActive() {
    const form = document.querySelector('#staticadbannersform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', staticadbannerFormSubmitHandler)
    datasource = []
    await fetchstaticadbanners()
}

async function fetchstaticadbanners(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchstaticadbanner', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onstaticadbannerTableDataSignal)
            }
        }else{
             staticadbannerid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removestaticadbanner(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this staticadbanner?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removestaticadbanner', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchstaticadbanners()
    return notification(request.message);
    
}


async function onstaticadbannerTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.textone}</td>
        <td>${item.texttwo}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchstaticadbanners('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removestaticadbanner('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function staticadbannerFormSubmitHandler() {
    if(!validateForm('staticadbannersform', [`owner`, `imageurl`, `textone`, `texttwo`, `textthree`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#staticadbannersform'), staticadbannerid ? [['id', staticadbannerid]] : null)
    let request = await httpRequest2('../controllers/staticadbannerscript', payload, document.querySelector('#staticadbannersform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#staticadbannersform').reset();
        fetchstaticadbanners();
        return
    }
    document.querySelector('#staticadbannersform').reset();
    fetchstaticadbanners();
    return notification(request.message, 0);
}


// function runAdstaticadbannerFormValidations() {
//     let form = document.getElementById('staticadbannersform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#staticadbannername'))  controls.push([form.querySelector('#staticadbannername'), 'staticadbanner name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }