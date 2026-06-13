let otherpaymentsid
async function otherpaymentsActive() { 
    fetchmorefeesa()
    const form = document.querySelector('#otherpaymentsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', otherpaymentssubmitss)
    let request1 = await httpRequest2('../controllers/fetchtenants', null, null, 'json')
    if(request1.status){
        document.getElementById('ownerid').innerHTML = `<option value="">-- Select Client --</option>`
            document.getElementById('ownerid').innerHTML += request1.data.map(data=>`<option value="${data.tenantdata.id}">${data.tenantdata.firstname} ${data.tenantdata.lastname} ${data.tenantdata.othernames}</option>`).join('');
    }else return notification('Unable to retrieve clients try reloading')
    if(otherpaymentsid){
        document.getElementById('id').value = otherpaymentsid
        function payloadd(){
            let params = new FormData()
            params.append('id', otherpaymentsid)
            return params
        }
         let request = await httpRequest2('../controllers/paymenthistory', payloadd())
        //  request = JSON.parse(request)
         if(request.status){ 
             if(request.data.length){
                 console.log('data gotten', request.data)
                 populateData(request.data[0])
                 document.getElementById('transactiondate').value = request.data[0].transactiondate.split(' ')[0]
             }
         }else{
             return notification(request.message, 0)
         }
         
    }
    otherpaymentsid = ''
}

async function fetchmorefeesa() {
    let request = await fetchEnsuredMoreFees()
    if(request.status) {
        if(request.data.length) {
            document.getElementById('feenameid').innerHTML = `<option value="">-- Select Fee Name --</option>`
            document.getElementById('feenameid').innerHTML += request.data.map(data=>`<option value="${data.id}">${data.feename}</option>`).join('');
        }
    }
    else return notification(request.message || 'No records retrieved')
}

async function otherpaymentssubmitss(){
    if(!validateForm('otherpaymentsform', getallid('otherpaymentsverify'))) return notification('Please fill all the required fields', 0)
    let payload

    payload = getFormData2(document.querySelector('#otherpaymentsform'), document.getElementById('id').value ? [['id', document.getElementById('id').value]] : null)
    // function payload(){
    //     let params = new FormData()
    //     if(document.getElementById('id').value)params.append('id', document.getElementById('id').value)
    //     params.append('propertyname', document.getElementById('propertyname').value)
    //     params.append('address', document.getElementById('address').value)
    //     params.append('city', document.getElementById('city').value) 
    //     params.append('state', document.getElementById('state').value)
    //     params.append('numberofunits', document.getElementById('numberofunits').value)
    //     params.append('typeofunits', document.getElementById('typeofunits').value)
    //     params.append('propertymanager', document.getElementById('propertymanager').value)
    //     params.append('rowcount', document.getElementById('otherpaymentstable').children.length)
    //     for(let i=0;i<document.getElementById('otherpaymentstable').children.length;i++){
    //         let id = document.getElementById('otherpaymentstable').children[i].id;
    //         params.append(`unitname${i+1}`, document.getElementById(`un-${id}`).value)
    //         params.append(`rent${i+1}`, document.getElementById(`ar-${id}`).value)
    //     }
    //     return params
    // }
    let request = await httpRequest2('../controllers/otherpaymentscript', payload, document.querySelector('#otherpaymentsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#otherpaymentsform').reset();
        document.querySelector('#imagePreview').innerHTML = '';
        return
    }
    document.querySelector('#otherpaymentsform').reset();
    document.querySelector('#imagePreview').innerHTML = '';
    return notification(request.message, 0);

}
