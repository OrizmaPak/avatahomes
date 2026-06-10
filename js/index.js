let the_user = JSON.parse(localStorage.getItem('user'));
let userpermission
let notificationarray = []  
window.onload = async   function() {
    resolveUrlPage() 
    runPermissions()
    checkAccountForVerification()
    window.addEventListener('popstate', resolveUrlPage);

    const toggler = document.getElementById('toggler')
    if(toggler) toggler.addEventListener('click', toggleNavigation)

    if(!isDeviceMobile()) {
        const navigation =  document.getElementById('navigation')
        navigation.classList.add('show')
    }

    Array.from(document.querySelectorAll('#navigation .nav-item > span')).forEach( nav => {
        nav.addEventListener('click', () => {
            if(nav.nextElementSibling?.tagName.toLocaleLowerCase() == 'ul') {
                if(nav.parentElement.classList.contains('expand')) {
                    nav.parentElement.style.maxHeight = '36px';
                    nav.parentElement.classList.remove('expand')
                    nav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(0deg)'
                }
                else {
                    nav.parentElement.style.maxHeight = '500px';
                    nav.parentElement.classList.add('expand')
                    nav.querySelectorAll('.material-symbols-outlined')[1].style.transform = 'rotate(90deg)'
                }
            }
        })
    })

    Object.keys(routerTree).forEach( route => {
        if(route && !!document.getElementById(route)) {
            document.getElementById(route)?.addEventListener('click', () => {
                routerEvent(route)
                showActiveRoute()
            })
        }
    })

    const scriptsResource = Object.keys(routerTree).map( route => {
        return { url: routerTree[route].scriptName, controller: routerTree[route].startingFunction}
    })

    scriptsResource.filter( item => item.url !== '').forEach( resource => {
        loadScript(resource)
    })
    // Direct the panel's initial state when the page loads
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('notificationpanel');
        const button = document.querySelector('button[onclick="notificationpanel()"]'); 

        // If the click was outside the panel and not on the button, hide the panel
        if (panel && !panel.contains(event.target) && !button.contains(event.target)) {
            panel.classList.remove('!h-[400px]', 'opacity-100', 'visible');
            panel.classList.add('!h-[0px]', 'opacity-0', 'invisible');
        }
    });

    await checkfornotifications()
    await appendallnotifications()
}

async function appendallnotifications(){
    let notifications = document.getElementById('notification_content_holder')
    notifications.innerHTML = ''
    let badge = document.getElementById('notification_badge_count')
    if(!notificationarray.length){
        badge.innerHTML = 0
        badge.classList.add('hidden')
        notifications.innerHTML = `<div class="qq flex justify-between border rounded-md p-2">
        <div class="qq flex flex-col gap-2">
          <p class="qq font-semibold text-sm text-left">No Notifications</p>
          <p class="qq font-normal text-xs "></p>
        </div>
      </div>`
        return
    }
    badge.innerHTML = notificationarray.length
    badge.classList.remove('hidden')
    for(let i=0;i<notificationarray.length;i++){
        let notification = notificationarray[i]
        notifications.innerHTML += `<div onclick="document.getElementById('${notification.location}').click()" name="notification_approvenotification" class="qq flex justify-between border rounded-md p-2">   
        <div class="qq flex flex-col gap-2">
          <p class="qq font-semibold text-sm text-left">${notification.header}</p>          
          <p class="qq font-normal text-xs ">${notification.description}</p>
        </div>
        <p class="qq my-auto bg-blue-500 px-2 h-4 text-xs rounded-full text-white">1</p>
      </div>`;
    }
}

async function checkfornotifications() {
    let request = await httpRequest2('../controllers/notifyduerents', null, null, 'json')
    if(request.status) {
        if(request.data.length) {
            let notifications = request.data
            notifications.map(data=>notificationarray.push({
                location:'duerentals',
                header: 'Due Property Payments',
                description: data.unitname+' in '+data.propertydata.propertyname+' has a due property payment',
            }))
            // badge.classList.remove('hidden')
        }else{
            // badge.classList.add('hidden')   
        }
    }
} 

function notificationpanel() {
    const panel = document.getElementById('notificationpanel');
    
    // Toggle the panel's visibility using Tailwind classes
    if (panel.classList.contains('!h-[0px]')) {
        panel.classList.remove('!h-[0px]', 'opacity-0', 'invisible');
        panel.classList.add('!h-[400px]', 'opacity-100', 'visible');
    } else {
        panel.classList.remove('!h-[400px]', 'opacity-100', 'visible');
        panel.classList.add('!h-[0px]', 'opacity-0', 'invisible');
    }
}


// Event listener for outside clicks


async function entername(){
    // if(!sessionStorage.getItem('user'))return window.location.href = './login.html'
    let x = JSON.parse(localStorage.getItem('user'))
    for(let i=0;i<document.getElementsByName('user_name').length;i++){
        if(document.getElementsByName('user_name')[i])document.getElementsByName('user_name')[i].innerHTML = `<span class="capitalize">${x.firstname}&nbsp;${x.lastname}</span>`
    }
    for(let i=0;i<document.getElementsByName('user_role').length;i++){
        if(document.getElementsByName('user_role')[i])document.getElementsByName('user_role')[i].innerHTML = `<span>${x.role}</span>`
    }
    for(let i=0;i<document.getElementsByName('user_email').length;i++){
        if(document.getElementsByName('user_email')[i])document.getElementsByName('user_email')[i].innerHTML = `<span class="capitalize">${x.email}</span>`
    }
    for(let i=0;i<document.getElementsByName('user_image').length;i++){
        if(document.getElementsByName('user_image')[i] && x.image)document.getElementsByName('user_image')[i].src = x.image
    }
    // async function fetchOrganisationData() {
    //     let request = await httpRequest2('api/v1/admin/organizationsettings', null, null, 'json', 'GET');
    //     if (request.status) {
    //         let data = request.data[0];
    //         organisationSettings = data;
    //         document.getElementById('your_companyname').value = data.company_name;
    //         document.getElementById('your_companyphone').value = data.phone;
    //         document.getElementById('your_companyaddress').value = data.address;
    //         document.getElementById('your_companylogo').value = data.logo;
    //         document.getElementById('your_companyemail').value = data.email;
    //     } else {
    //         notification('Failed to fetch organisation data', 0);
    //     }
    // }

    // async function fetchProfileData() {
    //     let request = await httpRequest2('api/v1/auth/profile', null, null, 'json', 'GET');
    //     if (request.status) {
    //         let data = request.data;
    //         if(document.getElementById('branch'))document.getElementById('branch').value = data.branch;
    //         if(document.getElementById('your_role'))document.getElementById('your_role').value = data.role;
    //     } else {
    //         notification('Failed to fetch profile data', 0);
    //     }
    // }

    // fetchOrganisationData();
    // fetchProfileData();
}



async function runPermissions(){
    let permission_switch = 'ON' // 'ON or OFF'
    document.getElementById('navigation').classList.add('hidden');
    let request = the_user
   // if(request.status) {
        userpermission = request.permissions
        let subitems = document.getElementsByClassName('navitem-child')
         if(request.role == 'SUPERADMIN'){ 
             for(i=0; i<subitems.length; i++){
                     subitems[i].classList.remove('hidden');
             }}
        if(request.role != 'SUPERADMIN'){ 
            const permissionAliases = {
                'REGISTER CLIENT': ['REGISTER TENANT'],
                'VIEW CLIENTS': ['VIEW TENANTS'],
                'REGISTER TENANT': ['REGISTER CLIENT'],
                'VIEW TENANTS': ['VIEW CLIENTS'],
                'PROPERTY SALES': ['RENT A PROPERTY'],
                'RENT A PROPERTY': ['PROPERTY SALES'],
                'VIEW PROPERTY SALES': ['VIEW RENTED PROPERTY'],
                'VIEW RENTED PROPERTY': ['VIEW PROPERTY SALES'],
                'DUE PROPERTY PAYMENTS': ['DUE RENTALS/RENEWALS'],
                'DUE RENTALS/RENEWALS': ['DUE PROPERTY PAYMENTS']
            };
            const permissionList = userpermission
                ? (userpermission.includes('|') ? userpermission.split('|') : [userpermission])
                    .map(item => item.trim().toUpperCase())
                    .filter(Boolean)
                : [];
            for(i=0; i<subitems.length; i++){
              const label = subitems[i].textContent.toUpperCase().trim();
              const aliases = permissionAliases[label] || [];
              const hasPermission = permissionList.includes(label) || aliases.some(alias => permissionList.includes(alias));
              if(hasPermission){
                    if(permission_switch === 'ON')subitems[i].classList.remove('hidden');
                }else{
                    if(permission_switch === 'ON')subitems[i].classList.add('hidden');
                }  
                    if(permission_switch === 'OFF')subitems[i].classList.remove('hidden');
            }
            let x =  document.getElementsByClassName('navitem-title')
            for(let i=0;i<x.length;i++){
                if(x[i].nextElementSibling){
                    let y = x[i].nextElementSibling.children
                    let m = false
                    for(let j=0;j<y.length;j++){
                        if(!y[j].classList.contains('hidden'))m = true
                    }
                    if(!m)x[i].classList.add('hidden')
                    if(m)x[i].classList.remove('hidden')
                }
            }
        }
        document.getElementById('navigation').classList.remove('hidden')
  //  }
    //else return notification('No records retrieved')
}


function checkAccountForVerification() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if(user?.status === 'NOT VERIFIED') {
        let div = document.createElement('div')
        div.className = 'bg-rose-400 text-white/90 text-xs p-1.5 px-5 flex items-center gap-3 font-heebo animate__animated animate__fadeInDown'
        div.innerHTML = `<span>Your account is not verified.</span><button class="underline underline-offset-4 hover:no-underline">Click to verify</button>`
        
        let domElement = document.querySelector('main')
        domElement.firstElementChild.insertBefore(div, domElement.firstElementChild.firstElementChild)
    }
}

function toggleNavigation() {
    const navigation =  document.getElementById('navigation')
    if(navigation){
        if(navigation.classList.contains('show')) {
            navigation.style.width = isDeviceMobile() ? '250px' : (80/100 * screen.availWidth ) + 'px'
            navigation.classList.remove('show')
        }
        else {
            navigation.style.width = '0'
            navigation.classList.add('show')
        }
    }
}

function isDeviceMobile() {
    let matches = window.matchMedia('(min-width: 1280px)').matches
    return matches
}
