async function logoRouteActive() {
    const form = document.querySelector('#logosform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', logoFormSubmitHandler)
    datasource = []
    await fetchlogos()
}

async function fetchlogos() {
    let request = await httpRequest('../controllers/fetchlogos')
    if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        console.log('datasource', request)
        if(request.data.length) {
            datasource = request.data
            resolvePagination(datasource, onlogoTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onlogoTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.id}</td>
        <td>${item.num}</td>
        <td>EXPENSES</td>
        <td>STAMP DUTY</td>
        <td>STAMP DUTY</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function logoFormSubmitHandler() {
    if(!runAdlogoFormValidations()) return

    let payload = getFormData(document.querySelector('#logosform'))
    let request = await httpRequest('../controllers/logoscript', payload, document.querySelector('#logosform #submit'))
    console.log('request', request)
    if(request.status) {
        notification('Record saved successfully!', 1)
        return
    }
    document.querySelector('#logosform').reset()
    return notification(request.message, 0)
}


function runAdlogoFormValidations() {
    let form = document.getElementById('logosform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#logoname'))  controls.push([form.querySelector('#logoname'), 'logo name is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'status is required'])
    if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
    
    return mapValidationErrors(errorElements, controls)   

}


