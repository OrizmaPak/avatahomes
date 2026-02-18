let profileid
async function profileActive() {
    if(document.getElementById('user_role').value == 'SUPERADMIN'){
        elementWithId('MERCHANT').classList.remove('hidden')
        elementWithId('SUPERADMIN').classList.remove('hidden')
    }else{
        elementWithId('MERCHANT').classList.add('hidden')
        elementWithId('SUPERADMIN').classList.add('hidden')
    }
    entername();
    const form = document.querySelector('#profilesform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', profileFormSubmitHandler)
   async function profileFormSubmitHandler(){
    if(!validateForm('profilesform', [`email`])) return
    
    let payload

    payload = getFormData2(document.querySelector('#profilesform'), [['imageurl', document.getElementById('imageurl').files[0]]])
    let request  
    if(!profileid)request = await httpRequest2('../controllers/userscript', payload, document.querySelector('#profilesform #submit'))
    if(profileid)request = await httpRequest2('../controllers/updateuser', payload, document.querySelector('#profilesform #submit'))
    if(request.status) {
        notification('Record saved successfully!', 1);
        document.querySelector('#profilesform').reset();
        fetchprofiles();
        return
    }else{
        document.querySelector('#profilesform').reset();
        fetchprofiles();
        return notification(request.message, 0);
    }
}
if(sessionStorage.getItem('edituser')){
        let data = sessionStorage.getItem('edituser')
        sessionStorage.removeItem('edituser')
        await fetchprofiles(data)
    }else  await fetchprofiles()
}

async function fetchprofiles(id="") {
    profileid = id
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('email', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchuserprofile', id ? getparamm() : null, null, 'json')
    if(request.status) {
            if(request) {
                populateData(request)
                document.getElementById('logoFrame').src = '../images/'+request.imageurl
            }
    }
    else return notification('No records retrieved')
}
