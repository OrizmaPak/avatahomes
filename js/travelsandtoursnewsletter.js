async function travelsAndToursNewsLetterActive() {
    const form = document.querySelector('#travelsandtoursnewletterform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', travelsAndToursNewsLetterFormSubmitHandler)
    datasource = travelsandtoursnewletters =  []
    await fetchTravelsAndToursNewsLetterss()
}

async function fetchTravelsAndToursNewsLetterss() {
    let request = await httpRequest('../controllers/fetchnewsletter.php')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = travelsandtoursnewletters = request.data
            resolvePagination(datasource, onTravelsAndToursNewsLettersTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onTravelsAndToursNewsLettersTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.title}</td>
        <td>${item.email}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editTravelsAndToursNewsLettersItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removeTravelsAndToursNewsLettersItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function editTravelsAndToursNewsLettersItem(event, index) {
    let selectedItem = travelsandtoursnewletters.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('travelsandtoursnewletterform')
            form.owner.value = selectedItem.owner
            form.title.value = selectedItem.title
            form.status.value = selectedItem.status
            form.email.value = selectedItem.email
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removeTravelsAndToursNewsLettersItem(event, index) {
    let selectedItem = travelsandtoursnewletters.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('travelsandtoursnewletterform')
        let request = await httpRequest('../controllers/removenewsletter', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchTravelsAndToursNewsLetterss()
            return
        }
        return notification(request.message, 0)
    }
}

async function travelsAndToursNewsLetterFormSubmitHandler() {
    if(!runTravelsAndToursNewsLetterFormValidations()) return

    let form = document.getElementById('travelsandtoursnewletterform')
    let payload = new FormData(form)
    if(form.querySelector('#submit').value?.split('-')[0] == 'u') {
        payload.append('id', form.querySelector('#submit').value?.split('-')[1])
    }
    let request = await httpRequest('../controllers/newsletterscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchTravelsAndToursNewsLetterss()
        return
    }
    return notification(request.message, 0)
}


function runTravelsAndToursNewsLetterFormValidations() {
    let form = document.getElementById('travelsandtoursnewletterform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#title'))  controls.push([form.querySelector('#title'), 'title is required'])
    if(controlHasValue(form, '#email'))  controls.push([form.querySelector('#email'), 'Company email is required'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'status is required'])

    return mapValidationErrors(errorElements, controls)   

}