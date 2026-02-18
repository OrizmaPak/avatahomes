let bannerid
async function bannerRouteActive() {
    const form = document.querySelector('#bannersform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', bannerFormSubmitHandler)
    datasource = []
    await fetchbanners()
}

async function fetchbanners(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchbanner', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onbannerTableDataSignal)
            }
        }else{
             bannerid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removebanner(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this banner?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removebanner', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchbanners()
    return notification(request.message);
    
}


async function onbannerTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.bannername}</td>
        <td>${item.category}</td>
        <td>${item.url}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchbanners('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removebanner('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function bannerFormSubmitHandler() {
    if(!validateForm('bannersform', [ `bannername`, `category`, `text1`, `text2`, `text3`, `url`, `owner`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#bannersform'), bannerid ? [['id', bannerid]] : null)
    let request = await httpRequest2('../controllers/bannerscript', payload, document.querySelector('#bannersform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#bannersform').reset();
        fetchbanners();
        return
    }
    document.querySelector('#bannersform').reset();
    fetchbanners();
    return notification(request.message, 0);
}


// function runAdbannerFormValidations() {
//     let form = document.getElementById('bannersform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#bannername'))  controls.push([form.querySelector('#bannername'), 'banner name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }