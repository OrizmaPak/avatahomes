/* 
    Object key is the id of the  menu selector
    template: is the html template name.
    startingFunction: function to call when page opens 

*/

const routerTree = {

    logo: {
        template: 'logo',
        startingFunction: 'logoRouteActive',
        scriptName: './js/logo.js'
    },
    navigation_: {
        template: 'navigation',
        startingFunction: 'navigationRouteActive',
        scriptName: './js/navigation.js'
    },
    banner: {
        template: 'banner',
        startingFunction: 'bannerRouteActive',
        scriptName: './js/banner.js'
    }, 
    otherinfo: {
        template: 'otherinfo',
        startingFunction: 'otherinfoRouteActive',
        scriptName: './js/otherinfo.js'
    },
    copyright: {
        template: 'copyright',
        startingFunction: 'copyrightRouteActive',
        scriptName: './js/copyright.js'
    },
    partners: {
        template: 'partners',
         startingFunction: 'partnersRouteActive',
        scriptName: './js/partners.js'
    },
    seatcategory: {
        template: 'seatcategory',
        startingFunction: 'seatcategoryRouteActive',
        scriptName: './js/seatcategory.js'
    },
    socialmedialinks: {
        template: 'socialmedialinks',
        startingFunction: 'socialmedialinksRouteActive',
        scriptName: './js/socialmedialinks.js'
    },
    staticadbanner: {
        template: 'staticadbanner',
        startingFunction: 'staticadbannerRouteActive',
        scriptName: './js/staticadbanner.js'
    },
    visa_countries: {
        template: 'visaprocessingcountries',
        startingFunction: 'visaprocessingcountriesRouteActive',
        scriptName: './js/visaprocessingcountries.js'
    },
    tabpromotion: {
        template: 'tabpromotion',
        startingFunction: 'tabPromotionRouteActive',
        scriptName: './js/tabpromotion.js'
    }, 
    addslider: {
        template: 'addslider',
        startingFunction: 'sliderRouteActive',
        scriptName: './js/addslider.js'
    }, 
    trendingfd: {
        template: 'trendingflightdeals',
        startingFunction: 'trendingFlightActive',
        scriptName: './js/trendingflightdeals.js'
    },  
    popular_hotels: {
        template: 'popularhotels',
        startingFunction: 'popularHotelsActive',
        scriptName: './js/popularhotels.js'
    }, 
    tandtnewsletter: {
        template: 'travelsandtoursnewsletter',
        startingFunction: 'travelsAndToursNewsLetterActive',
        scriptName: './js/travelsandtoursnewsletter.js'
    }, 
    footerquicklinks: {
        template: 'footerquicklinks',
        startingFunction: 'footerQuickLinksActive',
        scriptName: './js/footerquicklinks.js'
    }, 
    search: {
        template: 'searchflightshotelsanddestinations',
        startingFunction: 'searchActive',
        scriptName:  './js/search.js'
    },
    propertyregistration: {
        template: 'propertyregistration',
        startingFunction: 'propertyregistrationActive',
        scriptName:  './js/propertyregistration.js'
    },
    viewpropertyregistration: {
        template: 'viewpropertyregistration',
        startingFunction: 'viewpropertyregistrationActive',
        scriptName:  './js/viewpropertyregistration.js'
    },
    registeratenant: {
        template: 'registeratenant',
        startingFunction: 'registeratenantActive',
        scriptName:  './js/registeratenant.js'
    },
    rentaproperty: {
        template: 'rentaproperty',
        startingFunction: 'rentapropertyActive',
        scriptName:  './js/rentaproperty.js?v=20260220a'
    },
    viewtenants: {
        template: 'viewtenants',
        startingFunction: 'viewtenantsActive', 
        scriptName:  './js/viewtenants.js'
    },
    viewenquires: {
        template: 'viewenquires',
        startingFunction: 'viewenquiresActive',
        scriptName: './js/viewenquires.js'
    },
    viewrentaproperty: {
        template: 'viewrentaproperty',
        startingFunction: 'viewrentapropertyActive',
        scriptName:  './js/viewrentaproperty.js'
    },
    duerentals: {
        template: 'duerentals',
        startingFunction: 'duerentalsActive',
        scriptName:  './js/duerentals.js'
    },
    otherpayments: {
        template: 'otherpayments',
        startingFunction: 'otherpaymentsActive',
        scriptName:  './js/otherpayments.js'
    },
    paymenthistory: {
        template: 'paymenthistory',
        startingFunction: 'paymenthistoryActive',
        scriptName:  './js/paymenthistory.js'
    },
    addglaccount: {
        template: 'addglaccount',
        startingFunction: 'addglaccountActive',
        scriptName: './js/addglaccount.js?v=20260219b'
    },
    viewglaccount: {
        template: 'viewglaccount',
        startingFunction: 'viewglaccountActive',
        scriptName: './js/viewglaccount.js?v=20260219b'
    },
    addgltransaction: {
        template: 'addgltransaction',
        startingFunction: 'addgltransactionActive',
        scriptName: './js/addgltransaction.js?v=20260613c'
    },
    gltransactionhistory: {
        template: 'gltransactionhistory',
        startingFunction: 'gltransactionhistoryActive',
        scriptName: './js/gltransactionhistory.js?v=20260219b'
    },
    trialbalance: {
        template: 'trialbalance',
        startingFunction: 'trialbalanceActive',
        scriptName: './js/trialbalance.js?v=20260219b'
    },
    incomestatement: {
        template: 'incomestatement',
        startingFunction: 'incomestatementActive',
        scriptName: './js/incomestatement.js?v=20260219b'
    },
    balancesheet: {
        template: 'balancesheet',
        startingFunction: 'balancesheetActive',
        scriptName: './js/balancesheet.js?v=20260219b'
    },
    morefees: {
        template: 'morefees',
        startingFunction: 'morefeesActive',
        scriptName:  './js/morefees.js?v=20260219d'
    },
    expenses: {
        template: 'expenses',
        startingFunction: 'expensesActive',
        scriptName:  './js/expenses.js'
    },
    viewexpenses: { 
        template: 'viewexpenses',
        startingFunction: 'viewexpensesActive',
        scriptName:  './js/viewexpenses.js'
    },
    moredocuments: {
        template: 'moredocuments',
        startingFunction: 'moredocumentsActive',
        scriptName:  './js/moredocuments.js'
    },
    access_control: {
        template: 'accesscontrol',
        startingFunction: 'accesscontrolActive',
        scriptName: `./js/accesscontrol.js?q=${Math.random()}`
    },
    profile: {
        template: 'profile',
        startingFunction: 'profileActive',
        scriptName: `./js/profile.js?q=${Math.random()}`
    },
    password: {
        template: 'changepassword',
        startingFunction: 'changepasswordActive',
        scriptName: `./js/changepassword.js?q=${Math.random()}`
    },
    organisationinfo: {
        template: 'organisationinfo',
        startingFunction: 'organisationinfoActive',
        scriptName: `./js/organisationinfo.js?q=${Math.random()}`
    },
    net: {
        template: 'net',
        startingFunction: 'netActive',
        scriptName: `./js/net.js?q=${Math.random()}`
    },
    'user/select': {
        template: 'selectuser',
        startingFunction: 'selectUserActive',
        scriptName: `./js/selectuser.js?q=${Math.random()}`
    },
    'user/deactivate': {
        template: 'deactivateuser',
        startingFunction: 'deactivateUserActive',
        scriptName: `./js/deactivateuser.js?q=${Math.random()}`
    },
    
}

const ext = '.php'

function routerEvent(route) {
    if(route) {
        let queryParams = `?r=${route}`
        window.history.pushState(queryParams, undefined, `${window.origin.concat(window.location.pathname, queryParams)}`)
        resolveUrlPage()
        if(!isDeviceMobile()) toggleNavigation()
    }
}


function resolveUrlPage() {
    let searchParams = new URLSearchParams(window.location.search)
    if(searchParams.has('r')) {
        let page = routerTree[searchParams.get('r').trim()].template
        openRoute(page+ext)
    }
    else {
        // open home default page
        let queryParams = `?r=propertyregistration`
        window.history.pushState(queryParams, undefined, `${window.origin.concat(window.location.pathname, queryParams)}`)
        openRoute('propertyregistration'+ext)
    }
    showActiveRoute()
}

function showActiveRoute() {

    let searchParams = new URLSearchParams(window.location.search)
    let page = searchParams.get('r')
    let menu = document.getElementById(page)
    document.querySelectorAll('#navigation .active').forEach( item => item.classList.remove('active'))
    document.querySelectorAll('#navigation .navitem-child-active').forEach( item => item.classList.remove('navitem-child-active'))
    if(menu.classList.contains('navitem-child')) {
        menu.classList.add('navitem-child-active')
        menu.parentElement.previousElementSibling.classList.add('active')
    }
    else menu.classList.add('active')
    
}


async function openRoute(url) {
    try {

        document.getElementById('workspace').innerHTML = `
            <div class="w-full h-full flex mt-20">
                <div class="loader m-auto"></div>
            </div>
        `
        document.getElementById('workspace').innerHTML = await httpRequest(url)
        intializePageJavascript()
    } catch (error) {
        console.log(error)
    }
}

let timer;

function intializePageJavascript() {
    let searchParams = new URLSearchParams(window.location.search)
    let startingFunction = routerTree[searchParams.get('r').trim()].startingFunction
    try {
        clearInterval(timer)
        timer = null;
        timer = setTimeout(() => window?.[startingFunction]?.(), 1000)
    }
    catch(e) {}
}

Object.freeze(routerTree)
