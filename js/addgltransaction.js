let addgltransactionid
let totalcreditnumber
let totaldebitnumber
let glTransactionAccounts = []
const temporaryGlAutoPostAccounts = [
    { accountnumber: '99348346', description: 'ABM GLOBAL GROUP LIMITED ( A.B.M)' },
    { accountnumber: '99500307', description: 'ABSENT & LATENESS (CONTROL)' },
    { accountnumber: '99241072', description: 'ACCOMODATION' },
    { accountnumber: '99459491', description: 'ADMINISTRATIVE EXPENSES' },
    { accountnumber: '99360093', description: 'ADVERTISEMENT EXPENSES' },
    { accountnumber: '99485450', description: 'APEXX BIZZ TECH' },
    { accountnumber: '99506083', description: 'AUDITING FEES' },
    { accountnumber: '99786677', description: 'BANK CHARGE & COMMISSION' },
    { accountnumber: '99385988', description: 'BANK TRANSFER (FCMB)' },
    { accountnumber: '99707217', description: 'BANK TRANSFER (MONIEPOINT)' },
    { accountnumber: '99912850', description: 'BANK TRANSFER (PROVIDUS BANK)' },
    { accountnumber: '99569880', description: 'BANK TRANSFER MOREMONEE' },
    { accountnumber: '99488127', description: 'BEVERAGE - COST OF SALES' },
    { accountnumber: '99739293', description: 'BEVERAGE STOCK' },
    { accountnumber: '99907004', description: 'BOARD MANAGEMENT COMMITTE FEE' },
    { accountnumber: '99399207', description: 'BOOKING COMMISSION PAYABLES' },
    { accountnumber: '99694660', description: 'CAR HIRE / AIRPORT TAXI' },
    { accountnumber: '99979225', description: 'CARITIAS NIGERIA' },
    { accountnumber: '99777501', description: 'CATHOLIC RELIEF SERVICES 2024' },
    { accountnumber: '99874501', description: 'CHAIRMAN (PAYABLES)' },
    { accountnumber: '99744628', description: 'CHAIRMAN CURRENT A/C2' },
    { accountnumber: '99580565', description: 'CHAIRMAN CURRENT AC' },
    { accountnumber: '99716612', description: 'CHAIRMAN GRAVITY' },
    { accountnumber: '99410313', description: 'CHIAWUOTU & SONS FARM' },
    { accountnumber: '99244204', description: 'CLEANING EXPENSES' },
    { accountnumber: '99587514', description: 'CLEARNING MATERIAL STOCK' },
    { accountnumber: '99562108', description: 'CLON SERVICES NIG.' },
    { accountnumber: '99917350', description: 'COCKTAIL BAR FOOD REVENUE' },
    { accountnumber: '99508074', description: 'COMMISION INCOME' },
    { accountnumber: '99541582', description: 'COMP EQUIP ACCUMULATED DEP.' }
]
async function addgltransactionActive() {
    const form = document.querySelector('#addgltransactionform')
    if(form.querySelector('#submit')) form.querySelector('#submit').addEventListener('click', addgltransactionFormSubmitHandler)
    if(form.querySelector('#reset')) form.querySelector('#reset').addEventListener('click', addgltransactionFormResetHandler)
    if(form.querySelector('#autopost10')) form.querySelector('#autopost10').addEventListener('click', autoPostTemporaryGlTransactions)
    datasource = []
    await fetchaddgltransaction()
    totalcreditnumber = 0
    totaldebitnumber = 0
}


function gltaddcreditrow(){ 
    let id = window.genID()
    let element = document.createElement('div')
    element.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')
    element.setAttribute('id', `creditcontainer_${id}`)
    let x = `<div class="form-group">
                    <label for="logoname" class="control-label">Credit Account</label>
                    <input type="text" list="glaccountlist"  onchange="checkdatalist(this)" name="gltcreditaccount" id="creditaccount_${id}" class="form-control comp" placeholder="Enter Credit Account">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Amount</label>
                    <input type="number" name="gltcreditamount" id="creditamount_${id}" onchange="allcreditamount()" class="form-control comp" placeholder="Enter Amount">
                </div>
                <div id="deletecredit_${id}" onclick="deletecreditglt(${id})" class="form-group flex flex-row cp items-end">
                    <div title="Add row" onclick="" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-red-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">delete</div>
                    <div class="mb-3 text-xs text-red-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Delete</p></div>
                </div>`
    element.innerHTML = x
    window.did('gltcreditcontainer').appendChild(element)
}

function deletecreditglt(id){
    window.did(`creditcontainer_${id}`).remove()
}

function gltadddebitrow(){
    let id = window.genID()
    let element = document.createElement('div')
    element.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-6')
    element.setAttribute('id', `debitcontainer_${id}`)
    let x = `<div class="form-group">
                    <label for="logoname" class="control-label">Debit Account</label>
                    <input type="text" list="glaccountlist"  onchange="checkdatalist(this)" name="gltdebitaccount" id="debitaccount_${id}" class="comp form-control" placeholder="Enter Debit Account">
                </div>
                <div class="form-group">
                    <label for="logoname" class="control-label">Amount</label>
                    <input type="number" name="gltdebitamount" id="debitamount_${id}" onchange="alldebitamount()" class="comp form-control" placeholder="Enter Amount">
                </div>
                <div id="deletedebit_${id}" onclick="deletedebitglt(${id})" class="form-group flex flex-row cp items-end">
                    <div title="Add row" onclick="" onmouseover="this.nextElementSibling.classList.add('!w-[100px]');" onmouseleave="this.nextElementSibling.classList.remove('!w-[100px]');" class="mb-1 material-symbols-outlined rounded-full bg-red-700 h-8 w-8 text-white drop-shadow-md text-xs flex justify-center items-center" style="font-size: 18px;">delete</div>
                    <div class="mb-3 text-xs text-red-600 w-[0px] overflow-hidden trasition-all duration-[0.3s] h-[3]"><p class="px-1 w-[100px]">Click&nbsp;to&nbsp; Delete</p></div>
                </div>`
    element.innerHTML = x
    window.did('gltdebitcontainer').appendChild(element)
}

function deletedebitglt(id){
    window.did(`debitcontainer_${id}`).remove()
}
	const alldebitamount=()=>{
	        let count = 0
	    for(let i=0; i<document.getElementsByName('gltdebitamount').length; i++){ 
	       // console.log(document.getElementsByName('gltdebitamount')[i].value, 'i', i); 
	        count = count + parseInt(document.getElementsByName('gltdebitamount')[i].value ? document.getElementsByName('gltdebitamount')[i].value : 0);
	   // alert(count)
	    }
	        document.getElementById('glttotaldebit').value = window.formatCurrency(count); 
	        totaldebitnumber = count 
	}
	
	const allcreditamount=()=>{
	        let count = 0
	    for(let i=0; i<document.getElementsByName('gltcreditamount').length; i++){
	       // console.log(document.getElementsByName('gltcreditamount')[i].value, 'i', i);
	        count = count + parseInt(document.getElementsByName('gltcreditamount')[i].value ? document.getElementsByName('gltcreditamount')[i].value : 0);
	   // alert(count)
	    }
	        document.getElementById('glttotalcredit').value = window.formatCurrency(count);
	        totalcreditnumber = count
	}


async function fetchaddgltransaction(id='') {
    // scrollToTop('scrolldiv')
    function getparamm(){
        let paramstr = new FormData()
        paramstr.append('id', id)
        return paramstr
    }
    let request = await httpRequest2('../controllers/fetchglaccounts', id ? getparamm() : null, null, 'json')
    // if(!id)document.getElementById('tabledata').innerHTML = `No records retrieved`
    if(request.status) {
        glTransactionAccounts = getGlTransactionAccountRows(request)
        renderGlTransactionAccountList()
    }
    else return notification('No records retrieved')
}

function getGlTransactionAccountRows(request) {
    const candidates = [
        request?.data?.data?.data,
        request?.data?.data,
        request?.data
    ]
    const rows = candidates.find(item => Array.isArray(item)) || []
    return rows.filter(account => account?.accountnumber)
}

function renderGlTransactionAccountList() {
    const datalist = window.did('glaccountlist')
    if (!datalist) return
    datalist.innerHTML = ''
    glTransactionAccounts.forEach(account => {
        const option = document.createElement('option')
        option.value = buildGlAccountLabel(account)
        datalist.appendChild(option)
    })
}

async function removeaddgltransaction(id) {
    // Ask for confirmation
    const confirmed = window.confirm("Are you sure you want to remove this addgltransaction?");

    // If not confirmed, do nothing
    if (!confirmed) {
        return;
    }

    function getparamm() {
        let paramstr = new FormData();
        paramstr.append('id', id);
        return paramstr;
    }

    let request = await httpRequest2('../controllers/removevisacountries', id ? getparamm() : null, null, 'json');
    
    // Show notification based on the result
    fetchaddgltransaction()
    return notification(request.message);
    
}


async function onaddgltransactionTableDataSignal() {
    let rows = getSignaledDatasource().map((item, index) => `
    <tr>
        <td>${item.index + 1 }</td>
        <td>${item.productname}</td>
        <td>${item.productdescription}</td>
        <td class="flex items-center gap-3">
            <button title="Edit row entry" onclick="fetchaddgltransaction('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>
            <button title="Delete row entry"s onclick="removeaddgltransaction('${item.id}')" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>
        </td>
    </tr>`
    )
    .join('')
    injectPaginatatedTable(rows)
}

function addgltransactionFormResetHandler() {
    document.querySelector('#addgltransactionform').reset();
    window.did('gltdebitcontainer').innerHTML = ''
    window.did('gltcreditcontainer').innerHTML = ''
    totalcreditnumber = 0
    totaldebitnumber = 0
    document.getElementById('glttotalcredit').value = ''
    document.getElementById('glttotaldebit').value = ''
}

function buildAddGlTransactionPayload() {
    let paramstr = new FormData()
    paramstr.append('description',document.getElementById('description').value);
    paramstr.append('transactiondate',document.getElementById('transactiondate').value);
    
    for(let i=0; i<document.getElementsByName('gltdebitamount').length; i++){
        paramstr.append(`debitaccount${i}`,getGlAccountNumberFromValue(document.getElementsByName('gltdebitaccount')[i].value));
        paramstr.append(`debitamount${i}`,document.getElementsByName('gltdebitamount')[i].value);
    }
    paramstr.append('debitgridsize',document.getElementsByName('gltdebitamount').length);
    
    for(let i=0; i<document.getElementsByName('gltcreditamount').length; i++){
        paramstr.append(`creditaccount${i}`,getGlAccountNumberFromValue(document.getElementsByName('gltcreditaccount')[i].value));
        paramstr.append(`creditamount${i}`,document.getElementsByName('gltcreditamount')[i].value);
    }
    paramstr.append('creditgridsize',document.getElementsByName('gltcreditamount').length);
    
    paramstr.append('debittotal',totaldebitnumber);
    paramstr.append('credittotal',totalcreditnumber);
    return paramstr
}

function getGlAccountNumberFromValue(value) {
    const normalizedValue = `${value || ''}`.trim()
    if (!normalizedValue.includes('__')) return normalizedValue
    return normalizedValue.split('__').pop().trim()
}

function getTodayInputDateValue() {
    const today = new Date()
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    return localDate.toISOString().slice(0, 10)
}

function setBaseGlTransactionFormValues(description, amount, creditAccountLabel, debitAccountLabel) {
    addgltransactionFormResetHandler()
    document.getElementById('transactiondate').value = getTodayInputDateValue()
    document.getElementById('description').value = description
    document.getElementById('creditaccount_0').value = creditAccountLabel
    document.getElementById('debitaccount_0').value = debitAccountLabel
    document.getElementById('creditamount_0').value = amount
    document.getElementById('debitamount_0').value = amount
    allcreditamount()
    alldebitamount()
}

function getRandomGlTransactionAccounts() {
    if (!Array.isArray(glTransactionAccounts) || glTransactionAccounts.length < 2) return null
    const firstIndex = Math.floor(Math.random() * glTransactionAccounts.length)
    let secondIndex = Math.floor(Math.random() * glTransactionAccounts.length)
    while (secondIndex === firstIndex) {
        secondIndex = Math.floor(Math.random() * glTransactionAccounts.length)
    }
    return [glTransactionAccounts[firstIndex], glTransactionAccounts[secondIndex]]
}

function buildGlAccountLabel(account) {
    return `${account.description} __${account.accountnumber}`
}

function getRandomGlTransactionAmount() {
    return (Math.floor(Math.random() * 90) + 10) * 100
}

function getTemporaryGlAutoPostPool() {
    return temporaryGlAutoPostAccounts.filter(account => account.accountnumber)
}

function shuffleGlAccounts(accounts) {
    const shuffledAccounts = [...accounts]
    for (let i = shuffledAccounts.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const currentAccount = shuffledAccounts[i]
        shuffledAccounts[i] = shuffledAccounts[randomIndex]
        shuffledAccounts[randomIndex] = currentAccount
    }
    return shuffledAccounts
}

function buildTemporaryGlAutoPostRuns(count = 10) {
    const accountPool = shuffleGlAccounts(getTemporaryGlAutoPostPool())
    const runs = []

    for (let i = 0; i < count; i++) {
        const debitAccount = accountPool[(i * 2) % accountPool.length]
        let creditAccount = accountPool[(i * 2 + 1) % accountPool.length]
        if (creditAccount.accountnumber === debitAccount.accountnumber) {
            creditAccount = accountPool[(i * 2 + 2) % accountPool.length]
        }
        runs.push({
            debitAccount,
            creditAccount,
            amount: getRandomGlTransactionAmount(),
            description: `TEMP AUTO GL POST ${i + 1}`
        })
    }

    return runs
}

function buildTemporaryGlAutoPostPayload(run) {
    const payload = new FormData()
    payload.append('description', run.description)
    payload.append('transactiondate', getTodayInputDateValue())
    payload.append('debitaccount0', run.debitAccount.accountnumber)
    payload.append('debitamount0', run.amount)
    payload.append('debitgridsize', 1)
    payload.append('creditaccount0', run.creditAccount.accountnumber)
    payload.append('creditamount0', run.amount)
    payload.append('creditgridsize', 1)
    payload.append('debittotal', run.amount)
    payload.append('credittotal', run.amount)
    return payload
}

function isSuccessfulGlTransactionResponse(request) {
    return request?.status === true && Number(request?.code || 200) === 200
}

async function submitAddGlTransaction(button = null, shouldReload = true) {
    const form = document.getElementById('addgltransactionform')
    if(!form) return { status: false, message: 'Form not found' }
    const requiredIds = typeof window.getIdFromCls === 'function'
        ? window.getIdFromCls('comp', form)
        : Array.from(form.querySelectorAll('.comp')).map(el => el.id).filter(Boolean)
    if(!window.validateForm('addgltransactionform', requiredIds)) return { status: false, message: 'Please fill all required fields' }
    if(totaldebitnumber == 0) return { status: false, message: 'Total Debit cannot be Zero' }
    if(totalcreditnumber == 0) return { status: false, message: 'Total Credit cannot be Zero' }
    if(totaldebitnumber !== totalcreditnumber) return { status: false, message: 'Total Credit and Debit do not balance out' }

    let request = await httpRequest2('../controllers/gltransactionscript', buildAddGlTransactionPayload(), button)
    if(request?.status) {
        notification('Record saved successfully!', 1);
        if(shouldReload) {
            const navigationItem = document.getElementById('addgltransaction')
            if(navigationItem) {
                navigationItem.click()
                return request
            }
            addgltransactionFormResetHandler()
        }
        return request
    }
    notification(request?.message || 'Unable to save record', 0)
    return request || { status: false, message: 'Unable to save record' }
}
  
async function addgltransactionFormSubmitHandler() {
    return submitAddGlTransaction(document.querySelector('#addgltransactionform #submit'), true)
}

async function autoPostTemporaryGlTransactions() {
    const triggerButton = document.querySelector('#addgltransactionform #autopost10')
    if (triggerButton) triggerButton.disabled = true

    try {
        const accountPool = getTemporaryGlAutoPostPool()
        if (accountPool.length < 2) {
            notification('At least two GL accounts are required for auto posting', 0)
            return
        }

        const runs = buildTemporaryGlAutoPostRuns(10)
        let successCount = 0
        for (let attempt = 0; attempt < runs.length; attempt++) {
            const run = runs[attempt]
            setBaseGlTransactionFormValues(
                run.description,
                run.amount,
                buildGlAccountLabel(run.creditAccount),
                buildGlAccountLabel(run.debitAccount)
            )

            const request = await httpRequest2('../controllers/gltransactionscript', buildTemporaryGlAutoPostPayload(run), null)
            if (isSuccessfulGlTransactionResponse(request)) {
                successCount += 1
                await new Promise(resolve => setTimeout(resolve, 250))
                continue
            }

            notification(request?.message || `Auto posting stopped at run ${attempt + 1}`, 0)
            break
        }

        addgltransactionFormResetHandler()
        notification(`Temporary auto posting completed: ${successCount}/10`, successCount === 10 ? 1 : 0)
    } finally {
        if (triggerButton) triggerButton.disabled = false
    }
}


// function runAdaddgltransactionFormValidations() {
//     let form = document.getElementById('addgltransactionform')
//     let errorElements = form.querySelectorAll('.control-error')
//     let controls = []

//     if(controlHasValue(form, '#owner'))  controls.push([form.querySelector('#owner'), 'Select an owner'])
//     if(controlHasValue(form, '#addgltransactionname'))  controls.push([form.querySelector('#addgltransactionname'), 'addgltransaction name is required'])
//     if(controlHasValue(form, '#statusme'))  controls.push([form.querySelector('#itemname'), 'item name is required'])
//     if(controlHasValue(form, '#urlge'))  controls.push([form.querySelector('#image'), 'image is required'])
//     if(controlHasValue(form, '#urlition'))  controls.push([form.querySelector('#position'), 'position is required'])
//     if(controlHasValue(form, '#url'))  controls.push([form.querySelector('#url'), 'url is required'])
//     parentidurl
//     return mapValidationErrors(errorElements, controls)   

// }
