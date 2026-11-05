let rentapropertyid;
let rentapropertyresult;
let rentFeeDefinitions = [];
let rentUnitChoices = null;
let saleInstallmentStartDate = '';
let saleDiscountRules = [];
const RENT_APPLY_PERCENTAGE_GROUP = 'rentaproperty-apply-percent';
const RENT_NOT_APPLICABLE_DURATION = 'NOT APPLICABLE';
const RENT_ALLOWED_UNIT_FEES = ['RENT'];

function saleDiscountRecords(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function saleDiscountValue(rule) {
  if (saleRuleType(rule) === 'PADDING') {
    return rule?.padding ?? rule?.value ?? rule?.paddingvalue ?? '';
  }
  return rule?.value ?? rule?.discount ?? rule?.discountpercentage ?? rule?.discount_percent ?? rule?.discountvalue ?? '';
}

function saleDiscountInstalmentCount(rule) {
  return rule?.numberofinstalment ?? rule?.numberofinstallment ?? rule?.instalments ?? '';
}

function saleRuleType(rule) {
  const type = `${rule?.category ?? rule?.type ?? rule?.ruletype ?? rule?.rule_type ?? rule?.mode ?? 'DISCOUNT'}`.trim().toUpperCase();
  return type === 'PADDING' ? 'PADDING' : 'DISCOUNT';
}

function selectedSalePricingType() {
  if (parseMoneyValue(document.getElementById('discount')?.value) > 0) return 'DISCOUNT';
  return selectedSalePaddingRule() ? 'PADDING' : 'DISCOUNT';
}

function saleRulesOfType(type) {
  return saleDiscountRules.filter(rule => saleRuleType(rule) === type);
}

function selectedSalePaddingRule() {
  const count = `${document.getElementById('installmentcount')?.value || ''}`;
  return saleRulesOfType('PADDING').find(rule => `${saleDiscountInstalmentCount(rule)}` === count) || null;
}

function selectedSalePricingValue() {
  return selectedSalePricingType() === 'PADDING'
    ? parseMoneyValue(saleDiscountValue(selectedSalePaddingRule()))
    : parseMoneyValue(document.getElementById('discount')?.value);
}

async function ensureSaleDiscountRules() {
  if (saleDiscountRules.length) return saleDiscountRules;
  const response = await httpRequest2('../controllers/fetchdiscountdata', null, null, 'json');
  if (response?.status) saleDiscountRules = saleDiscountRecords(response);
  return saleDiscountRules;
}

function configureSaleDiscountOptions(preferredDiscount = '', preferredType = '') {
  const select = document.getElementById('discount');
  if (!select) return;
  const existingValue = `${preferredDiscount || select.value || ''}`;
  const existingType = `${preferredType || select.options[select.selectedIndex]?.dataset.ruleType || 'DISCOUNT'}`.toUpperCase();
  const options = saleRulesOfType('DISCOUNT').map((rule) => {
    const discount = saleDiscountValue(rule);
    const instalments = saleDiscountInstalmentCount(rule);
    return `<option value="${discount}" data-instalments="${instalments}">Discount ${discount}% — ${instalments} instalment${Number(instalments) === 1 ? '' : 's'}</option>`;
  });
  options.push('<option value="0" data-rule-type="DISCOUNT" data-instalments="1">0% — No discount</option>');
  select.innerHTML = options.join('');
  const preferredOption = existingType === 'DISCOUNT' ? [...select.options].find(option => option.value === existingValue) : null;
  if (preferredOption) select.selectedIndex = [...select.options].indexOf(preferredOption);
  else select.selectedIndex = existingType === 'PADDING' ? select.options.length - 1 : (saleRulesOfType('DISCOUNT').length ? 0 : select.options.length - 1);
  syncSaleDiscountRule();
}

function configureSaleInstalmentOptions(preferredCount = '') {
  const select = document.getElementById('installmentcount');
  const discount = parseMoneyValue(document.getElementById('discount')?.value);
  if (!select) return;
  const rules = discount > 0 ? [] : saleRulesOfType('PADDING');
  const selectedDiscount = document.getElementById('discount')?.options[document.getElementById('discount')?.selectedIndex];
  const counts = discount > 0
    ? [selectedDiscount?.dataset.instalments || '1']
    : [...new Set(rules.map(saleDiscountInstalmentCount).filter(Boolean))];
  const desired = `${preferredCount || select.value || counts[0] || '1'}`;
  select.innerHTML = counts.length
    ? counts.map(count => `<option value="${count}">${count} instalment${Number(count) === 1 ? '' : 's'}</option>`).join('')
    : '<option value="1">1 instalment</option>';
  select.value = [...select.options].some(option => option.value === desired) ? desired : select.options[0].value;
  select.disabled = discount > 0;
}

function syncSaleDiscountRule() {
  const select = document.getElementById('discount');
  const instalmentInput = document.getElementById('installmentcount');
  if (!select || !instalmentInput) return;
  configureSaleInstalmentOptions();
  const discount = parseMoneyValue(select.value) || 0;
  const approvalStatus = document.getElementById('discountapprovalstatus');
  const approvalSubmitted = document.getElementById('discountapprovalsubmitted');
  if (approvalStatus) approvalStatus.value = discount > 0 ? 'PENDING' : 'NOT_REQUIRED';
  if (approvalSubmitted) approvalSubmitted.value = 'NO';
  updateSalePlan();
}

/* -------- DATE DIFFERENCE UTILITY -------- */
function differenceInMonths(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const yearDiff  = d2.getUTCFullYear()  - d1.getUTCFullYear();
  const monthDiff = d2.getUTCMonth()     - d1.getUTCMonth();
  const total     = yearDiff * 12 + monthDiff;
  return Math.abs(total) < 1 ? 1 : Math.abs(total);
}

function getDurationOptionsMarkup(selectedValue = '') {
  const defaultValue = selectedValue === '' ? RENT_NOT_APPLICABLE_DURATION : selectedValue;
  const options = [
    { value: '', label: 'Select payment period' },
    { value: RENT_NOT_APPLICABLE_DURATION, label: 'Not Applicable' },
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
  ];
  return options.map(option => `<option value="${option.value}" ${String(defaultValue) === option.value ? 'selected' : ''}>${option.label}</option>`).join('');
}

function getRentAddRowButton() {
  return document.getElementById('rentapropertyaddrow');
}

function normalizeUnitFeeName(unit) {
  return `${unit?.feename ?? unit?.fee_name ?? ''}`.trim().toUpperCase();
}

function normalizeUnitAmount(unit) {
  const value = unit?.amount ?? unit?.rent ?? unit?.feeamount ?? 0;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function isRentPropertyUnitEligible(unit, exitMode = getSelectedExitMode()) {
  const feeName = normalizeUnitFeeName(unit);
  const occupancyValue = `${unit?.rented ?? unit?.isrented ?? unit?.occupied ?? ''}`.trim().toUpperCase();
  const isSalesFee = feeName.startsWith('SALES ') || feeName.startsWith('PROPERTY SALES ');
  const isRentFee = RENT_ALLOWED_UNIT_FEES.includes(feeName);
  const unavailable = ['YES', 'TRUE', '1', 'SOLD', 'RENTED', 'TAKEN', 'OCCUPIED', 'ALLOCATED'].includes(occupancyValue);
  return (exitMode === 'SALE' ? isSalesFee : exitMode === 'RENT' ? isRentFee : false) && !unavailable;
}

function rentPropertiesForExitMode(exitMode) {
  if (!Array.isArray(rentapropertyresult) || !exitMode) return [];
  return rentapropertyresult.filter(propertyData =>
    (Array.isArray(propertyData?.propertyunits) ? propertyData.propertyunits : [])
      .some(unit => isRentPropertyUnitEligible(unit, exitMode))
  );
}

function populateRentProperties(exitMode, selectedPropertyId = '') {
  const propertySelect = document.getElementById('propertyid');
  if (!propertySelect) return [];
  const properties = rentPropertiesForExitMode(exitMode);
  propertySelect.innerHTML = `<option value="">-- Select ${exitMode === 'SALE' ? 'Property for Sale' : 'Rental Property'} --</option>` +
    properties.map(item => `<option value="${item.property.id}">${item.property.propertyname}</option>`).join('');
  propertySelect.value = `${selectedPropertyId}`;
  return properties;
}

function getSelectedExitMode() {
  return document.querySelector('input[name="exitmode"]:checked')?.value.toUpperCase() || '';
}

function hideRentTransactionDetails() {
  document.querySelectorAll('.remain').forEach(element => element.classList.add('hidden'));
  document.getElementById('begin')?.classList.remove('hidden');
  document.getElementById('saleplan')?.classList.add('hidden');
  document.getElementById('otherfeesview')?.classList.add('hidden');
}

function revealRentTransactionDetails() {
  const beginDate = document.getElementById('begindate')?.value;
  if (!beginDate) return hideRentTransactionDetails();
  document.querySelectorAll('.remain').forEach(element => element.classList.remove('hidden'));
  document.getElementById('otherfeesview')?.classList.remove('hidden');
  updateRentDurationVisibility();
  updateSalePlan();
}

function updateRentExitModeVisibility() {
  const tenantId = document.getElementById('tenantid')?.value || '';
  const modeContainer = document.getElementById('exitmode');
  const propertyContainer = document.getElementById('propertyfield');
  const unitContainer = document.getElementById('unitt');
  const unitSelect = document.getElementById('unitid');
  const exitMode = getSelectedExitMode();
  updateAmountPaidAvailability();

  modeContainer?.classList.toggle('hidden', !tenantId);
  propertyContainer?.classList.toggle('hidden', !tenantId || !exitMode);
  if (!tenantId || !exitMode) {
    unitContainer?.classList.add('hidden');
    rentUnitChoices?.destroy();
    rentUnitChoices = null;
    if (unitSelect) unitSelect.innerHTML = '<option value="">-- Select Unit --</option>';
    document.querySelectorAll('.remain').forEach(element => element.classList.add('hidden'));
  }
}

function updateAmountPaidAvailability() {
  const amountPaid = document.getElementById('amountpaid');
  if (!amountPaid) return;
  const container = document.getElementById('amountpaidcontainer');
  const selling = getSelectedExitMode() === 'SALE';
  const rentalIsReady = getSelectedExitMode() === 'RENT'
    && !!document.getElementById('unitid')?.value
    && !!document.getElementById('begindate')?.value;
  amountPaid.disabled = selling;
  container?.classList.toggle('hidden', !rentalIsReady);
  if (selling) {
    amountPaid.value = '';
    delete amountPaid.dataset.saleUserEdited;
  }
}

async function handleRentExitModeChange() {
  const propertySelect = document.getElementById('propertyid');
  saleInstallmentStartDate = '';
  const startDateInput = document.getElementById('begindate');
  if (startDateInput) startDateInput.value = '';
  const unitSelect = document.getElementById('unitid');
  if (unitSelect) unitSelect.value = '';
  document.querySelectorAll('.remain').forEach(element => element.classList.add('hidden'));
  const feeTable = document.getElementById('rentapropertytable');
  if (feeTable) feeTable.innerHTML = '';
  document.getElementById('saleplan')?.classList.add('hidden');
  document.getElementById('otherfeesview')?.classList.remove('sale-payment-mode');
  document.getElementById('submit')?.classList.remove('hidden');
  document.getElementById('sendapproval')?.classList.add('hidden');
  const exitMode = getSelectedExitMode();
  const properties = populateRentProperties(exitMode);
  updateRentExitModeVisibility();
  if (!properties.length) notification(`No properties are configured for ${exitMode === 'SALE' ? 'sale' : 'rent'}.`, 0);
}

async function handleRentPropertyChange(propertySelect) {
  updateRentExitModeVisibility();
  await checkrentapropertyproperty(propertySelect);
}

function initializeRentUnitChoices() {
  const unitSelect = document.getElementById('unitid');
  if (!unitSelect) return;
  if (unitSelect.dataset.rentChangeBound !== 'true') {
    unitSelect.addEventListener('change', () => checkrentapropertyunit(unitSelect));
    unitSelect.dataset.rentChangeBound = 'true';
  }
  if (typeof Choices === 'undefined') return;
  rentUnitChoices?.destroy();
  rentUnitChoices = new Choices(unitSelect, {
    searchEnabled: true,
    searchPlaceholderValue: 'Search unit, floor or description',
    shouldSort: false,
    itemSelectText: '',
    noResultsText: 'No matching units found',
    noChoicesText: 'No units available',
    allowHTML: false,
    searchResultLimit: -1,
    position: 'auto'
  });
}

function findSelectedPropertyData(propertyId) {
  if (!Array.isArray(rentapropertyresult)) return null;
  return rentapropertyresult.find(item => `${item?.property?.id ?? item?.id ?? ''}` === `${propertyId}`);
}

function mergePropertySalesUnits(propertyId, renewableUnits = []) {
  const exitMode = getSelectedExitMode();
  const propertyData = findSelectedPropertyData(propertyId);
  const propertyUnits = Array.isArray(propertyData?.propertyunits) ? propertyData.propertyunits : [];
  const filteredRenewableUnits = renewableUnits.filter(unit => {
    const feeName = normalizeUnitFeeName(unit);
    return !feeName ? exitMode === 'RENT' : isRentPropertyUnitEligible(unit);
  });
  const seenUnitIds = new Set(filteredRenewableUnits.map(unit => `${unit?.id ?? ''}`));
  const mergedUnits = [...filteredRenewableUnits];

  propertyUnits.forEach(unit => {
    if (!isRentPropertyUnitEligible(unit)) return;
    const unitId = `${unit?.id ?? ''}`;
    if (seenUnitIds.has(unitId)) return;
    seenUnitIds.add(unitId);
    mergedUnits.push({
      ...unit,
      rent: normalizeUnitAmount(unit)
    });
  });

  return mergedUnits;
}

function setRentAddRowButtonLoading(isLoading) {
  const button = getRentAddRowButton();
  if (!button) return; 
  if (isLoading) {
    button.dataset.ready = '';
    button.setAttribute('aria-busy', 'true');
    button.textContent = '...';
    button.style.pointerEvents = 'none';
    button.style.opacity = '0.6';
  } else {
    button.dataset.ready = '1';
    button.removeAttribute('aria-busy');
    button.textContent = '+';
    button.style.pointerEvents = 'auto';
    button.style.opacity = '1';
  }
}

function isRentAddRowButtonReady() {
  const button = getRentAddRowButton();
  return !!(button && button.dataset.ready === '1');
}

async function ensureRentFeeDefinitions(force = false) {
  if (!force && rentFeeDefinitions.length) return rentFeeDefinitions;
  const response = await fetchEnsuredMoreFees();
  if (response.status && Array.isArray(response.data)) {
    rentFeeDefinitions = response.data;
  } else {
    rentFeeDefinitions = [];
    notification(response.message || 'No fees found please go to settings and add fees', 0);
  }
  return rentFeeDefinitions;
}

/* -------- INITIALISATION -------- */
async function rentapropertyActive() {
  const storedRentPropertyId = sessionStorage.getItem('rentapropertyid');
  if (storedRentPropertyId) {
    rentapropertyid = storedRentPropertyId;
    sessionStorage.removeItem('rentapropertyid');
  }
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const form = document.querySelector('#rentapropertyform');
  if (!form) {
    return notification('Property Sales/Rentals is still loading. Please try again.', 0);
  }
  if (form.dataset.rentapropertyInitialized === 'true') return;
  form.dataset.rentapropertyInitialized = 'true';
  form.querySelector('#submit')
      .addEventListener('click', rentapropertysubmit);
  form.querySelector('#sendapproval')
      ?.addEventListener('click', () => rentapropertysubmit('SEND_APPROVAL'));
  document.getElementById('amountpaid')?.addEventListener('input', (event) => {
    if (getSelectedExitMode() !== 'SALE') return;
    event.currentTarget.dataset.saleUserEdited = 'true';
    const maximum = parseMoneyValue(document.getElementById('totalamount')?.value);
    const value = parseMoneyValue(event.currentTarget.value);
    if (maximum > 0 && value > maximum) {
      event.currentTarget.value = formatMoneyInputValue(maximum);
      notification('Amount paid cannot exceed the final sales total.', 0);
    }
  });
  document.getElementById('begindate')?.addEventListener('change', (event) => {
    saleInstallmentStartDate = event.target.value;
    revealRentTransactionDetails();
  });
  document.getElementById('discount')?.addEventListener('change', syncSaleDiscountRule);
  document.getElementById('addsalefee')?.addEventListener('click', addSaleAdditionalFee);
  document.getElementById('installmentcount')?.addEventListener('change', (event) => {
    const installmentCount = Number.parseInt(event.target.value || '', 10);
    const beginDate = document.getElementById('begindate')?.value;
    if (getSelectedExitMode() === 'SALE' && installmentCount > 0 && !beginDate) {
      notification('Please fill in the begin date for the instalment schedule to be calculated.', 0);
    }
    updateSalePlan();
  });

  // Fetch tenants
  const tRes = await httpRequest2('../controllers/fetchtenants', null, null, 'json');
  if (tRes.status) {
    document.getElementById('tenantid').innerHTML =
      `<option value="">-- Select Client --</option>` +
      tRes.data.map(d =>
        `<option value="${d.tenantdata.id}">${d.tenantdata.firstname} ${d.tenantdata.lastname} ${d.tenantdata.othernames}</option>`
      ).join('');
  } else {
    return notification('Unable to retrieve clients, please reload.', 0);
  }

  // Fetch properties
  const pRes = await httpRequest2('../controllers/fetchproperty', null, null, 'json');
  if (pRes.status) {
    rentapropertyresult = pRes.data;
    document.getElementById('propertyid').innerHTML = '<option value="">-- Select transaction type first --</option>';
  } else {
    return notification('Unable to retrieve properties, please reload.', 0);
  }
  await ensureSaleDiscountRules();
  configureSaleDiscountOptions();

  const addRowButton = getRentAddRowButton();
  if (addRowButton && !addRowButton.dataset.bound) {
    addRowButton.addEventListener('click', async () => {
      if (!isRentAddRowButtonReady()) return;
      if (!rentFeeDefinitions.length) {
        setRentAddRowButtonLoading(true);
        try {
          await ensureRentFeeDefinitions();
        } finally {
          setRentAddRowButtonLoading(false);
        }
      }
      if (!rentFeeDefinitions.length) {
        return notification('No fees found please go to settings and add fees', 0);
      }
      addRentFeeRow();
      ensureRentDefaultFlatSelection();
      recalculateRentPercentageRows();
      updateRentTotalDeposit();
    });
    addRowButton.dataset.bound = '1';
  }

  setRentAddRowButtonLoading(true);
  try {
    await ensureRentFeeDefinitions();
  } finally {
    setRentAddRowButtonLoading(false);
  }

  // If editing existing record
  if (rentapropertyid) {
    document.getElementById('id').value = rentapropertyid;
    document.querySelectorAll('.remain').forEach(el => el.classList.remove('hidden'));

    const payload = new FormData();
    payload.append('id', rentapropertyid);
    let response = await httpRequest2('../controllers/fetchsalesdraft', payload, null, 'json');
    let record = Array.isArray(response?.data) ? response.data.find(item => `${item?.rentdata?.id}` === `${rentapropertyid}`) : null;
    const isApprovalDraft = !!record;
    if (!record) {
      response = await httpRequest2('../controllers/fetchrentaproperty', payload, null, 'json');
      record = Array.isArray(response?.data) ? response.data.find(item => `${item?.rentdata?.id}` === `${rentapropertyid}`) : null;
    }
    if (record?.rentdata) {
      populateData(record.rentdata);
      const savedPricingType = `${record.rentdata.pricingtype ?? (Number(record.rentdata.padding || 0) > 0 ? 'PADDING' : 'DISCOUNT')}`.toUpperCase();
      const savedSaleDiscount = savedPricingType === 'PADDING' ? (record.rentdata.padding ?? '') : (record.rentdata.discount ?? '');
      const savedApprovalStatus = record.rentdata.discountstatus ?? record.rentdata.discountapprovalstatus ?? record.rentdata.approvalstatus ?? '';
      if (document.getElementById('discount') && savedSaleDiscount !== '') {
        configureSaleDiscountOptions(savedSaleDiscount, savedPricingType);
      }
      if (savedPricingType === 'PADDING') configureSaleInstalmentOptions(record.rentdata.numberofinstalment);
      if (document.getElementById('discountapprovalstatus') && savedApprovalStatus) {
        document.getElementById('discountapprovalstatus').value = `${savedApprovalStatus}`.toUpperCase();
        if (['PENDING', 'PENDING_APPROVAL'].includes(`${savedApprovalStatus}`.toUpperCase())) {
          document.getElementById('discountapprovalsubmitted').value = 'YES';
        }
      }

      const propertySelect = document.getElementById('propertyid');
      if (propertySelect) {
        await setRentExitModeForEdit(record.rentdata);
        propertySelect.value = record.rentdata.propertyid;
        await checkrentapropertyproperty(propertySelect);
      }

      const unitSelect = document.getElementById('unitid');
      if (unitSelect) {
        unitSelect.value = record.rentdata.unitid;
        rentUnitChoices?.setChoiceByValue(String(record.rentdata.unitid));
        const savedFees = normalizeUnitFeeRows(record.rentalfees || record.fees || record.rentdata.rentalfees);
        const feeCacheKey = `propertySaleFees:${record.rentdata.tenantid}:${record.rentdata.propertyid}:${record.rentdata.unitid}`;
        const cachedFees = JSON.parse(sessionStorage.getItem(`propertySaleFees:${rentapropertyid}`) || sessionStorage.getItem(feeCacheKey) || 'null');
        await checkrentapropertyunit(unitSelect, savedFees.length ? savedFees : cachedFees);
        if (isApprovalDraft && !savedFees.length && !cachedFees?.length) {
          notification('This approval record has no saved fee breakdown. Please review and re-enter the additional fees before submitting.', 0);
        }
      }

      const savedInstallments = record.instalments || record.rentdata.instalments || [];
      const savedInstallmentCount = Number.parseInt(record.rentdata.numberofinstalment, 10);
      if (record.rentdata.exitmode?.toUpperCase() === 'SALE' && Number.isInteger(savedInstallmentCount) && savedInstallmentCount > 0) {
        const installmentCount = document.getElementById('installmentcount');
        const beginDate = document.getElementById('begindate');
        if (installmentCount) installmentCount.value = savedInstallmentCount;
        if (beginDate) saleInstallmentStartDate = beginDate.value = record.rentdata.begindate || '';
        updateSalePlan();
        if (Array.isArray(savedInstallments)) {
          savedInstallments.forEach((saved, index) => {
            const dueDate = document.querySelectorAll('.sale-installment-due-date')[index];
            if (dueDate && saved.duedate) dueDate.value = saved.duedate;
          });
          const lastDueDate = [...document.querySelectorAll('.sale-installment-due-date')].at(-1)?.value || '';
          if (lastDueDate) document.getElementById('expirationdate').value = lastDueDate;
        }
      }

      const paymentDate = document.getElementById('paymentdate');
      if (paymentDate && record.rentdata.paymentdate) {
        paymentDate.value = record.rentdata.paymentdate.split(' ')[0];
      }
      const durationInput = document.getElementById('duration');
      if (durationInput) {
        if (record.rentdata.expirationdate) {
          durationInput.value = differenceInMonths(
            record.rentdata.begindate,
            record.rentdata.expirationdate.split(' ')[0]
          );
        } else {
          durationInput.value = RENT_NOT_APPLICABLE_DURATION;
        }
      }
      const managerInput = document.getElementById('propertymanager');
      if (managerInput) {
        managerInput.value = record.tenant;
      }
    } else {
      return notification(response?.message || 'Error fetching record', 0);
    }
  }
  rentapropertyid = '';
}
document.addEventListener('DOMContentLoaded', rentapropertyActive);

/* -------- RANDOM COLOR FOR BADGES -------- */
function getRandomColor() {
  const hex = '0123456789ABCDEF';
  return '#' + Array.from({length:6}).map(()=>hex[Math.floor(Math.random()*16)]).join('');
}

/* -------- DEPENDANT MODAL -------- */
function addDependant() {
  let overlay = document.getElementById('dependantModalOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'dependantModalOverlay';
    overlay.className = 'fixed inset-0 flex items-center justify-center bg-black/50 hidden z-50';
    overlay.innerHTML = `
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div class="flex justify-between items-center px-6 py-4 border-b">
          <h2 class="text-xl font-semibold">Add Dependant</h2>
          <button id="closeDependantModal" class="text-2xl leading-none">&times;</button>
        </div>
        <div class="px-6 py-4 space-y-4">
          <input id="dependantName" placeholder="Full Name" class="w-full border rounded px-4 py-2"/>
          <input id="dependantPhone" placeholder="Phone Number" class="w-full border rounded px-4 py-2"/>
          <input id="dependantOccupation" placeholder="Occupation" class="w-full border rounded px-4 py-2"/>
          <select id="dependantRelationship" class="w-full border rounded px-4 py-2">
            <option value="" disabled selected>Select Relationship</option>
            <option>Child</option><option>Spouse</option><option>Parent</option>
            <option>Sibling</option><option>Staff</option><option>Other</option>
          </select>
          <input id="otherRelationship" placeholder="Specify Relationship" class="w-full border rounded px-4 py-2 hidden"/>
          <p id="dependantError" class="text-red-500 hidden">Please fill out all fields</p>
        </div>
        <div class="flex justify-end px-6 py-4 border-t space-x-3">
          <button id="cancelDependantModal" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button id="submitDependantModal" class="px-6 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const $ = sel => overlay.querySelector(sel);

    $('#dependantRelationship').addEventListener('change', e => {
      if (e.target.value === 'Other') $('#otherRelationship').classList.remove('hidden');
      else $('#otherRelationship').classList.add('hidden');
    });

    ['#closeDependantModal','#cancelDependantModal'].forEach(sel =>
      $(sel).addEventListener('click', () => overlay.classList.add('hidden'))
    );

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden'))
        overlay.classList.add('hidden');
    });

    $('#submitDependantModal').addEventListener('click', () => {
      const name = $('#dependantName').value.trim();
      const phone = $('#dependantPhone').value.trim();
      const occ = $('#dependantOccupation').value.trim();
      let rel = $('#dependantRelationship').value;
      const other = $('#otherRelationship').value.trim();
      const err = $('#dependantError');
      if (!name||!phone||!occ||!rel||(rel==='Other'&&!other)) {
        err.classList.remove('hidden');
        return;
      }
      err.classList.add('hidden');
      if (rel==='Other') rel = other;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="material-symbols-outlined">account_circle</span>${name}</td>
        <td>${phone}</td>
        <td>${occ}</td>
        <td><span style="background:${getRandomColor()};padding:4px;border-radius:4px;color:#fff">${rel}</span></td>
        <td><button class="remove-dependant material-symbols-outlined bg-red-600 text-white rounded px-2">delete</button></td>`;
      row.querySelector('.remove-dependant').addEventListener('click', () => row.remove());
      document.getElementById('dependantTableBody').appendChild(row);
      ['#dependantName','#dependantPhone','#dependantOccupation'].forEach(i=>$(i).value='');
      $('#dependantRelationship').selectedIndex = 0;
      $('#otherRelationship').value = '';
      $('#otherRelationship').classList.add('hidden');
      overlay.classList.add('hidden');
    });
  }
  overlay.classList.remove('hidden');
  overlay.querySelector('#dependantName').focus();
}

/* -------- PROPERTY → UNITS -------- */
async function checkrentapropertyproperty(el) {
  const pid = el.value;
  if (!pid) {
    document.getElementById('unitt').classList.add('hidden');
    return;
  }
  const exitMode = getSelectedExitMode();
  let response = { status: true, data: [] };
  let units = [];

  if (exitMode === 'SALE') {
    units = mergePropertySalesUnits(pid);
  } else if (exitMode === 'RENT') {
    const payload = new FormData();
    payload.append('id', pid);
    payload.append('exitmode', 'RENT');
    response = await httpRequest2('../controllers/fetchrenewableunits', payload, null, 'json');
    units = mergePropertySalesUnits(pid, Array.isArray(response?.data) ? response.data : []);
  }

  if ((!response?.status && !units.length) || !units.length) {
    notification(response?.message || 'No units found', 0);
    document.getElementById('unitt').classList.add('hidden');
    return;
  }
  document.getElementById('unitt').classList.remove('hidden');
  const propertyData = findSelectedPropertyData(pid);
  if (propertyData) {
    propertyData.renewableunits = units;
  }
  const unitSelect = document.getElementById('unitid');
  rentUnitChoices?.destroy();
  rentUnitChoices = null;
  unitSelect.innerHTML =
    `<option value="">-- Select Property Unit --</option>` +
    Object.entries(units.reduce((groups, unit) => {
      const floor = `${unit.floor ?? unit.floornumber ?? unit.floorno ?? 'Floor not assigned'}`.trim() || 'Floor not assigned';
      (groups[floor] ||= []).push(unit);
      return groups;
    }, {})).sort(([floorA], [floorB]) => floorA.localeCompare(floorB, undefined, { numeric: true })).map(([floor, floorUnits]) =>
      `<optgroup label="${floor}">${floorUnits.map(unit => `<option value="${unit.id}" data-search="${`${unit.unitname || ''} ${floor} ${unit.description || ''}`.toLowerCase()}">${unit.unitname} · ${floor} · ${unit.description || 'Unit'} · ₦${Number(unit.rent ?? unit.amount ?? 0).toLocaleString()}</option>`).join('')}</optgroup>`
    ).join('');
  initializeRentUnitChoices();
}

async function setRentExitModeForEdit(rentData) {
  const savedMode = `${rentData?.exitmode ?? rentData?.exit_mode ?? ''}`.trim().toUpperCase();
  let mode = ['RENT', 'SALE'].includes(savedMode) ? savedMode : '';
  if (!mode) {
    const propertyData = findSelectedPropertyData(rentData?.propertyid);
    const propertyUnits = Array.isArray(propertyData?.propertyunits) ? propertyData.propertyunits : [];
    const unit = propertyUnits.find(item => `${item?.id ?? ''}` === `${rentData?.unitid ?? ''}`);
    const feeName = normalizeUnitFeeName(unit);
    mode = feeName === 'RENT' ? 'RENT' : (feeName.startsWith('SALES ') || feeName.startsWith('PROPERTY SALES ')) ? 'SALE' : '';
  }
  document.querySelectorAll('input[name="exitmode"]').forEach(input => { input.checked = input.value === mode; });
  populateRentProperties(mode, rentData?.propertyid);
  updateRentExitModeVisibility();
  return mode;
}

function isSaleFeeName(name) {
  const normalized = `${name || ''}`.trim().toUpperCase();
  return normalized.startsWith('SALES ') || normalized.startsWith('PROPERTY SALES ');
}

function getSaleFeeTableRow() {
  return [...document.querySelectorAll('#rentapropertytable tr')].find((row) => {
    const feeId = row.querySelector('.feename-select')?.value;
    const fee = rentFeeDefinitions.find((item) => `${item.id}` === `${feeId}`);
    return isSaleFeeName(fee?.feename);
  }) || null;
}

function saleFeeNameForRow(row) {
  const feeId = row?.querySelector('.feename-select')?.value;
  const fee = rentFeeDefinitions.find(item => `${item.id}` === `${feeId}`);
  return fee?.feename || row?.querySelector('.feename-select option:checked')?.textContent || 'Select fee';
}

function saleAdditionalFeeOptions(selectedId = '') {
  return ['<option value="">Select other fee</option>'].concat(rentFeeDefinitions
    .filter(fee => !isSaleFeeName(fee.feename))
    .map(fee => `<option value="${fee.id}" ${`${fee.id}` === `${selectedId}` ? 'selected' : ''}>${fee.feename}</option>`)).join('');
}

function setSalePaymentRowsReadOnly() {
  document.querySelectorAll('#rentapropertytable tr').forEach(row => {
    row.querySelector('.feename-select')?.setAttribute('disabled', 'disabled');
    const amount = row.querySelector('.amount-input');
    if (amount) amount.readOnly = true;
  });
}

function renderSalesFeeBreakdown() {
  const container = document.getElementById('salesfeeitems');
  if (!container) return;
  if (getSelectedExitMode() !== 'SALE') {
    container.innerHTML = '';
    return;
  }
  const saleRow = getSaleFeeTableRow();
  const rows = [...document.querySelectorAll('#rentapropertytable tr')];
  const additionalRows = rows.filter(row => row !== saleRow);
  container.innerHTML = additionalRows.map(row => {
    const controls = getRentFeeRowControls(row.id);
    const feeId = controls.feeSelect?.value || '';
    const mode = `${row.dataset.feeMode || ''}`.toUpperCase();
    const name = feeId ? `<div class="sale-fee-item-name">${saleFeeNameForRow(row)}</div>` : `<select class="form-control" data-sale-extra-select="${row.id}">${saleAdditionalFeeOptions(feeId)}</select>`;
    return `<div class="sale-fee-item" data-sale-fee-row="${row.id}">
      <div><label>Fee name</label>${name}</div>
      <div><label>Amount</label><input type="text" inputmode="decimal" class="form-control money-input" data-sale-extra-amount="${row.id}" value="${controls.amount?.value || ''}" ${mode === 'PERCENTAGE' || !feeId ? 'readonly' : ''}></div>
      <button type="button" class="sale-fee-remove" data-remove-sale-fee="${row.id}" title="Remove fee" aria-label="Remove fee"><span class="material-symbols-outlined">remove</span></button>
    </div>`;
  }).join('');
  container.querySelectorAll('[data-sale-extra-select]').forEach(select => select.addEventListener('change', event => {
    const controls = getRentFeeRowControls(event.currentTarget.dataset.saleExtraSelect);
    if (!controls.feeSelect) return;
    controls.feeSelect.removeAttribute('disabled');
    controls.feeSelect.value = event.currentTarget.value;
    handleRentFeeChange(controls.row.id);
    setSalePaymentRowsReadOnly();
  }));
  container.querySelectorAll('[data-sale-extra-amount]').forEach(input => input.addEventListener('input', event => {
    const controls = getRentFeeRowControls(event.currentTarget.dataset.saleExtraAmount);
    if (!controls.amount || controls.amount.readOnly && `${controls.row.dataset.feeMode}`.toUpperCase() === 'PERCENTAGE') return;
    controls.amount.readOnly = false;
    controls.amount.value = event.currentTarget.value;
    handleRentAmountInput(controls.row.id);
    setSalePaymentRowsReadOnly();
  }));
  container.querySelectorAll('[data-remove-sale-fee]').forEach(button => button.addEventListener('click', () => removeRentFeeRow(button.dataset.removeSaleFee)));
  setSalePaymentRowsReadOnly();
}

function addSaleAdditionalFee() {
  if (getSelectedExitMode() !== 'SALE') return;
  const row = addRentFeeRow({});
  if (row) {
    row.dataset.saleExtra = 'true';
    renderSalesFeeBreakdown();
  }
}

function setSaleDiscountApprovalStatus(status = 'NOT_REQUIRED') {
  const normalized = `${status || 'NOT_REQUIRED'}`.trim().toUpperCase();
  const hidden = document.getElementById('discountapprovalstatus');
  const badge = document.getElementById('saleapprovalstatus');
  const discount = selectedSalePricingType() === 'DISCOUNT' ? parseMoneyValue(document.getElementById('discount')?.value) : 0;
  const effectiveStatus = discount > 0 && normalized === 'NOT_REQUIRED' ? 'PENDING' : normalized;
  if (hidden) hidden.value = effectiveStatus;
  if (!badge) return effectiveStatus;
  badge.textContent = effectiveStatus === 'APPROVED'
    ? 'MD approved'
    : effectiveStatus === 'REJECTED'
      ? 'Discount rejected'
      : discount > 0 ? 'Approval pending' : 'No approval needed';
  badge.className = `sale-approval-status sale-approval-${effectiveStatus.toLowerCase()}`;
  return effectiveStatus;
}

function renderSaleInstallments(total, count) {
  const container = document.getElementById('saleinstallments');
  const rowsContainer = document.getElementById('saleinstallmentrows');
  if (!container || !rowsContainer) return;
  const previous = [...rowsContainer.querySelectorAll('.sale-installment-card')].map((row) => ({
    dueDate: row.querySelector('.sale-installment-due-date')?.value || ''
  }));
  const safeCount = Math.max(0, Math.min(120, Number.parseInt(count, 10) || 0));
  if (!safeCount || total <= 0 || !saleInstallmentStartDate) {
    rowsContainer.innerHTML = '';
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  const baseAmount = Math.floor((total / safeCount) * 100) / 100;
  rowsContainer.innerHTML = Array.from({ length: safeCount }, (_, index) => {
    const amount = index === safeCount - 1
      ? Math.round((total - (baseAmount * (safeCount - 1))) * 100) / 100
      : baseAmount;
    const old = previous[index] || {};
    const dueDate = saleInstallmentStartDate
      ? getMonthlyInstallmentDate(saleInstallmentStartDate, index)
      : old.dueDate;
    return `<div class="sale-installment-card" data-installment-index="${index + 1}">
      <div class="sale-installment-number"><span>Instalment ${index + 1}</span><span>₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      <input type="hidden" class="sale-installment-amount" value="${amount}">
      <label for="saleinstallmentdate${index + 1}">Due date</label>
      <input type="date" id="saleinstallmentdate${index + 1}" class="sale-installment-due-date" value="${dueDate}" required>
    </div>`;
  }).join('');
}

function getMonthlyInstallmentDate(startDate, monthOffset) {
  const [year, month, day] = `${startDate}`.split('-').map(Number);
  if (!year || !month || !day) return '';
  const targetMonth = month - 1 + monthOffset;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const validDay = Math.min(day, lastDay);
  return `${targetYear}-${String(normalizedMonth + 1).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
}

function updateSalePlan() {
  const panel = document.getElementById('saleplan');
  if (!panel) return;
  updateAmountPaidAvailability();
  updateRentDurationVisibility();
  const transactionMode = getSelectedExitMode();
  const isSale = transactionMode === 'SALE';
  const hasTransaction = isSale && !!document.getElementById('unitid')?.value && !!document.getElementById('begindate')?.value;
  const countContainer = document.getElementById('installmentcountcontainer');
  const installments = document.getElementById('saleinstallments');
  countContainer?.classList.toggle('hidden', !isSale);
  installments?.classList.toggle('hidden', !isSale);
  const title = document.getElementById('transactionplantitle');
  const help = document.getElementById('transactionplanhelp');
  const finalLabel = document.getElementById('finaltotallabel');
  const pricingLabel = document.getElementById('pricingrulelabel');
  if (title) title.textContent = 'Sale payment plan';
  if (help) help.textContent = selectedSalePricingType() === 'PADDING'
    ? 'Padding applies to the selected instalment plan. No discount approval is required.'
    : 'Discounts require approval before this transaction can be completed.';
  if (finalLabel) finalLabel.textContent = 'Final sales total';
  panel.classList.toggle('hidden', !hasTransaction);
  if (!hasTransaction) {
    renderSalesFeeBreakdown();
    return;
  }
  saleInstallmentStartDate = document.getElementById('begindate')?.value || '';
  const saleRow = getSaleFeeTableRow();
  const saleAmount = parseMoneyValue(saleRow?.querySelector('.amount-input')?.value);
  const feeTotal = [...document.querySelectorAll('#rentapropertytable .amount-input')]
    .reduce((sum, input) => sum + parseMoneyValue(input.value), 0);
  const amountInput = document.getElementById('baseamount');
  const discountInput = document.getElementById('discount');
  const finalInput = document.getElementById('totalamount');
  initializeMoneyInputs(panel);
  const adjustment = Math.max(0, Math.min(100, selectedSalePricingValue()));
  const pricingType = selectedSalePricingType();
  const discount = pricingType === 'DISCOUNT' ? adjustment : 0;
  const padding = pricingType === 'PADDING' ? adjustment : 0;
  if (pricingLabel) pricingLabel.textContent = pricingType === 'PADDING' ? 'Padding' : 'Discount';
  const status = setSaleDiscountApprovalStatus(discount > 0
    ? document.getElementById('discountapprovalstatus')?.value
    : 'NOT_REQUIRED');
  const finalTotal = Math.max(feeTotal - ((feeTotal * discount) / 100) + ((feeTotal * padding) / 100), 0);
  const submitButton = document.getElementById('submit');
  const approvalButton = document.getElementById('sendapproval');
  const approvalRequired = discount > 0 && status !== 'APPROVED';
  submitButton?.classList.toggle('hidden', approvalRequired);
  approvalButton?.classList.toggle('hidden', !approvalRequired);
  if (approvalButton) {
    const submitted = document.getElementById('discountapprovalsubmitted')?.value === 'YES';
    approvalButton.disabled = submitted;
    approvalButton.querySelector('span').textContent = submitted ? 'Awaiting Approval' : 'Send for Approval';
  }
  if (amountInput) amountInput.value = formatMoneyInputValue(saleAmount || '');
  if (finalInput) finalInput.value = formatMoneyInputValue(finalTotal || '');
  const amountPaidInput = document.getElementById('amountpaid');
  if (amountPaidInput) {
    amountPaidInput.max = `${finalTotal}`;
    if (!amountPaidInput.dataset.saleUserEdited) {
      amountPaidInput.value = '';
    } else if (parseMoneyValue(amountPaidInput.value) > finalTotal) {
      amountPaidInput.value = formatMoneyInputValue(finalTotal || '');
    }
  }
  renderSalesFeeBreakdown();
  const count = document.getElementById('installmentcount')?.value || '';
  if (isSale) renderSaleInstallments(finalTotal, count);
  const lastInstallmentDate = [...document.querySelectorAll('#saleinstallmentrows .sale-installment-due-date')].at(-1)?.value || '';
  const expirationDate = document.getElementById('expirationdate');
  if (expirationDate && isSale) expirationDate.value = lastInstallmentDate;
}

function updateRentDurationVisibility() {
  const durationContainer = document.getElementById('durationcontainer');
  if (!durationContainer) return;
  const shouldShowDuration = getSelectedExitMode() === 'RENT'
    && !!document.getElementById('unitid')?.value
    && !!document.getElementById('begindate')?.value;
  durationContainer.classList.toggle('hidden', !shouldShowDuration);
}
  
/* -------- FETCH & RENDER FEES -------- */
async function checkrentapropertyunit(el, prefillFees) {
  const unitId = el.value;
  const startDateInput = document.getElementById('begindate');
  const preserveBeginDate = !!rentapropertyid && !!startDateInput?.value;
  if (!preserveBeginDate) {
    saleInstallmentStartDate = '';
    if (startDateInput) startDateInput.value = '';
  } else {
    saleInstallmentStartDate = startDateInput.value;
  }
  const tbody = document.getElementById('rentapropertytable');
  if (!tbody) return; 
  tbody.innerHTML = '';
  updateRentTotalDeposit();

  const feesContainer = document.getElementById('otherfeesview'); 
  if (feesContainer) {
    feesContainer.classList.add('hidden');
    feesContainer.classList.toggle('sale-payment-mode', getSelectedExitMode() === 'SALE');
  }

  if (unitId) {
    hideRentTransactionDetails();
  } else {
    document.querySelectorAll('.remain').forEach(element => element.classList.add('hidden'));
    document.getElementById('saleplan')?.classList.add('hidden');
    document.getElementById('otherfeesview')?.classList.add('hidden');
  }
  
  if (!unitId) {
    return;
  }

  const payload = new FormData();
  payload.append('propertyid', document.getElementById('propertyid').value);
  payload.append('id', unitId);
  const response = await httpRequest2('../controllers/fetchotherfeesforaunit', payload, null, 'json');
  if (!response.status && !(Array.isArray(prefillFees) && prefillFees.length)) {
    notification(response.message || 'Saved fee details are not available yet. You can still review the payment table.', 0);
  }

  await ensureRentFeeDefinitions();
  const apiRows = response.status ? normalizeUnitFeeRows(response.data) : [];
  const rows = Array.isArray(prefillFees) && prefillFees.length ? prefillFees : apiRows;
  if (rows.length) {
    rows.forEach((item, index) => {
      const feeId =
        item.feenameid ?? item.feeid ?? item.morefeesid ?? item.feename_id ??
        rentFeeDefinitions.find(fee => `${fee.feename}`.trim().toUpperCase() === `${item.feename || ''}`.trim().toUpperCase())?.id ?? '';
      addRentFeeRow({
        feeId: feeId ? String(feeId) : '',
        amount: item.amount ?? item.feeamount ?? item.rent ?? '',
        deposit: item.deposit ?? item.amountpaid ?? '',
        discount: item.discount ?? '',
        renewable: (item.renewable ?? item.instalment ?? 'NO').toString().toUpperCase() === 'YES' ? 'YES' : 'NO',
        rentalPeriod: item.rentalperiodmonths ?? item.rentalperiod ?? item.paymentperiod ?? '',
        autoSelectSource: index === 0
      });
    });
  } else {
    // Keep the section usable when API returns no seeded rows
    addRentFeeRow();
  }
  ensureRentDefaultFlatSelection();
  recalculateRentPercentageRows();
  updateRentTotalDeposit();
  if (getSelectedExitMode() === 'SALE') {
    await ensureSaleDiscountRules();
    configureSaleDiscountOptions(prefillFees?.length ? document.getElementById('discount')?.value : '');
  }
  revealRentTransactionDetails();
}

function normalizeUnitFeeRows(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.rows)) return data.rows;
  if (Array.isArray(data.fees)) return data.fees;
  if (Array.isArray(data.otherfees)) return data.otherfees;
  if (Array.isArray(data.unitfees)) return data.unitfees;
  return [];
}

function addRentFeeRow(prefill = {}) {
  const tbody = document.getElementById('rentapropertytable');
  if (!tbody) return null;
  if (!rentFeeDefinitions.length) {
    notification('No fees found please go to settings and add fees', 0);
    return null;
  }

  const id = prefill.rowId || randomId();
  const tr = document.createElement('tr');
  tr.id = id;
  tr.dataset.feeMode = ''; 
  tr.dataset.percentageRate = '';   
  tr.innerHTML = `
    <td>
      <div class="form-group min-w-[150px]">
        <select id="fe-${id}" class="form-control feename-select"></select>
      </div>
    </td> 
    <td>
      <span id="mo-${id}" class="font-semibold uppercase"></span>
    </td>
    <td>
      <div class="form-group min-w-[130px]">        <input type="text" inputmode="decimal" id="ra-${id}" class="form-control amount-input money-input" placeholder="Enter Amount">
      </div>
    </td>
    <td>
      <div class="form-group min-w-[130px]"><input type="text" inputmode="decimal" id="fa-${id}" class="form-control final-amount-input money-input" placeholder="0" readonly></div>
    </td>
    <td class="hidden">     <div class="form-group w-[90px]">
        <select id="rp-${id}" class="form-control rental-period-input">${getDurationOptionsMarkup(prefill.rentalPeriod ?? '')}</select>
      </div>
    </td>
    <td>
      <div class="form-group min-w-[115px]">
        <input type="text" inputmode="decimal" id="de-${id}" class="form-control deposit-input money-input" placeholder="0">
      </div>
    </td>
    <td>
      <div class="form-group min-w-[115px]">
        <input type="text" inputmode="decimal" id="di-${id}" class="form-control discount-input money-input" placeholder="0">
      </div>
    </td>
    <td class="text-center" id="ap-${id}"></td>
    <td>
      <div class="form-group">
        <select id="re-${id}" class="form-control renewable-select">
          <option value="YES">Yes</option>
          <option value="NO">No</option>
        </select>
      </div>
    </td>
    <td>
      <div data-action="remove-rent-row" style="padding: 10px 20px;border-radius: 10px;background: red;width: fit-content; height: fit-content;font-size: larger; color: white;font-weight: bold;">-</div>
    </td>
  `;

  tbody.appendChild(tr);

  const controls = getRentFeeRowControls(id);
  if (!controls.row) return tr;

  populateRentFeeSelect(controls.feeSelect, prefill.feeId ? String(prefill.feeId) : '');
  controls.amount.value = prefill.amount ?? '';
  controls.deposit.value = prefill.deposit ?? '';
  if (prefill.deposit !== undefined && prefill.deposit !== null && `${prefill.deposit}` !== '') {
    tr.dataset.saleDepositEdited = 'true';
  }
  controls.discount.value = prefill.discount ?? '';
  controls.renewable.value = (prefill.renewable ?? 'NO').toString().toUpperCase() === 'YES' ? 'YES' : 'NO';
  controls.rental.value = prefill.rentalPeriod ?? '';

  setupRentRentalPeriodControl(controls.rental);

  controls.feeSelect.addEventListener('change', () => handleRentFeeChange(id));

  const amountHandler = () => handleRentAmountInput(id);
  controls.amount.addEventListener('input', amountHandler);
  controls.amount.addEventListener('keyup', amountHandler);
  controls.amount.addEventListener('change', amountHandler);

  controls.deposit.addEventListener('input', () => {
    controls.row.dataset.saleDepositEdited = 'true';
    handleRentDepositDiscountChange(id, 'deposit');
  });
  controls.discount.addEventListener('input', () => handleRentDepositDiscountChange(id, 'discount'));

  controls.removeButton.addEventListener('click', () => removeRentFeeRow(id));

  handleRentFeeChange(id, {
    isInitialLoad: true,
    initialAmount: prefill.amount,
    autoSelectSource: prefill.autoSelectSource === true
  });

  handleRentDepositDiscountChange(id);
  return tr;
}

function populateRentFeeSelect(select, selectedValue = '') {
  if (!select) return;
  const options = ['<option value="">Select fee</option>'];
  rentFeeDefinitions.forEach((fee) => {
    options.push(`<option value="${fee.id}">${fee.feename}</option>`);
  });
  select.innerHTML = options.join('');
  if (selectedValue) {
    select.value = selectedValue;
  }
}

function getRentFeeRowControls(rowId) {
  const row = document.getElementById(rowId);
  if (!row) return {};
  return {
    row,
    feeSelect: document.getElementById(`fe-${rowId}`),
    modeDisplay: document.getElementById(`mo-${rowId}`),
    amount: document.getElementById(`ra-${rowId}`),
    rental: document.getElementById(`rp-${rowId}`),
    deposit: document.getElementById(`de-${rowId}`),
    discount: document.getElementById(`di-${rowId}`),
    renewable: document.getElementById(`re-${rowId}`),
    applyCell: document.getElementById(`ap-${rowId}`),
    removeButton: row.querySelector('[data-action="remove-rent-row"]')
  };
}

function setupRentRentalPeriodControl(input) {
  if (!input) return;
  input.setAttribute('title', 'Select payment period in months or Not Applicable');
}

function handleRentFeeChange(rowId, options = {}) {
  const controls = getRentFeeRowControls(rowId);
  if (!controls.row || !controls.feeSelect) return;

  const {
    initialAmount = null,
    isInitialLoad = false,
    autoSelectSource = false
  } = options;

  const existingCheckedRadio = document.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]:checked`);
  const previousRadioChecked = controls.applyCell?.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]`)?.checked || false;

  controls.row.dataset.feeMode = '';
  controls.row.dataset.percentageRate = '';
  if (controls.modeDisplay) controls.modeDisplay.textContent = '';
  if (controls.amount) {
    controls.amount.value = initialAmount ?? '';
    controls.amount.readOnly = false;
  }
  if (controls.applyCell) {
    controls.applyCell.innerHTML = '';
  }

  const feeId = controls.feeSelect.value;
  if (!feeId) {
    ensureRentDefaultFlatSelection();
    recalculateRentPercentageRows();
    return;
  }

  const fee = rentFeeDefinitions.find((item) => String(item.id) === feeId);
  if (!fee) {
    ensureRentDefaultFlatSelection();
    recalculateRentPercentageRows();
    return;
  }

  const feeMode = (fee.mode || '').toUpperCase();
  controls.row.dataset.feeMode = feeMode;

  if (feeMode === 'FLAT') {
    if (controls.modeDisplay) {
      controls.modeDisplay.textContent = 'FLAT';
    }
    if (controls.amount) {
      const defaultAmount = parseFloat(fee.amount);
      if (initialAmount !== null && initialAmount !== undefined && initialAmount !== '') {
        controls.amount.value = initialAmount;
      } else if (!Number.isNaN(defaultAmount)) {
        controls.amount.value = defaultAmount;
      } else {
        controls.amount.value = '';
      }
      controls.amount.readOnly = false;
    }

    let shouldCheck = previousRadioChecked;
    if (autoSelectSource) {
      shouldCheck = true;
    } else if (!existingCheckedRadio) {
      shouldCheck = true;
    }

    const radio = renderRentApplyRadio(rowId, controls.applyCell, shouldCheck);
    if (radio) {
      radio.addEventListener('change', () => recalculateRentPercentageRows());
    }
  } else if (feeMode === 'PERCENTAGE') {
    const rate = parseFloat(fee.amount);
    controls.row.dataset.percentageRate = Number.isFinite(rate) ? rate : '';
    if (controls.modeDisplay) {
      controls.modeDisplay.textContent = Number.isFinite(rate) ? `${rate}%` : 'PERCENTAGE';
    }
    if (controls.amount) {
      controls.amount.value = '';
      controls.amount.readOnly = true;
    }
  } else {
    if (controls.modeDisplay) {
      controls.modeDisplay.textContent = fee.mode || '';
    }
  }

  ensureRentDefaultFlatSelection();
  recalculateRentPercentageRows();
}

function renderRentApplyRadio(rowId, cell, checked) {
  if (!cell) return null;
  cell.innerHTML = '';
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = RENT_APPLY_PERCENTAGE_GROUP;
  radio.value = rowId;
  radio.title = 'Use this amount for percentage calculations';
  if (checked) {
    radio.checked = true;
  }
  cell.appendChild(radio);
  return radio;
}

function ensureRentDefaultFlatSelection() {
  const checked = document.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]:checked`);
  if (checked) return;
  const tbody = document.getElementById('rentapropertytable');
  if (!tbody) return;
  const rows = Array.from(tbody.children);
  for (const row of rows) {
    if ((row.dataset.feeMode || '').toUpperCase() === 'FLAT') {
      const radio = row.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]`);
      if (radio) {
        radio.checked = true;
        break;
      }
    }
  }
}

function handleRentAmountInput(rowId) {
  const controls = getRentFeeRowControls(rowId);
  if (!controls.row || !controls.amount) return;
  handleRentDepositDiscountChange(rowId);
  if ((controls.row.dataset.feeMode || '').toUpperCase() !== 'FLAT') return;
  const selectedRadio = document.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]:checked`);
  if (selectedRadio && selectedRadio.value === rowId) {
    recalculateRentPercentageRows();
  }
}

function recalculateRentPercentageRows() {
  const tbody = document.getElementById('rentapropertytable');
  if (!tbody) return;
  const checkedRadio = document.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]:checked`);
  let baseAmount = null;
  if (checkedRadio) {
    const baseControls = getRentFeeRowControls(checkedRadio.value);
    if (baseControls.amount) {
      const parsed = parseMoneyValue(baseControls.amount.value);
      if (!Number.isNaN(parsed)) {
        baseAmount = parsed;
      }
    }
  }

  const rows = Array.from(tbody.children);
  rows.forEach((row) => {
    if ((row.dataset.feeMode || '').toUpperCase() === 'PERCENTAGE') {
      const controls = getRentFeeRowControls(row.id);
      if (!controls.amount) return;
      const rate = parseFloat(row.dataset.percentageRate || '');
      if (baseAmount !== null && Number.isFinite(rate)) {
        const computed = (baseAmount * rate) / 100;
        controls.amount.value = Number.isFinite(computed) ? parseFloat(computed.toFixed(2)).toString() : '';
      } else {
        controls.amount.value = '';
      }
    }
  });
  updateRentTotalDeposit();
}

function removeRentFeeRow(rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const wasSource = !!row.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]:checked`);
  row.remove();
  if (wasSource) {
    ensureRentDefaultFlatSelection();
  }
  recalculateRentPercentageRows();
  updateRentTotalDeposit();
}

function handleRentDepositDiscountChange(rowId, field) {
  const controls = getRentFeeRowControls(rowId);
  if (!controls.row) return;
  const amount = parseMoneyValue(controls.amount.value);
  let deposit = parseMoneyValue(controls.deposit.value);
  let discount = parseMoneyValue(controls.discount.value);
  if (deposit + discount > amount) {
    notification('Deposit + discount cannot exceed fee amount', 0);
    if (field === 'deposit') {
      controls.deposit.value = '';
    } else if (field === 'discount') {
      controls.discount.value = '';
    }
    deposit = parseMoneyValue(controls.deposit.value);
    discount = parseMoneyValue(controls.discount.value);
  }
  updateRentTotalDeposit();
}

function updateRentTotalDeposit() {
  const rows = [...document.querySelectorAll('#rentapropertytable tr')];
  let depositSum = 0;
  let payableSum = 0;
  let hasAnyDeposit = false;

  rows.forEach((row) => {
    const amount = parseMoneyValue(row.querySelector('.amount-input')?.value);
    const deposit = parseMoneyValue(row.querySelector('.deposit-input')?.value);
    const discount = parseMoneyValue(row.querySelector('.discount-input')?.value);
    depositSum += deposit;
    payableSum += Math.max(amount - discount, 0);
    if (deposit > 0) hasAnyDeposit = true;
  });

  const amountPaid = document.getElementById('amountpaid');
  if (amountPaid) {
    if (getSelectedExitMode() === 'SALE') {
      updateSalePlan();
      return;
    }
    const value = hasAnyDeposit ? depositSum : payableSum;
    amountPaid.value = value ? value.toString() : '';
  }
  if (['SALE', 'RENT'].includes(getSelectedExitMode())) updateSalePlan();
}

/* -------- FEE TABLE EVENTS & VALIDATION -------- */
/* -------- DATE CALCULATION -------- */
function rentapropertydate(months, begin, el) {
  if (months === RENT_NOT_APPLICABLE_DURATION) {
    document.getElementById('expirationdate').value = '';
    return;
  }
  if (!begin) {
    notification('You must state the begin date', 0);
    return el.value = '';
  }
  const d = new Date(begin);
  if (isNaN(d)) {
    notification('Invalid begin date', 0);
    return el.value = '';
  }
  d.setMonth(d.getMonth() + Number(months));
  const mm = ('0' + (d.getMonth() + 1)).slice(-2);
  const dd = ('0' + d.getDate()).slice(-2);
  document.getElementById('expirationdate').value =
    `${d.getFullYear()}-${mm}-${dd}`;
}

/* -------- FORM SUBMIT -------- */
async function rentapropertysubmit(submissionAction = 'COMPLETE') {
  const formData = new FormData(document.querySelector('#rentapropertyform'));
  const exitMode = getSelectedExitMode();
  const recordId = rentapropertyid || document.getElementById('id')?.value || '';
  if (!exitMode) {
    return notification('Select Renting or Selling before choosing a unit', 0);
  }
  if (!document.getElementById('begindate')?.value) {
    return notification('Select a begin date before continuing with this transaction.', 0);
  }
  if (recordId) formData.set('id', recordId);
  formData.set('exitmode', exitMode);
  updateSalePlan();
  const saleFeeRow = exitMode === 'SALE' ? getSaleFeeTableRow() : null;

  const transactionDiscount = parseMoneyValue(document.getElementById('discount')?.value);
  const transactionApprovalStatus = `${document.getElementById('discountapprovalstatus')?.value || 'NOT_REQUIRED'}`.toUpperCase();
  if (exitMode === 'RENT') {
    if (submissionAction === 'COMPLETE' && transactionDiscount > 0 && transactionApprovalStatus !== 'APPROVED') {
      return notification('This rental discount must be approved by the MD or approving officer before completing the rental', 0);
    }
    formData.set('discount', transactionDiscount.toString());
    formData.set('totalamount', document.getElementById('totalamount')?.value || '');
  }

  if (exitMode === 'SALE') {
    updateSalePlan();
    const pricingType = selectedSalePricingType();
    const pricingValue = selectedSalePricingValue();
    const saleDiscount = pricingType === 'DISCOUNT' ? pricingValue : 0;
    const salePadding = pricingType === 'PADDING' ? pricingValue : 0;
    const approvalStatus = `${document.getElementById('discountapprovalstatus')?.value || 'NOT_REQUIRED'}`.toUpperCase();
    const installmentCount = Number.parseInt(document.getElementById('installmentcount')?.value || '', 10);
    const installmentRows = [...document.querySelectorAll('#saleinstallmentrows .sale-installment-card')];
    if (submissionAction === 'COMPLETE' && saleDiscount > 0 && approvalStatus !== 'APPROVED') {
      return notification('This discount must be approved by the MD or approving officer before completing the sale', 0);
    }
    if (!Number.isInteger(installmentCount) || installmentCount < 1 || installmentRows.length !== installmentCount) {
      return notification('Enter the number of instalments and review the generated schedule', 0);
    }
    if (installmentRows.some(row => !row.querySelector('.sale-installment-due-date')?.value)) {
      return notification('Select a due date for every instalment', 0);
    }
    formData.set('discount', saleDiscount.toString());
    formData.set('padding', salePadding.toString());
    formData.set('pricingtype', pricingType);
    formData.set('rent', document.getElementById('baseamount')?.value || '');
    formData.set('totalamount', document.getElementById('totalamount')?.value || '');
    formData.set('numberofinstalment', installmentRows.length.toString());
    installmentRows.forEach((row, index) => {
      const number = index + 1;
      formData.set(`instalmentamount${number}`, row.querySelector('.sale-installment-amount')?.value || '');
      const dueDate = row.querySelector('.sale-installment-due-date')?.value || '';
      formData.set(`duedate${number}`, dueDate);
      formData.set(`whichinstalment${number}`, number.toString());
    });
  }

  // Dependants
  const deps = [...document.querySelectorAll('#dependantTableBody tr')];
  formData.set('dependentrows', deps.length);
  deps.forEach((r, i) => {
    const idx = i + 1, cells = r.cells;
    const raw = cells[0].innerText.replace('account_circle','').trim();
    formData.set(`fullname${idx}`,   raw);
    formData.set(`phone${idx}`,      cells[1].innerText.trim());
    formData.set(`occupation${idx}`, cells[2].innerText.trim());
    const b = cells[3].querySelector('span');
    formData.set(
      `relationship${idx}`,
      b ? b.innerText.trim() : cells[3].innerText.trim()
    );
  });

  // Fees
  const fees = [...document.querySelectorAll('#rentapropertytable tr')];
  const approvalFees = fees.map(row => ({
    feenameid: row.querySelector('.feename-select')?.value || '',
    amount: row.querySelector('.amount-input')?.value || '',
    deposit: row.querySelector('.deposit-input')?.value || '',
    discount: row.querySelector('.discount-input')?.value || '',
    renewable: row.querySelector('.renewable-select')?.value || 'NO',
    rentalperiod: row.querySelector('.rental-period-input')?.value || ''
  }));
  if (!fees.length) {
    return notification('Add at least one fee before submitting', 0);
  }
  formData.set('rowcount', fees.length);
  const saleDiscountForFees = exitMode === 'SALE' && selectedSalePricingType() === 'DISCOUNT' ? (document.getElementById('discount')?.value || '') : '';
  fees.forEach((r, i) => {
    const idx = i + 1;
    formData.set(`feenameid${idx}`, r.querySelector('.feename-select').value);
    formData.set(`amount${idx}`, r.querySelector('.amount-input').value.trim());
    formData.set(`deposit${idx}`, r.querySelector('.deposit-input').value.trim());
    formData.set(`discount${idx}`, r === saleFeeRow ? saleDiscountForFees : r.querySelector('.discount-input').value.trim());
    formData.set(`renewable${idx}`, r.querySelector('.renewable-select').value);
  });
  if (exitMode === 'SALE') {
    const depositPaid = fees.reduce((sum, row) => sum + parseMoneyValue(row.querySelector('.deposit-input')?.value), 0);
    formData.set('amountpaid', depositPaid.toString());
  }

  // if the id tenantid input is empty then set tenant to YES else set it to empty string
  if(document.getElementById('tenantid').value == ""){
    formData.set('tenantid', "YES")
  }else{
    formData.set('tenantid', document.getElementById('tenantid').value)
  }

  const btn = document.querySelector(`#rentapropertyform #${submissionAction === 'SEND_APPROVAL' ? 'sendapproval' : 'submit'}`);
  const res = await httpRequest2(
    submissionAction === 'SEND_APPROVAL' ? '../controllers/sendsalesforapproval' : '../controllers/rentapropertyscript',
    formData,
    btn
  );
  // if (res.status) notification('Record saved successfully!', 1); and also did click on rentaproperty
  if (res.status) {
    notification(submissionAction === 'SEND_APPROVAL' ? 'Sale sent for MD approval' : 'Record saved successfully!', 1);
    if (submissionAction === 'SEND_APPROVAL') {
      const approvalId = res.data?.rentdata?.id ?? res.data?.id ?? res.id;
      if (approvalId) sessionStorage.setItem(`propertySaleFees:${approvalId}`, JSON.stringify(approvalFees));
      sessionStorage.setItem(`propertySaleFees:${formData.get('tenantid')}:${formData.get('propertyid')}:${formData.get('unitid')}`, JSON.stringify(approvalFees));
      const approvalStatus = document.getElementById('discountapprovalstatus');
      if (approvalStatus) approvalStatus.value = 'PENDING';
      const approvalSubmitted = document.getElementById('discountapprovalsubmitted');
      if (approvalSubmitted) approvalSubmitted.value = 'YES';
      updateSalePlan();
    } else {
      const depositPaid = fees.reduce((sum, row) => sum + parseMoneyValue(row.querySelector('.deposit-input')?.value), 0);
      if (depositPaid > 0) {
        AvataReceipts.offer({ kind: exitMode === 'SALE' ? 'Sale' : 'Rental', amount: depositPaid,
          transactionDate: formData.get('paymentdate'), ...AvataReceipts.savedDetails(res),
          client: AvataReceipts.selectedText('#tenantid'),
          property: AvataReceipts.selectedText('#propertyid'), unit: AvataReceipts.selectedText('#unitid'),
          description: 'Initial payment / deposit' });
      }
      document.getElementById('rentaproperty').click();
    }
  } else notification(res.message, 0);

}

document.addEventListener('input', (e) => {
  const target = e.target;
  if (!target || target.tagName !== 'INPUT') return;
  if (target.id && target.id.startsWith('ra-')) {
    const row = target.closest('tr');
    if (!row) return;
    if ((row.dataset.feeMode || '').toUpperCase() !== 'FLAT') return;
    const checkedRadio = document.querySelector(`input[name="${RENT_APPLY_PERCENTAGE_GROUP}"]:checked`);
    if (checkedRadio && checkedRadio.value === row.id) {
      recalculateRentPercentageRows();
    }
  }
}, true);

document.addEventListener('input', (e) => {
  if (e.target?.id === 'discount') {
    const discount = selectedSalePricingType() === 'DISCOUNT' ? (parseFloat(e.target.value) || 0) : 0;
    const approvalStatus = document.getElementById('discountapprovalstatus');
    const approvalSubmitted = document.getElementById('discountapprovalsubmitted');
    if (approvalStatus) approvalStatus.value = discount > 0 ? 'PENDING' : 'NOT_REQUIRED';
    if (approvalSubmitted) approvalSubmitted.value = 'NO';
    updateSalePlan();
  }
  if (e.target?.id === 'installmentcount') updateSalePlan();
}, true);


