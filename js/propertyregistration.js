let propertyregistrationid
let propertyfees = []
const APPLY_PERCENTAGE_GROUP = 'property-registration-apply-percent'
const PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION = 'NOT APPLICABLE'

function getAddRowButton() {
    return document.getElementById('propertyregistrationaddrow')
}

function setAddRowButtonLoading(isLoading) {
    const button = getAddRowButton()
    if (!button) return
    if (isLoading) {
        button.dataset.ready = '' 
        button.setAttribute('aria-busy', 'true')
        button.textContent = '...' 
        button.style.pointerEvents = 'none'
        button.style.opacity = '0.6'
    } else {
        button.dataset.ready = '1' 
        button.removeAttribute('aria-busy')
        button.textContent = '+' 
        button.style.pointerEvents = 'auto'
        button.style.opacity = '1'
    }
}

function isAddRowButtonReady() {
    const button = getAddRowButton()
    return !!(button && button.dataset.ready === '1')
} 

function getPropertyDurationOptionsMarkup(selectedValue = '') {
    const options = [
        { value: '', label: 'Select payment period' },
        { value: PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION, label: 'Not Applicable' },
        { value: '1', label: '1 Month' },
        { value: '2', label: '2 Months' },
        { value: '3', label: '3 Months' },
        { value: '4', label: '4 Months' },
        { value: '5', label: '5 Months' },
        { value: '6', label: '6 Months' },
        { value: '7', label: '7 Months' },
        { value: '8', label: '8 Months' },
        { value: '9', label: '9 Months' },
        { value: '10', label: '10 Months' },
        { value: '11', label: '11 Months' },
        { value: '12', label: '12 Months' },
        { value: '18', label: '18 Months' },
        { value: '24', label: '24 Months' },
        { value: '30', label: '30 Months' },
        { value: '36', label: '36 Months' },
        { value: '48', label: '48 Months' },
        { value: '60', label: '60 Months' }
    ]
    return options.map(option => `<option value="${option.value}" ${String(selectedValue) === option.value ? 'selected' : ''}>${option.label}</option>`).join('')
}
 
async function propertyregistrationActive() {
    const form = document.querySelector('#propertyregistrationform')
    const idInput = document.getElementById('id')
    if (!form || !idInput) return
    if (form?.querySelector('#submit')) {
        form.querySelector('#submit').addEventListener('click', propertyregistrationsubmit)
    }

    const addRowButton = getAddRowButton()
    if (addRowButton) {
        if (!addRowButton.dataset.bound) {
            addRowButton.addEventListener('click', () => {
                if (!isAddRowButtonReady()) return
                if (!propertyfees.length) {
                    return notification('No fees found please go to settings and add fees', 0)
                }
                addPropertyRegistrationRow()
            })
            addRowButton.dataset.bound = '1'
        }
        setAddRowButtonLoading(true)
    }

    try {
        propertyfees = await fetchpropertyfees()
        if (!Array.isArray(propertyfees)) {
            propertyfees = []
        }
    } finally {
        setAddRowButtonLoading(false)
    }

    idInput.value = ''
    clearPropertyRegistrationTable()

    if (propertyregistrationid) {
        idInput.value = propertyregistrationid
        function payloadd() {
            let params = new FormData()
            params.append('id', propertyregistrationid)
            return params
        }
        let request = await httpRequest2('../controllers/fetchproperty', payloadd())
        if (request.status) {
            if (request.data.length) {
                populateData(request.data[0].property)
                const units = request.data[0].propertyunits || []
                units.forEach((unit) => {
                    addPropertyRegistrationRow({
                        unitName: unit.unitname ?? '',
                        feeId: unit.feenameid ? String(unit.feenameid) : '',
                        amount: unit.amount ?? unit.rent ?? '',
                        rentalPeriod: unit.rentalperiod ?? '',
                        unitId: unit.id
                    })
                })
                ensureDefaultFlatSelection()
                recalculatePercentageRows()
            }
        } else {
            return notification(request.message, 0)
        }
        propertyregistrationid = ''
    }
}

function clearPropertyRegistrationTable() {
    const tbody = document.getElementById('propertyregistrationtable')
    if (!tbody) return
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
    }
}

function addPropertyRegistrationRow(prefill = {}) {
    const tbody = document.getElementById('propertyregistrationtable')
    if (!tbody) return null

    const id = prefill.rowId || randomId()
    const tr = document.createElement('tr')
    tr.id = id
    tr.dataset.feeMode = ''
    tr.dataset.percentageRate = ''
    tr.innerHTML = `
        <td>
            <div class="form-group">
                <p class="hidden">Unit Name</p>
                <input type="text" id="un-${id}" class="form-control propertyregistrationverify" placeholder="Enter Unit Name">
            </div>
        </td>
        <td>
            <div class="form-group">
                <p class="hidden">Fee Name</p>
                <select id="fe-${id}" class="form-control propertyregistrationverify"></select>
            </div>
        </td> 
        <td>
            <span id="mo-${id}" class="font-semibold uppercase"></span>
        </td>
        <td>
            <div class="form-group">
                <p class="hidden">Amount</p>
                <input type="number" id="ar-${id}" class="form-control propertyregistrationverify" placeholder="Enter Amount">
                <input type="hidden" id="uid-${id}">
            </div>
        </td>
        <td>\n            <div class="form-group w-[140px]">
                <p class="hidden">payment period (months)</p>
                <select title="Select payment period in months or Not Applicable" id="rp-${id}" class="form-control propertyregistrationverify">${getPropertyDurationOptionsMarkup(prefill.rentalPeriod ?? '')}</select>
            </div>
        </td> 
        <td class="text-center hidden" id="ap-${id}"></td>
        <td>
            <div data-action="remove-row" style="padding: 10px 20px;border-radius: 10px;background: red;width: fit-content; height: fit-content;font-size: larger; color: white;font-weight: bold">-</div>
        </td>
    `

    tbody.appendChild(tr)

    const controls = getRowControls(id)
    if (!controls.row) return tr

    controls.unit.value = prefill.unitName ?? ''
    controls.unitId.value = prefill.unitId ?? ''
    controls.rental.value = prefill.rentalPeriod ?? ''

    setupRentalPeriodControl(controls.rental)
    populateFeeSelect(controls.feeSelect, prefill.feeId ? String(prefill.feeId) : '')

    controls.feeSelect.addEventListener('change', () => handleFeeChange(id))
    const amountInstantHandler = () => handleAmountInput(id)
    controls.amount.addEventListener('input', amountInstantHandler)
    controls.amount.addEventListener('keyup', amountInstantHandler)
    controls.amount.addEventListener('change', amountInstantHandler)
    controls.removeButton.addEventListener('click', () => removePropertyRegistrationRow(id))

    handleFeeChange(id, {
        isInitialLoad: true,
        initialAmount: prefill.amount,
        autoSelectSource: prefill.autoSelectSource === true
    })

    return tr
}

function setupRentalPeriodControl(input) {
    if (!input) return
    input.setAttribute('title', 'Select payment period in months or Not Applicable')
}

function populateFeeSelect(select, selectedValue = '') {
    if (!select) return
    const options = ['<option value="">Select fee</option>']
    propertyfees.forEach((fee) => {
        options.push(`<option value="${fee.id}">${fee.feename}</option>`)
    })
    select.innerHTML = options.join('')
    if (selectedValue) {
        select.value = selectedValue
    }
}

function getRowControls(rowId) {
    const row = document.getElementById(rowId)
    if (!row) return {}
    return {
        row,
        unit: document.getElementById(`un-${rowId}`),
        feeSelect: document.getElementById(`fe-${rowId}`),
        modeDisplay: document.getElementById(`mo-${rowId}`),
        amount: document.getElementById(`ar-${rowId}`),
        rental: document.getElementById(`rp-${rowId}`),
        unitId: document.getElementById(`uid-${rowId}`),
        applyCell: document.getElementById(`ap-${rowId}`),
        removeButton: row.querySelector('[data-action="remove-row"]')
    }
}

function handleFeeChange(rowId, options = {}) {
    const controls = getRowControls(rowId)
    if (!controls.row || !controls.feeSelect) return

    const existingCheckedRadio = document.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]:checked`)
    const previousRadioChecked = controls.applyCell?.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]`)?.checked || false

    const {
        initialAmount = null,
        isInitialLoad = false,
        autoSelectSource = false
    } = options

    if (!isInitialLoad && controls.unitId) {
        controls.unitId.value = ''
    }

    controls.row.dataset.feeMode = ''
    controls.row.dataset.percentageRate = ''
    if (controls.modeDisplay) controls.modeDisplay.textContent = ''
    if (controls.amount) {
        controls.amount.value = ''
        controls.amount.readOnly = false
    }
    if (controls.applyCell) {
        controls.applyCell.innerHTML = ''
    }

    const feeId = controls.feeSelect.value
    if (!feeId) {
        ensureDefaultFlatSelection()
        recalculatePercentageRows()
        return
    }

    const fee = propertyfees.find((item) => String(item.id) === feeId)
    if (!fee) {
        ensureDefaultFlatSelection()
        recalculatePercentageRows()
        return
    }

    const feeMode = (fee.mode || '').toUpperCase()
    controls.row.dataset.feeMode = feeMode

    if (feeMode === 'FLAT') {
        if (controls.modeDisplay) {
            controls.modeDisplay.textContent = 'FLAT'
        }
        if (controls.amount) {
            const defaultAmount = parseFloat(fee.amount)
            if (initialAmount !== null && initialAmount !== undefined && initialAmount !== '') {
                controls.amount.value = initialAmount
            } else if (!Number.isNaN(defaultAmount)) {
                controls.amount.value = defaultAmount
            } else {
                controls.amount.value = ''
            }
            controls.amount.readOnly = false
        }

        let shouldCheck = previousRadioChecked
        if (autoSelectSource) {
            shouldCheck = true
        } else if (!existingCheckedRadio) {
            shouldCheck = true
        }

        const radio = renderApplyRadio(rowId, controls.applyCell, shouldCheck)
        if (radio) {
            radio.addEventListener('change', () => recalculatePercentageRows())
        }
    } else if (feeMode === 'PERCENTAGE') {
        const rate = parseFloat(fee.amount)
        controls.row.dataset.percentageRate = Number.isFinite(rate) ? rate : ''
        if (controls.modeDisplay) {
            controls.modeDisplay.textContent = Number.isFinite(rate) ? `${rate}%` : 'PERCENTAGE'
        }
        if (controls.amount) {
            controls.amount.value = ''
            controls.amount.readOnly = true
        }
    } else {
        if (controls.modeDisplay) {
            controls.modeDisplay.textContent = fee.mode || ''
        }
    }

    ensureDefaultFlatSelection()
    recalculatePercentageRows()
}

function renderApplyRadio(rowId, cell, checked) {
    if (!cell) return null
    cell.innerHTML = ''
    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = APPLY_PERCENTAGE_GROUP
    radio.value = rowId
    radio.title = 'Use this amount for percentage calculations'
    if (checked) {
        radio.checked = true
    }
    cell.appendChild(radio)
    return radio
}

function ensureDefaultFlatSelection() {
    const checked = document.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]:checked`)
    if (checked) return
    const tbody = document.getElementById('propertyregistrationtable')
    if (!tbody) return
    const rows = Array.from(tbody.children)
    for (const row of rows) {
        if ((row.dataset.feeMode || '').toUpperCase() === 'FLAT') {
            const radio = row.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]`)
            if (radio) {
                radio.checked = true
                break
            }
        }
    }
}

function handleAmountInput(rowId) {
    const controls = getRowControls(rowId)
    if (!controls.row || !controls.amount) return
    if ((controls.row.dataset.feeMode || '').toUpperCase() !== 'FLAT') return
    const selectedRadio = document.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]:checked`)
    if (selectedRadio && selectedRadio.value === rowId) {
        recalculatePercentageRows()
    }
}

function recalculatePercentageRows() {
    const tbody = document.getElementById('propertyregistrationtable')
    if (!tbody) return
    const checkedRadio = document.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]:checked`)
    let baseAmount = null
    if (checkedRadio) {
        const baseAmountInput = document.getElementById(`ar-${checkedRadio.value}`)
        if (baseAmountInput) {
            const parsed = parseFloat(baseAmountInput.value)
            if (!Number.isNaN(parsed)) {
                baseAmount = parsed
            }
        }
    }

    const rows = Array.from(tbody.children)
    rows.forEach((row) => {
        if ((row.dataset.feeMode || '').toUpperCase() === 'PERCENTAGE') {
            const amountInput = document.getElementById(`ar-${row.id}`)
            if (!amountInput) return
            const rate = parseFloat(row.dataset.percentageRate || '')
            if (baseAmount !== null && Number.isFinite(rate)) {
                const computed = (baseAmount * rate) / 100
                amountInput.value = Number.isFinite(computed) ? parseFloat(computed.toFixed(2)).toString() : ''
            } else {
                amountInput.value = ''
            }
        }
    })
}

function removePropertyRegistrationRow(rowId) {
    const row = document.getElementById(rowId)
    if (!row) return
    const wasSource = !!row.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]:checked`)
    row.remove()
    if (wasSource) {
        ensureDefaultFlatSelection()
    }
    recalculatePercentageRows()
}

async function fetchpropertyfees() {
    let request = await fetchEnsuredMoreFees()
    if (request.status) {
        if (request.data.length) {
            return request.data
        } else {
            notification('No fees found please go to settings and add fees', 0)
            return []
        }
    }
    notification('No records retrieved')
    return []
}

async function propertyregistrationsubmit() {
    if (!validateForm('propertyregistrationform', getallid('propertyregistrationverify'))) return

    const table = document.getElementById('propertyregistrationtable')
    if (!table || !table.children.length) {
        return notification('Add at least one property unit fee before submitting', 0)
    }

    for (let i = 0; i < table.children.length; i++) {
        let id = table.children[i].id
        const rpCtrl = document.getElementById(`rp-${id}`)
        const rpVal = (rpCtrl?.value || '').trim() 
        if (rpVal !== PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION && (!/^\d+$/.test(rpVal) || parseInt(rpVal, 10) < 1)) {
            return notification('Rental period must be a whole number in days and cannot be zero. Examples: 30, 60, 90, 120, 180. 30 days represents one month.', 0)
        }
    }

    function payload() {
        let params = new FormData()
        if (document.getElementById('id').value) params.append('id', document.getElementById('id').value)
        params.append('propertyname', document.getElementById('propertyname').value)
        params.append('address', document.getElementById('address').value)
        params.append('city', document.getElementById('city').value)
        params.append('state', document.getElementById('state').value)
        params.append('numberofunits', document.getElementById('numberofunits').value)
        params.append('typeofunits', document.getElementById('typeofunits').value)
        params.append('propertymanager', document.getElementById('propertymanager').value)
        params.append('rowcount', table.children.length)
        for (let i = 0; i < table.children.length; i++) {
            let id = table.children[i].id 
            params.append(`unitname${i + 1}`, document.getElementById(`un-${id}`).value)
            params.append(`feenameid${i + 1}`, document.getElementById(`fe-${id}`).value)
            params.append(`amount${i + 1}`, document.getElementById(`ar-${id}`).value)
            params.append(`rentalperiod${i + 1}`, document.getElementById(`rp-${id}`).value)
            params.append(`unitid${i + 1}`, document.getElementById(`uid-${id}`).value)
        }
        return params
    }

    let request = await httpRequest2('../controllers/propertyscript', payload(), document.querySelector('#propertyregistrationform #submit'))
    if (request.status) {
        notification('Record saved successfully!', 1)
        document.querySelector('#propertyregistrationform').reset()
        clearPropertyRegistrationTable()
        return
    }
    return notification(request.message, 0)
}

// Fallback delegation: ensure live updates even if per-row binding fails
document.addEventListener('input', (e) => {
    const target = e.target
    if (!target || target.tagName !== 'INPUT') return
    if (target.id && target.id.startsWith('ar-')) {
        const row = target.closest('tr')
        if (!row) return
        if ((row.dataset.feeMode || '').toUpperCase() !== 'FLAT') return
        const checkedRadio = document.querySelector(`input[name="${APPLY_PERCENTAGE_GROUP}"]:checked`)
        if (checkedRadio && checkedRadio.value === row.id) {
            recalculatePercentageRows()
        }
    }
}, true)


