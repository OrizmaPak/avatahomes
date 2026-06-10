async function footerQuickLinksActive() {
    const form = document.querySelector('#footerquicklinksform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', footerQuickLinksFormSubmitHandler)
    datasource = footerquicklinks =  []
    await fetchFooterQuickLinks()
}

async function fetchFooterQuickLinks() {
    let request = await httpRequest('../controllers/fetchfooterquicklinks')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = footerquicklinks = request.data
            resolvePagination(datasource, onFooterQuickLinkTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onFooterQuickLinkTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.category}</td>
        <td>${item.title}</td>
        <td>${item.url}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editFooterQuickLinkItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-show-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removeFooterQuickLinkItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function editFooterQuickLinkItem(event, index) {
    let selectedItem = footerquicklinks.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('footerquicklinksform')
            form.owner.value = selectedItem.owner
            form.title.value = selectedItem.title
            form.status.value = selectedItem.status
            form.category.value = selectedItem.category
            form.url.value = selectedItem.url
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removeFooterQuickLinkItem(event, index) {
    let selectedItem = footerquicklinks.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('footerquicklinksform')
        let request = await httpRequest('../controllers/removefooterquicklinks', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchFooterQuickLinks()
            return
        }
        return notification(request.message, 0)
    }
}

async function footerQuickLinksFormSubmitHandler() {
    if(!runfooterQuickLinksFormValidations()) return

    let form = document.getElementById('footerquicklinksform')
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
    let request = await httpRequest('../controllers/footerquicklinkscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchFooterQuickLinks()
        return
    }
    return notification(request.message, 0)
}


function runfooterQuickLinksFormValidations() {
    let form = document.getElementById('footerquicklinksform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#title'))  controls.push([form.querySelector('#title'), 'title is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'status is required'])
    if(controlHasValue(form, '#category'))  controls.push([form.querySelector('#category'), 'category is required'])
    if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
    
    return mapValidationErrors(errorElements, controls)   

}