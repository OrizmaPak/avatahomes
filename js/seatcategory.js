let seatcategoryid
async function seatcategoryRouteActive() {
    const form = document.querySelector('#seatcategorysform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', seatcategoryFormSubmitHandler)
    datasource = []
    await fetchseatcategorys()
}

async function fetchseatcategorys(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchseatcategory', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onseatcategoryTableDataSignal)
            }
        }else{
             seatcategoryid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removeseatcategory(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this seatcategory?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removeseatcategory', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchseatcategorys()
    return notification(request.message);
    
}


async function onseatcategoryTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.category}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchseatcategorys('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeseatcategory('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function seatcategoryFormSubmitHandler() {
    if(!validateForm('seatcategorysform', [`category`, `owner`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#seatcategorysform'), seatcategoryid ? [['id', seatcategoryid]] : null)
    let request = await httpRequest2('../controllers/seatcategoryscript', payload, document.querySelector('#seatcategorysform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#seatcategorysform').reset();
        fetchseatcategorys();
        return
    }
    document.querySelector('#seatcategorysform').reset();
    fetchseatcategorys();
    return notification(request.message, 0);
}


// function runAdseatcategoryFormValidations() {
//     let form = document.getElementById('seatcategorysform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#seatcategoryname'))  controls.push([form.querySelector('#seatcategoryname'), 'seatcategory name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }