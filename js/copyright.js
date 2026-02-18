let copyrightid
async function copyrightRouteActive() {
    loadCountries()
    const form = document.querySelector('#copyrightsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', copyrightFormSubmitHandler)
    datasource = []
    await fetchcopyrights()
}

async function fetchcopyrights(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchcopyright', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, oncopyrightTableDataSignal)
            }
        }else{
             copyrightid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removecopyright(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this copyright?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removecopyright', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchcopyrights()
    return notification(request.message);
    
}


async function oncopyrightTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.companyname}</td>
        <td>${item.phone}</td>
        <td>${item.email}</td>
        <td>${item.copyrighttitle}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchcopyrights('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removecopyright('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function copyrightFormSubmitHandler() {
    if(!validateForm('copyrightsform', [`owner`, `companyname`, `address`, `phone`, `email`, `copyrighttitle`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#copyrightsform'), copyrightid ? [['id', copyrightid]] : null)
    let request = await httpRequest2('../controllers/copyrightscript', payload, document.querySelector('#copyrightsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#copyrightsform').reset();
        fetchcopyrights();
        return
    }
    document.querySelector('#copyrightform').reset();
    fetchcopyrights();
    return notification(request.message, 0);
}


// function runAdcopyrightFormValidations() {
//     let form = document.getElementById('copyrightsform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#copyrightname'))  controls.push([form.querySelector('#copyrightname'), 'copyright name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }