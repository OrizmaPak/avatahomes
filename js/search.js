async function searchActive() {
    const form = document.querySelector('#searchform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', searchFormSubmitHandler)
    datasource = searchs =  []
    await fetchSearchs()
}

async function fetchSearchs() {
    let request = await httpRequest('../controllers/fetchsearchflighthotels')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = searchs = request.data
            resolvePagination(datasource, onSearchTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onSearchTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.category}</td>
        <td>${item.destinationinfo}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editSearchItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removeSearchItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function editSearchItem(event, index) {
    let selectedItem = searchs.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('searchform')
            form.owner.value = selectedItem.owner
            form.category.value = selectedItem.category
            form.status.value = selectedItem.status
            form.destinationinfo.value = selectedItem.destinationinfo
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removeSearchItem(event, index) {
    let selectedItem = searchs.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('searchform')
        let request = await httpRequest('../controllers/removesearchflighthotels', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchSearchs()
            return
        }
        return notification(request.message, 0)
    }
}

async function searchFormSubmitHandler() {
    if(!runsearchFormValidations()) return

    let form = document.getElementById('searchform')
    let payload = new FormData(form)
    if(form.querySelector('#submit').value?.split('-')[0] == 'u') {
        payload.append('id', form.querySelector('#submit').value?.split('-')[1])
    }
    let request = await httpRequest('../controllers/searchflighthotelscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchSearchs()
        return
    }
    return notification(request.message, 0)
}


function runsearchFormValidations() {
    let form = document.getElementById('searchform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#category'))  controls.push([form.querySelector('#category'), 'Category is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'Status is required'])
    if(controlHasValue(form, '#destinationinfo'))  controls.push([form.querySelector('#destinationinfo'), 'Destination info is required'])
    
    return mapValidationErrors(errorElements, controls)   

}