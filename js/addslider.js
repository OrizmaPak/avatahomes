async function sliderRouteActive() {
    const form = document.querySelector('#addsliderform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', sliderFormSubmitHandler)
    datasource = adsliders = []
    await fetchAdSliders()
}

async function fetchAdSliders() {
    let request = await httpRequest('../controllers/fetchadslider')
    request = JSON.parse(request) 
    if(request.status) {
        if(request.data.length) {
            datasource = adsliders = request.data
            resolvePagination(datasource, onSliderTableDataSignal)
        }
        else return notification('No records retrieved')
    }
    else return notification('Unable to fetch records')
 
}  

 
async function onSliderTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.imageurl}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editAdsliderItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removeAdsliderItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function editAdsliderItem(event, index) {
    let selectedItem = adsliders.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('addsliderform')
            form.owner.value = selectedItem.owner
            // form.imageurl.value = selectedItem.imageurl
            form.status.value = selectedItem.status
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removeAdsliderItem(event, index) {
    let selectedItem = adsliders.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('addsliderform')
        let request = await httpRequest('../controllers/removeadslider', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchAdSliders()
            return
        }
        return notification(request.message, 0)
    }
}


async function sliderFormSubmitHandler() {
    if(!runAdSliderFormValidations()) return

    let form = document.getElementById('addsliderform')
    let payload = getFormData(form)
    try {
        payload.append('photofilename',form.imageurl.files[0].name);		
        payload.append('userphotoname',form.imageurl.files[0]);
    }
    catch(ex){
         payload.append('photofilename','-');		
         payload.append('userphotoname','-');
     
    }
    
    if(form.querySelector('#submit').value?.split('-')[0] == 'u') {
        payload.append('id', form.querySelector('#submit').value?.split('-')[1])
    }
    let request = await httpRequest('../controllers/adsliderscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchAdSliders()
        return
    }
    return notification(request.message, 0)
}


function runAdSliderFormValidations() {
    let form = document.getElementById('addsliderform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#imageurl'))  controls.push([form.querySelector('#imageurl'), 'image url is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'image url is required'])
    return mapValidationErrors(errorElements, controls)   

}