async function trendingFlightActive() {
    const form = document.querySelector('#trendingflightdealsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', trendingFlightDealsFormSubmitHandler)
    datasource = trendingflightdeals =  [];
    await fetchTrendingFlightDeals()
}


async function fetchTrendingFlightDeals() {
    let request = await httpRequest('../controllers/fetchtrendingflightdeals')
    request = JSON.parse(request)
    if(request.status) {
        if(request.data.length) {
            datasource = trendingflightdeals = request.data
            resolvePagination(datasource, onTrendingFlightDealsTableDataSignal)
        }
    }
    else return notification('No records retrieved')
}

async function onTrendingFlightDealsTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.owner}</td>
        <td>${item.locationinfo}</td>
        <td>${item.paymentinfo}</td>
        <td>
            ${new Date(item.daterange.split('.')[0]).toLocaleDateString()} - 
            ${new Date(item.daterange.split('.')[1]).toLocaleDateString()}
        </td>
        <td>${item.airlinelogo}</td>
        <td>${item.imageurl}</td>
        <td>${item.status}</td>
        <td class="flex items-center gap-3">
            <button onclick="editTrendingFlightDealsItem(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removeTrendingFlightDealsItem(event, ${item.id})" title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}



async function editTrendingFlightDealsItem(event, index) {
    let selectedItem = trendingflightdeals.find(item => item.id == index)
    if(selectedItem) {
        try {
            form = document.getElementById('trendingflightdealsform')
            form.owner.value = selectedItem.owner
            form.status.value = selectedItem.status
            form.locationinfo.value = selectedItem.locationinfo
            if(selectedItem.daterange && selectedItem.daterange !== '-') {
                form.datefrom.value = selectedItem.daterange.split('.')[0]
                form.dateto.value = selectedItem.daterange.split('.')[1]
            }
            form.paymentinfo.value = selectedItem.paymentinfo
            form.airlinelogo.value = selectedItem.airlinelogo
            form.status.value = selectedItem.status
            form.imageurl.value = selectedItem.imageurl
            form.querySelector('#submit').value = `u-${index}`
        }
        catch(e) { console.log(e) }
    }
}

async function removeTrendingFlightDealsItem(event, index) {
    let selectedItem = trendingflightdeals.find(item => item.id == index)
    if(selectedItem) {
        if(!confirm('You are about to delete this item')) return
        let payload = new FormData()
        payload.append('id', selectedItem.id)
        let form = document.getElementById('trendingflightdealsform')
        let request = await httpRequest('../controllers/removetrendingflightdeals', payload, form.submit)
        if(request.status) {
            form.reset()
            document.getElementById('tabledata').innerHTML = ''
            notification('Record deleted successfully!', 1)
            fetchTrendingFlightDeals()
            return
        }
        return notification(request.message, 0)
    }
}

async function trendingFlightDealsFormSubmitHandler() {
    if(!runTrendingFlightDealsFormValidations()) return

    let form = document.getElementById('trendingflightdealsform')
    let payload = new FormData(form)
    payload.append('daterange', form.datefrom.value.concat('.',form.dateto.value))
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
    let request = await httpRequest('../controllers/trendingflightdealscript', payload, form.submit)
    if(request.status) {
        form.reset()
        document.getElementById('tabledata').innerHTML = ''
        notification('Record saved successfully!', 1)
        fetchTrendingFlightDeals()
        return
    }
    return notification(request.message, 0)
}


function runTrendingFlightDealsFormValidations() {
    let form = document.getElementById('trendingflightdealsform')
    let errorElements = form.querySelectorAll('.control-error')
    let controls = []

    if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
    if(controlHasValue(form, '#status'))  controls.push([form.querySelector('#status'), 'status is required'])
    if(controlHasValue(form, '#locationinfo'))  controls.push([form.querySelector('#locationinfo'), 'location info is required'])
    if(controlHasValue(form, '#datefrom'))  controls.push([form.querySelector('#datefrom'), 'Starting date is required'])
    if(controlHasValue(form, '#dateto'))  controls.push([form.querySelector('#dateto'), 'Ending date is required'])
    if(controlHasValue(form, '#paymentinfo'))  controls.push([form.querySelector('#paymentinfo'), 'payment info is required'])
    if(controlHasValue(form, '#airlinelogo'))  controls.push([form.querySelector('#airlinelogo'), 'airline logo is required'])
    if(controlHasValue(form, '#imageurl'))  controls.push([form.querySelector('#imageurl'), 'image url is required'])
    
    return mapValidationErrors(errorElements, controls)   

}
