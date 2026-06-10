let otherinfoid
async function otherinfoRouteActive() {
    const form = document.querySelector('#otherinfosform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', otherinfoFormSubmitHandler)
    datasource = []
    await fetchotherinfos()
}

async function fetchotherinfos(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchotherinfo', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onotherinfoTableDataSignal)
            }
        }else{
             otherinfoid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeotherinfo(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this otherinfo?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeotherinfo', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchotherinfos()
    return notification(request.message);
    
}


async function onotherinfoTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.sloganone}</td>
        <td>${item.slogantwo}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchotherinfos('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeotherinfo('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function otherinfoFormSubmitHandler() {
    if(!validateForm('otherinfosform', [`owner`, `sloganone`, `slogantwo`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#otherinfosform'), otherinfoid ? [['id', otherinfoid]] : null)
    let request = await httpRequest2('../controllers/otherinfoscript', payload, document.querySelector('#otherinfosform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#otherinfosform').reset();
        fetchotherinfos();
        return
    }
    document.querySelector('#otherinfosform').reset();
    fetchotherinfos();
    return notification(request.message, 0);
}


// function runAdotherinfoFormValidations() {
//     let form = document.getElementById('otherinfosform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#otherinfoname'))  controls.push([form.querySelector('#otherinfoname'), 'otherinfo name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }