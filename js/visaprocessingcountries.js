let visaprocessingcountriesid
async function visaprocessingcountriesRouteActive() {
    loadCountries()
    const form = document.querySelector('#visaprocessingcountriessform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', visaprocessingcountriesFormSubmitHandler)
    datasource = []
    await fetchvisaprocessingcountriess()
}

async function fetchvisaprocessingcountriess(id) {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchvisacountries', id ? getparamm() : null, null, 'json')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        if(!id){
            if(request.data.length) {
                datasource = request.data
                resolvePagination(datasource, onvisaprocessingcountriesTableDataSignal)
            }
        }else{
             visaprocessingcountriesid = request.data[0].id
            populateData(request.data[0])
        }
    }
    else return notification('No records retrieved')
}

async function removevisaprocessingcountries(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this visaprocessingcountries?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchvisaprocessingcountriess()
    return notification(request.message);
    
}


async function onvisaprocessingcountriesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.country}</td>
        <td>${item.visa}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchvisaprocessingcountriess('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removevisaprocessingcountries('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function visaprocessingcountriesFormSubmitHandler() {
    if(!validateForm('visaprocessingcountriessform', [`owner`, `country`, `visa`, `status`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#visaprocessingcountriessform'), visaprocessingcountriesid ? [['id', visaprocessingcountriesid]] : null)
    let request = await httpRequest2('../controllers/visacountriescript', payload, document.querySelector('#visaprocessingcountriessform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#visaprocessingcountriessform').reset();
        fetchvisaprocessingcountriess();
        return
    }
    document.querySelector('#visaprocessingcountriesform').reset();
    fetchvisaprocessingcountriess();
    return notification(request.message, 0);
}


// function runAdvisaprocessingcountriesFormValidations() {
//     let form = document.getElementById('visaprocessingcountriessform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#visaprocessingcountriesname'))  controls.push([form.querySelector('#visaprocessingcountriesname'), 'visaprocessingcountries name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }