let organisationinfoid
async function organisationinfoActive() {
    const form = document.querySelector('#organisationinfoform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', organisationinfoFormSubmitHandler)
        await fetchorganisationinfo()
}
async function organisationinfoFormSubmitHandler(){
    // if(!validateForm('organisationinfoform', [`email`])) return
     
     let payload
 
     payload = getFormData2(document.querySelector('#organisationinfoform'))
     let request = await httpRequest2('../controllers/organisation', payload, document.querySelector('#organisationinfoform #submit'))
     if(request.status) {
         notification('Record saved successfully!', 1);
         document.querySelector('#organisationinfoform').reset();
         fetchorganisationinfo();
         return
     }else{
         document.querySelector('#organisationinfoform').reset();
         fetchorganisationinfo();
         return notification(request.message, 0);
     }
 }

async function fetchorganisationinfo(id="") {
organisationinfoid = id
let request = await httpRequest2('../controllers/fetchorganisation', null, null, 'json')
if(request.status) {
        if(request) {
            populateData(request.data[0])
            document.getElementById('logoFrame').src = '../images/'+request.data[0].logo
        }
}
else return notification('No records retrieved')
}