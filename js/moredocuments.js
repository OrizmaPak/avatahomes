let moredocumentsid
async function moredocumentsActive() { 
    const form = document.querySelector('#moredocumentsform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', moredocumentssubmit)
    //     let request = await httpRequest2('../controllers/fetchproperty', null, null, 'json')
    // if(request.status){
    //     rentapropertyresult = request.data
    //     document.getElementById('ownerid').innerHTML = `<option value="">-- Select Property --</option>`
    //         document.getElementById('ownerid').innerHTML += request.data.map(data=>`<option value="${data.property.id}">${data.property.propertyname}</option>`).join('');
    // }else return notification('Unable to retrieve properties try reloading')
    let request1 = await httpRequest2('../controllers/fetchtenants', null, null, 'json')
    if(request1.status){
        console.log('request1', request1)   
        document.getElementById('tenantid').innerHTML = `<option value="">-- Select Client --</option>`
            document.getElementById('tenantid').innerHTML += request1.data.map(data=>`<option value="${data.tenantdata.id}">${data.tenantdata.firstname} ${data.tenantdata.lastname} ${data.tenantdata.othernames}</option>`).join('');
    }else return notification('Unable to retrieve clients try reloading')
    if(moredocumentsid){
        document.getElementById('id').value = moredocumentsid
        function payloadd(){
            let params = new FormData() 
            params.append('id', moredocumentsid)
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
    moredocumentsid = ''
}
 
async function moredocumentssubmit(){
    if(!validateForm('moredocumentsform', getallid('moredocumentsverify'))) return
    let payload

    payload = getFormData2(document.querySelector('#moredocumentsform'), document.getElementById('id').value ? [['id', document.getElementById('id').value]] : null)
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
    //     params.append('rowcount', document.getElementById('moredocumentstable').children.length)
    //     for(let i=0;i<document.getElementById('moredocumentstable').children.length;i++){
    //         let id = document.getElementById('moredocumentstable').children[i].id;
    //         params.append(`unitname${i+1}`, document.getElementById(`un-${id}`).value)
    //         params.append(`rent${i+1}`, document.getElementById(`ar-${id}`).value)
    //     }
    //     return params
    // }
    let request = await httpRequest2('../controllers/tenancydocs', payload, document.querySelector('#moredocumentsform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#moredocumentsform').reset();
        return
    }
    // document.querySelector('#moredocumentsform').reset();
    return notification(request.message, 0);

}
