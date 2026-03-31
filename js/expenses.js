let expensesid
async function expensesActive() { 
    //the fetchmorefessa function can be found in otherpayments.js
    fetchmorefeesa()
    const form = document.querySelector('#expensesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', expensessubmit)
        let request = await httpRequest2('../controllers/fetchproperty', null, null, 'json')
    if(request.status){
        rentapropertyresult = request.data
        document.getElementById('ownerid').innerHTML = `<option value="">-- Select Property --</option>`
            document.getElementById('ownerid').innerHTML += request.data.map(data=>`<option value="${data.property.id}">${data.property.propertyname}</option>`).join('');
    }else return notification('Unable to retrieve properties try reloading')
    // let request1 = await httpRequest2('../controllers/fetchtenants', null, null, 'json')
    // if(request1.status){
    //     document.getElementById('ownerid').innerHTML = `<option value="">-- Select Tenant --</option>`
    //         document.getElementById('ownerid').innerHTML += request1.data.map(data=>`<option value="${data.id}">${data.firstname} ${data.lastname} ${data.othernames}</option>`).join('');
    // }else return notification('Unable to retrieve tenants try reloading')
    if(expensesid){
        document.getElementById('id').value = expensesid
        function payloadd(){
            let params = new FormData()
            params.append('id', expensesid)
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
    expensesid = '' 
} 

async function expensessubmit(){
    if(!validateForm('expensesform', getallid('expensesverify'))) return
    let payload

    payload = getFormData2(document.querySelector('#expensesform'), document.getElementById('id').value ? [['id', document.getElementById('id').value]] : null)
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
    //     params.append('rowcount', document.getElementById('expensestable').children.length)
    //     for(let i=0;i<document.getElementById('expensestable').children.length;i++){
    //         let id = document.getElementById('expensestable').children[i].id;
    //         params.append(`unitname${i+1}`, document.getElementById(`un-${id}`).value)
    //         params.append(`rent${i+1}`, document.getElementById(`ar-${id}`).value)
    //     }
    //     return params
    // }
    let request = await httpRequest2('../controllers/expenses', payload, document.querySelector('#expensesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#expensesform').reset();
        return
    }
    document.querySelector('#expensesform').reset();
    return notification(request.message, 0);

}
