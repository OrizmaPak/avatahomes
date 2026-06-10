async function tabPromotionRouteActive() {
    const form = document.querySelector('#tabpromotionsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', tabPromotionFormSubmitHandler)
    datasource = tabpromotions =  []
    await fetchTabPromotions()
}

async function fetchTabPromotions() {
    let request = await httpRequest('../controllers/fetchtabpromotion')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = tabpromotions = request.data
            resolvePagination(datasource, onTabPromotionTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onTabPromotionTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.title}</td>
        <td>${item.url}</td>
        <td>${item.contents}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editTabPromotionItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-show-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removeTabPromotionItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function editTabPromotionItem(event, index) {
    let selectedItem = tabpromotions.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('tabpromotionsform')
            form.owner.value = selectedItem.owner
            form.title.value = selectedItem.title
            form.status.value = selectedItem.status
            form.contents.value = selectedItem.contents
            form.url.value = selectedItem.url
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removeTabPromotionItem(event, index) {
    let selectedItem = tabpromotions.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('tabpromotionsform')
        let request = await httpRequest('../controllers/removetabpromotion', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchTabPromotions()
            return
        }
        return notification(request.message, 0)
    }
}

async function tabPromotionFormSubmitHandler() {
    if(!runtabPromotionFormValidations()) return

    let form = document.getElementById('tabpromotionsform')
    let payload = new FormData(form)
    try {
        payload.append('photofilename',form.url.files[0].name);		
        payload.append('userphotoname',form.url.files[0]);
    }
    catch(ex){
         payload.append('photofilename','-');		
         payload.append('userphotoname','-');
     
    }
    if(form.querySelector('#submit').value?.split('-')[0] == 'u') {
        payload.append('id', form.querySelector('#submit').value?.split('-')[1])
    }
    
    let request = await httpRequest('../controllers/tabpromotionscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchTabPromotions()
        return
    }
    return notification(request.message, 0)
}


function runtabPromotionFormValidations() {
    let form = document.getElementById('tabpromotionsform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#title'))  controls.push([form.querySelector('#title'), 'title is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'status is required'])
    if(controlHasValue(form, '#contents'))  controls.push([form.querySelector('#contents'), 'contents is required'])
    if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
    
    return mapValidationErrors(errorElements, controls)   

}