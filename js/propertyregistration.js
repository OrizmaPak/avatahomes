let propertyregistrationid
let propertyfees = []
let propertyImportGroups = []
let propertyImportActiveIndex = -1
let propertyImportSkippedRows = 0
const APPLY_PERCENTAGE_GROUP = 'property-registration-apply-percent'
const PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION = 'NOT APPLICABLE'
const PROPERTY_IMPORT_DEFAULT_RENTAL_PERIOD = '6'
const PROPERTY_IMPORT_DEFAULT_SALES_FEES = [
    { amount: 250000000, feeName: 'SALES 250' },
    { amount: 280000000, feeName: 'SALES 280' },
    { amount: 0, feeName: 'SALES 0' }
]

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
    const defaultValue = selectedValue === '' ? PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION : selectedValue
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
    return options.map(option => `<option value="${option.value}" ${String(defaultValue) === option.value ? 'selected' : ''}>${option.label}</option>`).join('')
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

    wirePropertyRegistrationImport()
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
                        floor: unit.floor ?? unit.floornumber ?? unit.floorno ?? '',
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
    updatePropertyRegistrationCounts()
}

function updatePropertyRegistrationCounts() {
    const tbody = document.getElementById('propertyregistrationtable')
    const unitsInput = document.getElementById('numberofunits')
    const floorsInput = document.getElementById('numberoffloors')
    if (!tbody || !unitsInput || !floorsInput) return

    const floorValues = new Set()
    Array.from(tbody.children).forEach((row, index) => {
        const serialCell = row.querySelector('[data-field="serial-number"]')
        if (serialCell) serialCell.textContent = index + 1
        const floorInput = row.querySelector('input[id^="fl-"]')
        const floorValue = floorInput?.value.trim().toLowerCase()
        if (floorValue) floorValues.add(floorValue)
    })

    unitsInput.value = tbody.children.length
    floorsInput.value = floorValues.size
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
        <td class="text-center font-semibold" data-field="serial-number"></td>
        <td>
            <div class="form-group">
                <p class="hidden">Unit Name</p>
                <input type="text" id="un-${id}" class="form-control propertyregistrationverify" placeholder="Enter Unit Name">
            </div>
        </td>
        <td>
            <div class="form-group">
                <p class="hidden">Floor</p>
                <input type="text" id="fl-${id}" class="form-control propertyregistrationverify" placeholder="Enter Floor">
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
            <div data-action="remove-row" title="Delete this row" style="padding: 10px 20px;border-radius: 10px;background: red;width: fit-content; height: fit-content;font-size: larger; color: white;font-weight: bold">-</div>
        </td>
    `

    tbody.appendChild(tr)

    const controls = getRowControls(id)
    if (!controls.row) return tr

    controls.unit.value = prefill.unitName ?? ''
    controls.floor.value = prefill.floor ?? ''
    controls.unitId.value = prefill.unitId ?? ''
    controls.rental.value = prefill.rentalPeriod ?? ''

    setupRentalPeriodControl(controls.rental)
    populateFeeSelect(controls.feeSelect, prefill.feeId ? String(prefill.feeId) : '')

    controls.feeSelect.addEventListener('change', () => handleFeeChange(id))
    controls.floor.addEventListener('input', updatePropertyRegistrationCounts)
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

    updatePropertyRegistrationCounts()

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
        floor: document.getElementById(`fl-${rowId}`),
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
    updatePropertyRegistrationCounts()
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
        params.append('location', document.getElementById('location').value)
        params.append('numberofunits', document.getElementById('numberofunits').value)
        params.append('numberoffloors', document.getElementById('numberoffloors').value)
        params.append('typeofunits', document.getElementById('typeofunits').value)
        params.append('propertymanager', document.getElementById('propertymanager').value)
        params.append('rowcount', table.children.length)
        for (let i = 0; i < table.children.length; i++) {
            let id = table.children[i].id 
            params.append(`unitname${i + 1}`, document.getElementById(`un-${id}`).value)
            params.append(`floor${i + 1}`, document.getElementById(`fl-${id}`).value)
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
        loadNextPropertyImportGroupAfterSave()
        return
    }
    return notification(request.message, 0)
}

function wirePropertyRegistrationImport() {
    const uploadButton = document.getElementById('propertyImportUploadBtn')
    const importInput = document.getElementById('propertyImportInput')
    const submitButton = document.getElementById('propertyImportSubmitBtn')
    const clearButton = document.getElementById('propertyImportClearBtn')

    if (uploadButton && importInput && !uploadButton.dataset.bound) {
        uploadButton.addEventListener('click', () => importInput.click())
        uploadButton.dataset.bound = '1'
    }
    if (importInput && !importInput.dataset.bound) {
        importInput.addEventListener('change', handlePropertyImportFile)
        importInput.dataset.bound = '1'
    }
    if (submitButton && !submitButton.dataset.bound) {
        submitButton.addEventListener('click', loadSelectedPropertyImportGroup)
        submitButton.dataset.bound = '1'
    }
    if (clearButton && !clearButton.dataset.bound) {
        clearButton.addEventListener('click', clearPropertyImportPreview)
        clearButton.dataset.bound = '1'
    }
}

async function ensurePropertyImportXlsxLoaded() {
    if (window.XLSX) return true
    return await new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.head.appendChild(script)
    })
}

async function handlePropertyImportFile(event) {
    const file = event.target.files[0]
    if (!file) return
    const ok = await ensurePropertyImportXlsxLoaded()
    if (!ok) {
        event.target.value = ''
        return notification('Could not load Excel helper. Check your connection.', 0)
    }

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
        try {
            const workbook = XLSX.read(loadEvent.target.result, { type: 'array' })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
            propertyImportSkippedRows = 0
            propertyImportGroups = buildPropertyImportGroups(normalizePropertyImportRows(rows))
            propertyImportActiveIndex = -1
            renderPropertyImportPreview()
        } catch (error) {
            console.error(error)
            notification('Unable to read property import Excel. Please confirm the file format.', 0)
        } finally {
            event.target.value = ''
        }
    }
    reader.readAsArrayBuffer(file)
}

function normalizePropertyImportRows(rows) {
    const keyMap = {
        'property name': 'propertyname',
        'propertyname': 'propertyname',
        'block': 'propertyname',
        'state': 'state',
        'city': 'city',
        'address': 'address',
        'location': 'location',
        'type of units': 'typeofunits',
        'typeofunits': 'typeofunits',
        'property manager': 'propertymanager',
        'facility manager': 'propertymanager',
        'propertymanager': 'propertymanager',
        'unit name': 'unitname',
        'unit': 'unitname',
        'unitname': 'unitname',
        'apartment number': 'unitname',
        'floor': 'floor',
        'fee name': 'feename',
        'feename': 'feename',
        'fee': 'feename',
        'fee name id': 'feenameid',
        'feenameid': 'feenameid',
        'amount': 'amount',
        'price': 'amount',
        'rental period': 'rentalperiod',
        'payment period': 'rentalperiod',
        'rentalperiod': 'rentalperiod',
        'type': 'type',
        'unit type': 'type',
        'size': 'size',
        'size sqft': 'size',
        'size_sqft': 'size'
    }

    const normalizedRows = rows.map((row) => {
        const normalized = {}
        Object.keys(row).forEach((key) => {
            const mappedKey = keyMap[String(key).trim().toLowerCase()]
            if (mappedKey) normalized[mappedKey] = cleanPropertyImportCell(row[key])
        })
        normalized.hasRequiredUnitInfo = !!(cleanPropertyImportCell(normalized.unitname) && cleanPropertyImportCell(normalized.floor))
        normalized.amount = normalizePropertyImportAmount(normalized.amount)
        if (!normalized.amount) normalized.amount = '0'
        if (!normalized.rentalperiod || normalized.rentalperiod.toUpperCase() === PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION) normalized.rentalperiod = PROPERTY_IMPORT_DEFAULT_RENTAL_PERIOD
        if (!normalized.feename || normalized.feename.toUpperCase() === 'PROPERTY SALES') {
            normalized.feename = getDefaultPropertyImportSalesFeeName(normalized.amount)
        }
        normalized.unitname = formatPropertyImportUnitName(normalized)
        return normalized
    }).filter((row) => Object.values(row).some((value) => `${value}`.trim() !== ''))

    propertyImportSkippedRows = normalizedRows.filter((row) => !row.hasRequiredUnitInfo).length
    return normalizedRows.filter((row) => row.hasRequiredUnitInfo)
}

function cleanPropertyImportCell(value) {
    if (value === undefined || value === null) return ''
    return `${value}`.trim()
}

function normalizePropertyImportAmount(value) {
    const raw = cleanPropertyImportCell(value).toUpperCase().replace(/,/g, '')
    if (!raw) return ''
    if (raw.endsWith('M')) {
        const millionValue = Number.parseFloat(raw.replace('M', ''))
        return Number.isFinite(millionValue) ? String(millionValue * 1000000) : ''
    }
    const numericValue = Number.parseFloat(raw)
    return Number.isFinite(numericValue) ? String(numericValue) : ''
}

function getDefaultPropertyImportSalesFeeName(amount) {
    const numericAmount = Number.parseFloat(amount)
    const match = PROPERTY_IMPORT_DEFAULT_SALES_FEES.find((fee) => fee.amount === numericAmount)
    return match ? match.feeName : 'SALES 0'
}

function formatPropertyImportUnitName(row) {
    const baseUnitName = cleanPropertyImportCell(row.unitname).split(' - ')[0]
    const parts = [baseUnitName, row.type, formatPropertyImportSize(row.size)]
        .map((value) => cleanPropertyImportCell(value))
        .filter(Boolean)
    return parts.join(' - ')
}

function formatPropertyImportSize(value) {
    const size = cleanPropertyImportCell(value)
    if (!size) return ''
    return /sq\s*ft/i.test(size) ? size.toUpperCase().replace(/\s+/g, ' ') : `${size} SQFT`
}

function buildPropertyImportGroups(rows) {
    const grouped = new Map()
    rows.forEach((row) => {
        const propertyName = cleanPropertyImportCell(row.propertyname)
        if (!propertyName) return
        const key = propertyName.toUpperCase()
        if (!grouped.has(key)) {
            grouped.set(key, {
                propertyname: propertyName,
                state: cleanPropertyImportCell(row.state),
                city: cleanPropertyImportCell(row.city),
                address: cleanPropertyImportCell(row.address),
                location: cleanPropertyImportCell(row.location),
                typeofunits: cleanPropertyImportCell(row.typeofunits) || 'FLATS',
                propertymanager: cleanPropertyImportCell(row.propertymanager),
                units: [],
                errors: []
            })
        }
        const group = grouped.get(key)
        ;['state', 'city', 'address', 'location', 'typeofunits', 'propertymanager'].forEach((field) => {
            if (!group[field] && row[field]) group[field] = cleanPropertyImportCell(row[field])
        })
        group.units.push(row)
    })

    return Array.from(grouped.values()).map((group) => {
        group.errors = validatePropertyImportGroup(group)
        return group
    })
}

function validatePropertyImportGroup(group) {
    const errors = []
    ;['propertyname', 'state', 'city', 'address', 'location', 'typeofunits', 'propertymanager'].forEach((field) => {
        if (!cleanPropertyImportCell(group[field])) errors.push(`${field} is required`)
    })
    if (!group.units.length) errors.push('at least one unit is required')

    group.units.forEach((unit, index) => {
        const rowNumber = index + 1
        if (!cleanPropertyImportCell(unit.unitname)) errors.push(`unit ${rowNumber}: unit name is required`)
        if (!cleanPropertyImportCell(unit.floor)) errors.push(`unit ${rowNumber}: floor is required`)
        if (!cleanPropertyImportCell(unit.amount)) errors.push(`unit ${rowNumber}: amount is required`)
        if (!resolvePropertyImportFeeId(unit)) errors.push(`unit ${rowNumber}: fee name not found`)
        const rentalPeriod = cleanPropertyImportCell(unit.rentalperiod)
        if (rentalPeriod !== PROPERTY_REGISTRATION_NOT_APPLICABLE_DURATION && (!/^\d+$/.test(rentalPeriod) || parseInt(rentalPeriod, 10) < 1)) {
            errors.push(`unit ${rowNumber}: rental period is invalid`)
        }
    })

    return errors
}

function resolvePropertyImportFeeId(unit) {
    if (unit.feenameid) return cleanPropertyImportCell(unit.feenameid)
    const feeName = cleanPropertyImportCell(unit.feename || 'PROPERTY SALES').toUpperCase()
    const fee = propertyfees.find((item) => cleanPropertyImportCell(item.feename).toUpperCase() === feeName)
    return fee ? String(fee.id) : ''
}

function renderPropertyImportPreview() {
    const preview = document.getElementById('propertyImportPreview')
    const table = document.getElementById('propertyImportTable')
    const summary = document.getElementById('propertyImportSummary')
    const submitButton = document.getElementById('propertyImportSubmitBtn')
    if (!preview || !table) return

    preview.classList.remove('hidden')
    table.innerHTML = ''

    if (!propertyImportGroups.length) {
        table.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-[#666]">No property rows found in the Excel file.</td></tr>`
        if (summary) summary.textContent = '0 properties found'
        if (submitButton) submitButton.setAttribute('disabled', true)
        return
    }

    let readyGroups = 0
    propertyImportGroups.forEach((group, index) => {
        const isValid = !group.errors.length
        const isActive = index === propertyImportActiveIndex
        if (isValid && !group.completed) readyGroups += 1
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>
                <input type="radio" name="property-import-building" class="property-import-radio accent-[#22c55e]" data-index="${index}" ${isValid && !group.completed ? '' : 'disabled'} ${isActive || (propertyImportActiveIndex === -1 && isValid && !group.completed && readyGroups === 1) ? 'checked' : ''}>
            </td>
            <td>${escapePropertyImportValue(group.propertyname)}</td>
            <td>${group.units.length}</td>
            <td>${getPropertyImportFloorCount(group)}</td>
            <td class="text-right">${formatPropertyImportAmount(getPropertyImportTotal(group))}</td>
            <td class="${getPropertyImportStatusClass(group, isValid, isActive)}">${getPropertyImportStatusText(group, isValid, isActive)}</td>
        `
        table.appendChild(tr)
    })

    if (summary) {
        const skippedText = propertyImportSkippedRows ? `, ${propertyImportSkippedRows} blank unit/floor row${propertyImportSkippedRows === 1 ? '' : 's'} skipped` : ''
        summary.textContent = `${propertyImportGroups.length} propert${propertyImportGroups.length === 1 ? 'y' : 'ies'} found, ${readyGroups} ready to load${skippedText}`
    }
    if (submitButton) {
        if (readyGroups) submitButton.removeAttribute('disabled')
        else submitButton.setAttribute('disabled', true)
    }
}

function clearPropertyImportPreview() {
    propertyImportGroups = []
    propertyImportActiveIndex = -1
    propertyImportSkippedRows = 0
    const preview = document.getElementById('propertyImportPreview')
    const table = document.getElementById('propertyImportTable')
    const status = document.getElementById('propertyImportStatus')
    if (table) table.innerHTML = ''
    if (status) status.textContent = ''
    if (preview) preview.classList.add('hidden')
}

function getPropertyImportStatusClass(group, isValid, isActive) {
    if (group.completed) return 'text-green-700'
    if (isActive) return 'text-[#b8860b]'
    return isValid ? 'text-green-700' : 'text-red-600'
}

function getPropertyImportStatusText(group, isValid, isActive) {
    if (group.completed) return 'Saved'
    if (isActive) return 'Loaded for review'
    return isValid ? 'Ready' : escapePropertyImportValue(group.errors.slice(0, 3).join('; '))
}

function getPropertyImportFloorCount(group) {
    const floors = new Set()
    group.units.forEach((unit) => {
        const floor = cleanPropertyImportCell(unit.floor).toLowerCase()
        if (floor) floors.add(floor)
    })
    return floors.size
}

function getPropertyImportTotal(group) {
    return group.units.reduce((total, unit) => total + (Number.parseFloat(unit.amount) || 0), 0)
}

function formatPropertyImportAmount(value) {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return '0'
    return typeof formatNumber === 'function' ? formatNumber(numericValue) : numericValue.toLocaleString()
}

function escapePropertyImportValue(value) {
    return cleanPropertyImportCell(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

function mapPropertyImportGroupToPayload(group) {
    const payload = new FormData()
    payload.append('propertyname', group.propertyname)
    payload.append('address', group.address)
    payload.append('city', group.city)
    payload.append('state', group.state)
    payload.append('location', group.location)
    payload.append('numberofunits', group.units.length)
    payload.append('numberoffloors', getPropertyImportFloorCount(group))
    payload.append('typeofunits', group.typeofunits)
    payload.append('propertymanager', group.propertymanager)
    payload.append('rowcount', group.units.length)

    group.units.forEach((unit, index) => {
        const rowNumber = index + 1
        payload.append(`unitname${rowNumber}`, unit.unitname)
        payload.append(`floor${rowNumber}`, unit.floor)
        payload.append(`feenameid${rowNumber}`, resolvePropertyImportFeeId(unit))
        payload.append(`amount${rowNumber}`, unit.amount)
        payload.append(`rentalperiod${rowNumber}`, unit.rentalperiod || PROPERTY_IMPORT_DEFAULT_RENTAL_PERIOD)
        payload.append(`unitid${rowNumber}`, '')
    })

    return payload
}

function loadSelectedPropertyImportGroup() {
    const selected = document.querySelector('.property-import-radio:checked')
    if (!selected) return notification('Select one building to load.', 0)
    loadPropertyImportGroup(Number(selected.dataset.index))
}

function loadPropertyImportGroup(index) {
    const group = propertyImportGroups[index]
    if (!group) return notification('Selected building was not found.', 0)
    if (group.errors?.length) return notification(group.errors[0], 0)

    propertyImportActiveIndex = index
    populatePropertyImportGroupInForm(group)
    renderPropertyImportPreview()
    const status = document.getElementById('propertyImportStatus')
    if (status) status.textContent = `${group.propertyname} loaded. Review the form and click Submit to save.`
    scrollToTop('scrolldiv')
}

function populatePropertyImportGroupInForm(group) {
    const form = document.querySelector('#propertyregistrationform')
    if (form) form.reset()
    document.getElementById('id').value = ''
    document.getElementById('propertyname').value = group.propertyname
    document.getElementById('state').value = group.state
    document.getElementById('city').value = group.city
    document.getElementById('address').value = group.address
    document.getElementById('location').value = group.location
    document.getElementById('typeofunits').value = group.typeofunits
    document.getElementById('propertymanager').value = group.propertymanager
    clearPropertyRegistrationTable()
    const completeUnits = group.units.filter((unit) => cleanPropertyImportCell(unit.unitname) && cleanPropertyImportCell(unit.floor))
    completeUnits.forEach((unit, index) => {
        addPropertyRegistrationRow({
            unitName: unit.unitname,
            floor: unit.floor,
            feeId: resolvePropertyImportFeeId(unit),
            amount: unit.amount,
            rentalPeriod: unit.rentalperiod || PROPERTY_IMPORT_DEFAULT_RENTAL_PERIOD,
            autoSelectSource: index === 0
        })
    })
    updatePropertyRegistrationCounts()
    recalculatePercentageRows()
}

function loadNextPropertyImportGroupAfterSave() {
    if (propertyImportActiveIndex < 0 || !propertyImportGroups.length) return
    propertyImportGroups[propertyImportActiveIndex].completed = true
    const nextIndex = propertyImportGroups.findIndex((group, index) => index > propertyImportActiveIndex && !group.completed && !group.errors?.length)
    renderPropertyImportPreview()

    if (nextIndex >= 0) {
        loadPropertyImportGroup(nextIndex)
        return
    }

    propertyImportActiveIndex = -1
    const status = document.getElementById('propertyImportStatus')
    if (status) status.textContent = 'All valid imported buildings have been saved.'
    renderPropertyImportPreview()
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


