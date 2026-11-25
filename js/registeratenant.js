async function registeratenantActive() {
    const form = document.querySelector('#registeratenantform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', registeratenantsubmit)
    const registeratenantid = `${sessionStorage.getItem('registeratenantid') || ''}`.trim()
    sessionStorage.removeItem('registeratenantid')

    if(registeratenantid){
        document.getElementById('id').value = registeratenantid
        function payloadd(){
            let params = new FormData()
            params.append('id', registeratenantid)
            return params
        }
         let request = await httpRequest2('../controllers/fetchtenants', payloadd())
         if(!request?.status){
             return notification(request?.message || 'Unable to load this client.', 0)
         }

         const clients = Array.isArray(request.data) ? request.data : []
         const selectedClient = clients.find((client) => `${client?.tenantdata?.id ?? client?.id ?? ''}` === registeratenantid)
         if (!selectedClient) {
             document.getElementById('id').value = ''
             return notification('The selected client could not be found.', 0)
         }

         populateData(selectedClient.tenantdata || selectedClient)
    }
}

async function registeratenantsubmit(){
    if(!validateForm('registeratenantform', getallid('registeratenantverify'))) return
    let payload

    const formData = new FormData(document.querySelector('#registeratenantform'));

    if (document.getElementById('id').value) {
        formData.append('id', document.getElementById('id').value);
    }

    // Dependants
    const deps = [...document.querySelectorAll('#dependantTableBody tr')];
    formData.append('dependentrows', deps.length);
    deps.forEach((r, i) => {
        const idx = i + 1, cells = r.cells;
        const raw = cells[0].innerText.replace('account_circle', '').trim();
        formData.append(`fullname${idx}`, raw); 
        formData.append(`phone${idx}`, cells[1].innerText.trim());
        formData.append(`occupation${idx}`, cells[2].innerText.trim());
        const b = cells[3].querySelector('span');
        formData.append(`relationship${idx}`, b ? b.innerText.trim() : cells[3].innerText.trim());
    });

    payload = formData;
    //     let params = new FormData()
    //     if(document.getElementById('id').value)params.append('id', document.getElementById('id').value)
    //     params.append('propertyname', document.getElementById('propertyname').value)
    //     params.append('address', document.getElementById('address').value)
    //     params.append('city', document.getElementById('city').value)
    //     params.append('state', document.getElementById('state').value)
    //     params.append('numberofunits', document.getElementById('numberofunits').value)
    //     params.append('typeofunits', document.getElementById('typeofunits').value)
    //     params.append('propertymanager', document.getElementById('propertymanager').value)
    //     params.append('rowcount', document.getElementById('registeratenanttable').children.length)
    //     for(let i=0;i<document.getElementById('registeratenanttable').children.length;i++){
    //         let id = document.getElementById('registeratenanttable').children[i].id;
    //         params.append(`unitname${i+1}`, document.getElementById(`un-${id}`).value)
    //         params.append(`rent${i+1}`, document.getElementById(`ar-${id}`).value)
    //     }
    //     return params
    // }
    let request = await httpRequest2('../controllers/tenantscript', payload, document.querySelector('#registeratenantform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#registeratenantform').reset();
        document.querySelector('#imagePreview').innerHTML = '';
        document.getElementById('dependantTableBody').innerHTML = '';
        return
    }
    document.querySelector('#registeratenantform').reset();
    document.querySelector('#imagePreview').innerHTML = '';
    document.getElementById('dependantTableBody').innerHTML = '';
    return notification(request.message, 0);

}
