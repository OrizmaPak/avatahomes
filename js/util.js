
async function httpRequest(url, payload=null, button=null) {

    try {

        let result, res;

        if(button) { 
            button.disabled = true 
        }

        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'block' 
        }

        if(payload) {
            result = await fetch(url, {method:'POST', body: payload, headers: new Headers()})
            if(result) {
                res = await result.json()
            }
            else return notification('Unable to perform request.', 0)
        }
        else {
           result = await fetch(url)
           if(result) {
             res = await result.text() 
           }
           else return notification('Unable to perform request.', 0)
           
        }
        return res
    }
    catch(e) { 
        console.log(e)
    }
    finally {
        if(button) { 
            button.disabled = false 
        }
        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'none' 
        }
    }
 }

async function httpRequest2(url, payload=null, button=null, type="text") {

    try {

        let result, res;

        if(button) { 
            button.disabled = true 
        }

        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'block' 
        }

        if(payload) {
            console.log('payload', payload)
            result = await fetch(url, {method:'POST', body: payload, headers: new Headers()})
            if(result) {
                console.log('result', result)
                res = await result.json()
                payload.forEach(function(value, key) {
                    console.log(key + ": " + value);
                });
                console.log('response', res)
            }
            else return notification('Unable to perform request.', 0)
        }
        else {
           result = await fetch(url)
           if(result) {
             if(type != "json")res = await result.text() 
             if(type == "json")res = await result.json() 
                console.log('response', res)
           }
           else return notification('Unable to perform request.', 0)
           
        }
        return res
    }
    catch(e) { 
        console.log(e)
    }
    finally {
        if(button) { 
            button.disabled = false 
        }
        if(button?.querySelector('.btnloader')) { 
            button.querySelector('.btnloader').style.display = 'none' 
        }
    }
 }

function notification(message, type=undefined, timeout=5000) {

    let html;
    if(type === undefined) {
        html = `<span class="animate__animated animate__fadeInDown w-full md:w-[300px] lg:w-[400px] bg-white font-inter text-gray-900 font-medium text-2xs tracking-wide text-center p-3 first-letter:capitalize shadow-md border">${message}</span>`
    }
    else if(type === 0) {
        html = `<span class="animate__animated animate__fadeInDown w-full md:w-[300px] lg:w-[400px] bg-red-100 font-inter text-red-900 font-medium text-2xs tracking-wide text-center p-3 first-letter:capitalize">${message}</span>`
    }
    else if(type === 1) {
        html = `<span class="animate__animated animate__fadeInDown w-full md:w-[300px] lg:w-[400px] bg-green-100 font-inter text-green-900 font-medium text-2xs tracking-wide text-center p-3 first-letter:capitalize">${message}</span>`
    }

    let container = document.createElement('div')
    container.id = 'toast'
    container.innerHTML = html;
    container.classList.add('flex', 'items-center', 'w-full', 'top-0', 'justify-center', 'left-0', 'z-50', 'absolute', 'font-mont', 'px-2', 'py-2', 'lg:p-0')
    document.body.appendChild(container)

    setTimeout(() => document.getElementById('toast')?.remove(), timeout)
}

function openJModal(content) {
    let modal = document.querySelector('.modal-content')
    if(modal) {
        modal.parentElement.style.display = 'block'
        modal.innerHTML = `<div id="modal-actual-content">
            ${content}
            <div style="display:flex;align-items:end;justify-content:end;position:absolute;left-0;top:0;width:100%">
                <button id="jmodal-close" type="button" style="padding: 15px;font-weight:700px;font-size:medium;background-color:transparent;border:none;cursor:pointer;">&#10006;</button>
            </div>
        </div>`

        document.querySelector('button#jmodal-close').addEventListener('click', closeJmodal)
        
    }
}

function closeJmodal() {
    let modal = document.querySelector('.modal-content');
    modal.querySelector('#modal-actual-content').remove();
    modal.parentElement.style.display = 'none'
}

function controlHasValue(form, selector) {
    return form.querySelector(selector).value.length < 1
}

function mapValidationErrors(errorElements, controls) {

    errorElements.forEach( item => {
        item.previousElementSibling.style.borderColor = '';
        item.remove()
    })

    if(controls.length) {
        controls.map( item => {
            let errorElement = document.createElement('span')
            errorElement.classList.add('control-error','dom-entrance')
            let control = item[0] , mssg = item[1]
            errorElement.textContent = mssg;
            control.parentElement.appendChild(errorElement)            
        })
        return false
    }

    return true
}



const loadScript = function (resource) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src = resource.url;
        script.addEventListener('load', function () {
            intializePageJavascript()
            resolve(true);
        });
        document.body.appendChild(script);
    });
};

function getFormData(form) {
    let formdata = new FormData(form)
    return formdata
}

let paginationLimit = 20 
let filteredDataSource = []
let pageCount; 
let currentPage = 1; 
let prevRange; 
let currRange; 
let callback;
let datasource = []

function makePaginationMoveButton(type) {
    return `<button type="button" id="${type}-button" disabled>${type}</button>`
}

function initializePaginationMoveButtonsEventListeners() {

    const tableStatusWrap = document.querySelector('.table-status')
    
    tableStatusWrap.querySelector('#prev-button').addEventListener('click', () => {
        setCurrentPage(currentPage - 1); 
    })

    tableStatusWrap.querySelector('#next-button').addEventListener('click', () => {
        setCurrentPage(currentPage + 1); 
    })

    tableStatusWrap.querySelector('#pagination-limit').addEventListener('change', limitChange)

    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));         
        if (pageIndex)  button.addEventListener("click", () => {
            setCurrentPage(pageIndex); 
        });
    });

}

function limitChange() {
    el = document.querySelector('#pagination-limit')
    paginationLimit = +(el.options[el.selectedIndex].value)
    setCurrentPage(1)
}

const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage)  button.classList.add("active")
    });
};

const handlePageButtonsStatus = () => {
    const tableStatusWrap = document.querySelector('.table-status')
    if (currentPage === 1)  disableButton(tableStatusWrap.querySelector('#prev-button'));
    else  enableButton(tableStatusWrap.querySelector('#prev-button'))
    if (pageCount === currentPage) disableButton(tableStatusWrap.querySelector('#next-button'))  
    else enableButton(tableStatusWrap.querySelector('#next-button')) 
 };

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

function getSignaledDatasource() {
    return JSON.parse(sessionStorage.getItem('datasource'))
}

function getSignaledPaginationStatus() {
    return sessionStorage.getItem('p-status')
}

function getSignaledPaginationNumbers() {
    return sessionStorage.getItem('p-numbers')
}

async function getPaginationNumbers (){
    let str = ''
    pageCount = Math.ceil(datasource.length / paginationLimit);
    for (let i = 1; i <= pageCount; i++) {
      str += `<button class="pagination-number" type="button" aria-label="Page ${i}" page-index="${i}">${i}</button>`;
    }
    return str
};

function addPaginationStatus() {

    template = `
        ${getSignaledPaginationStatus()}
        <span class=" flex justify-between gap-6">
            <span>
                <select id="pagination-limit" class="form-control !bg-white cursor-pointer">
                    <option value="" selected="true">20</option>
                    <option value="20" >20</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                    <option value="70">70</option>
                    <option value="100">100</option>
                    <option value="150">150</option>
                    <option value="200">200</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                    <option value="750">750</option>
                    <option value="1000">1000</option>
                    <option value="1500">1500</option>
                </select>
            </span>
            <span class="flex pagination">
                ${ makePaginationMoveButton('prev') }
                ${ getSignaledPaginationNumbers() }
                ${ makePaginationMoveButton('next') }
            </span>
        </span>
    `
    document.querySelector('.table-status').innerHTML = template
}

function resolvePagination(data, cb) {
    datasource = data;
    setCurrentPage(1)
    callback = cb
 }
 
 
 function setCurrentPage(pageNum) {
    if(document.querySelector('#tabledata'))document.querySelector('#tabledata').innerHTML = `
        <tr>
            <td colspan="100%" class="text-center opacity-70">
                <span class="loader mx-auto"></span>
            </td>
        </tr` 
        else return
    currentPage = pageNum;
    prevRange = (pageNum - 1) * paginationLimit;
    currRange = pageNum * paginationLimit;
    if (datasource.length) {
        filteredDataSource = []
        for(let i=0; i<datasource.length; i++) {
            if (i >= prevRange && i < currRange) {
                filteredDataSource.push({index: i, ...datasource[i]})
            }
        }
        sendStorageSignal(filteredDataSource)
    }
}

async function sendStorageSignal(filteredDataSource) {
    sessionStorage.setItem('datasource', JSON.stringify(filteredDataSource))
    let itemsAvailable = getSignaledDatasource().length;

    let status = `<span class="text-xs text-gray-500">Showing ${ prevRange + 1 }  to ${ itemsAvailable >= currRange * currRange ? (-prevRange + currRange ) + itemsAvailable : itemsAvailable + prevRange} of ${ datasource.length } Records </span> `

    let pageNumbers = await getPaginationNumbers()
    let pageNumberTemplate = `<span id="pagination-numbers"> ${pageNumbers} </span>`

    sessionStorage.setItem('p-status', status)
    sessionStorage.setItem('p-numbers', pageNumberTemplate)
    callback()
}


function injectPaginatatedTable(rows) {
    document.querySelector('#tabledata').innerHTML = rows
    addPaginationStatus()
    handleActivePageNumber();
    handlePageButtonsStatus()
    initializePaginationMoveButtonsEventListeners()
    sessionStorage.clear()
}

function logoff() {
    let request = httpRequest('')
    location.href = './login'
} 


function elementWithId(element){
    if(document.getElementById(element)) return document.getElementById(element)
}

if (typeof window.did !== 'function') {
    window.did = function (id) {
        return document.getElementById(id);
    };
}

if (typeof window.getIdFromCls !== 'function') {
    window.getIdFromCls = function (cls, scope = null) {
        let root = scope;
        if (typeof scope === 'string') root = document.getElementById(scope);
        if (!root) root = document;
        const ids = [];
        const elements = root.getElementsByClassName(cls);
        for (let i = 0; i < elements.length; i++) ids.push(elements[i].id);
        return ids;
    };
}

if (typeof window.genID !== 'function') {
    window.genID = function () {
        const timestamp = new Date().getTime();
        const randomPart = Math.floor(Math.random() * 1000);
        return `${timestamp}${randomPart}`;
    };
}

if (typeof window.checkdatalist !== 'function') {
    window.checkdatalist = function () { return true; };
}
 
if (typeof window.formatCurrency !== 'function') {
    window.formatCurrency = function (amount) {
        const formatter = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }); 
        return formatter.format(amount || 0);
    };
}

if (typeof window.getFormData2 !== 'function') {
    window.getFormData2 = function (form = null, additional = []) {
        const formdata = new FormData(form);
        if (additional && Array.isArray(additional)) {
            for (let i = 0; i < additional.length; i++) {
                formdata.set(`${additional[i][0]}`, additional[i][1]);
            }
        }
        return formdata;
    };
}

if (typeof window.validateForm !== 'function') {
    window.validateForm = function (formId, ids = null) {
        const form = document.getElementById(formId);
        if (!form) return false;
        const errorElements = form.querySelectorAll('.control-error');
        const controls = [];
        if (ids && Array.isArray(ids)) {
            for (let i = 0; i < ids.length; i++) {
                const el = form.querySelector(`#${ids[i]}`);
                if (!el) continue;
                if (el.disabled || el.offsetParent === null) continue;
                if (controlHasValue(form, `#${ids[i]}`)) {
                    const label = el.previousElementSibling?.textContent || ids[i];
                    controls.push([el, `${label} is required`]);
                }
            }
        }
        return mapValidationErrors(errorElements, controls);
    };
}

if (typeof window.populateData !== 'function') {
    window.populateData = function (data, img = [], locate = [], form = '') {
        if (!data || typeof data !== 'object') return;
        const keys = Object.keys(data);
        keys.forEach((key) => {
            const value = data[key];
            let inputElement = null;
            if (form) {
                const formElement = document.getElementById(form);
                inputElement = formElement ? formElement.querySelector(`[name="${key}"]`) : null;
            } else {
                inputElement = document.getElementsByName(key)?.[0] || document.getElementById(key);
            }
            if (!inputElement) return;
            if (inputElement.getAttribute('type') !== 'file') {
                inputElement.value = value ?? '';
            }
        });
    };
}

if (typeof window.getallid !== 'function') {
    window.getallid = function (cls) {
        const ids = [];
        const elements = document.getElementsByClassName(cls);
        for (let i = 0; i < elements.length; i++) {
            ids.push(elements[i].id);
        }
        return ids;
    };
}

if (typeof window.randomId !== 'function') {
    window.randomId = function () {
        const timestamp = new Date().getTime();
        return Math.floor(timestamp % Number.MAX_SAFE_INTEGER);
    };
}
