let navigationid
async function navigationRouteActive() {
    const form = document.querySelector('#navigationsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', navigationFormSubmitHandler)
    datasource = []
    await fetchnavigations()
}

async function fetchnavigations(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchnavigation', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onnavigationTableDataSignal)
            }
        }else{
            navigationid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removenavigation(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this navigation?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removenavigation', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchnavigations()
    return notification(request.message);
    
}


async function onnavigationTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.itemname}</td>
        <td>${item.position}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchnavigations('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removenavigation('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function navigationFormSubmitHandler() {
    if(!validateForm('navigationsform', [`status`, `owner`, `itemname`, `image`, `position`])) return
    
    let payload
    console.log('navigationid', navigationid)
    payload = getFormData2(document.querySelector('#navigationsform'), navigationid ? [['id', navigationid]] : null)
    let request = await httpRequest2('../controllers/navigationscript', payload, document.querySelector('#navigationsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1)
        document.querySelector('#navigationsform').reset()
        fetchnavigations()
        return
    }
    document.querySelector('#navigationsform').reset()
    fetchnavigations()
    return notification(request.message, 0)
}


// function runAdnavigationFormValidations() {
//     let form = document.getElementById('navigationsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#navigationname'))  controls.push([form.querySelector('#navigationname'), 'navigation name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }