let socialmedialinksid
async function socialmedialinksRouteActive() {
    loadCountries()
    const form = document.querySelector('#socialmedialinkssform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', socialmedialinksFormSubmitHandler)
    datasource = []
    await fetchsocialmedialinkss()
}

async function fetchsocialmedialinkss(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchsocialmedialinks', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onsocialmedialinksTableDataSignal)
            }
        }else{
             socialmedialinksid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removesocialmedialinks(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this socialmedialinks?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removesocialmedialinks', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchsocialmedialinkss()
    return notification(request.message);
    
}


async function onsocialmedialinksTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.socialmedianame}</td>
        <td>${item.url}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchsocialmedialinkss('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removesocialmedialinks('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function socialmedialinksFormSubmitHandler() {
    if(!validateForm('socialmedialinkssform', [`owner`, `socialmedianame`, `url`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#socialmedialinkssform'), socialmedialinksid ? [['id', socialmedialinksid]] : null)
    let request = await httpRequest2('../controllers/socialmedialinkscript', payload, document.querySelector('#socialmedialinkssform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#socialmedialinkssform').reset();
        fetchsocialmedialinkss();
        return
    }
    document.querySelector('#socialmedialinksform').reset();
    fetchsocialmedialinkss();
    return notification(request.message, 0);
}


// function runAdsocialmedialinksFormValidations() {
//     let form = document.getElementById('socialmedialinkssform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#socialmedialinksname'))  controls.push([form.querySelector('#socialmedialinksname'), 'socialmedialinks name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }