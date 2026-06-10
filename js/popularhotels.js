async function popularHotelsActive() {
    const form = document.querySelector('#popularhotelsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', popularHotelsFormSubmitHandler)
    datasource = popularhotels =  []
    await fetchPopularHotels()
}

async function fetchPopularHotels() {
    let request = await httpRequest('../controllers/fetchpopularhotels')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = popularhotels = request.data
            resolvePagination(datasource, onPopularHotelsTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onPopularHotelsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.locationinfo}</td>
        <td>${item.imageurl}</td>
        <td>${item.otherinfo}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editPopularHotelsItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removePopularHotelsItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function editPopularHotelsItem(event, index) {
    let selectedItem = popularhotels.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('popularhotelsform')
            form.owner.value = selectedItem.owner
            form.locationinfo.value = selectedItem.locationinfo
            form.imageurl.value = selectedItem.imageurl
            form.otherinfo.value = selectedItem.otherinfo
            form.status.value = selectedItem.status
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removePopularHotelsItem(event, index) {
    let selectedItem = popularhotels.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('popularhotelsform')
        let request = await httpRequest('../controllers/removepopularhotels', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchPopularHotels()
            return
        }
        return notification(request.message, 0)
    }
}

async function popularHotelsFormSubmitHandler() {
    if(!runAdpopularHotelsFormValidations()) return

    let form = document.getElementById('popularhotelsform')
    let payload = new FormData(form)
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
    let request = await httpRequest('../controllers/popularhotelscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchPopularHotels()
        return
    }
    return notification(request.message, 0)
}


function runAdpopularHotelsFormValidations() {
    let form = document.getElementById('popularhotelsform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#locationinfo'))  controls.push([form.querySelector('#locationinfo'), 'location info is required'])
    if(controlHasValue(form, '#imageurl'))  controls.push([form.querySelector('#imageurl'), 'imageurl is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'status is required'])
    
    return mapValidationErrors(errorElements, controls)   

}