let morefeesid
async function morefeesActive() { 
    const form = document.querySelector('#morefeesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', morefeessubmit)
        fetchmorefees()
    morefeesid = ''
}


async function fetchmorefees(event,id) {
    if(event)event.preventDefault()
    if(id){
        document.getElementById('id').value = id
        morefeesid = id
        function payloadd(){
            let params = new FormData()
            params.append('id', id)
            return params
        }
         let request = await httpRequest2('../controllers/fetchmorefees', payloadd())
        //  request = JSON.parse(request)
         if(request.status){
             if(request.data.length){
                 console.log('data gotten', request.data)
                 populateData(request.data[0])
             }
         }else{
             return notification(request.message, 0)
         }
         
    }else{
        let request = await httpRequest('../controllers/fetchmorefees')
        request = JSON.parse(request)
        if(request.status) {
            if(request.data.length) {
                datasource = morefees = request.data
                resolvePagination(datasource, onmorefeesTableDataSignal)
            }
        }
        else return notification('No records retrieved')
    }
}

async function onmorefeesTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.feename}</td>
        <td>${item.mode}</td>
        <td>${item.amount}</td>
        <td class="flex items-center gap-3">
            <button onclick="fetchmorefees(event, ${item.id})" title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button onclick="removemorefeesItem(event, ${item.id})" title="Delete row entry" class="hidden material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

async function morefeessubmit(){
    if(!validateForm('morefeesform', getallid('morefeesverify'))) return
    let payload

    payload = getFormData2(document.querySelector('#morefeesform'), document.getElementById('id').value ? [['id', document.getElementById('id').value]] : null)
   
    let request = await httpRequest2('../controllers/addmorefees', payload, document.querySelector('#morefeesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#morefeesform').reset();
        fetchmorefees()
        return
    }
    document.querySelector('#morefeesform').reset(); 
    return notification(request.message, 0);

}
