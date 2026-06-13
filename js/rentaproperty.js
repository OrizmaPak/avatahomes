let rentapropertyid;
let rentapropertyresult;
let rentFeeDefinitions = [];
const RENT_APPLY_PERCENTAGE_GROUP = 'rentaproperty-apply-percent';
const NOT_APPLICABLE_DURATION = 'NOT APPLICABLE';

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
  const options = [
    { value: '', label: 'Select payment period' },
    { value: NOT_APPLICABLE_DURATION, label: 'Not Applicable' },
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
  return options.map(option => `<option value="${option.value}" ${String(selectedValue) === option.value ? 'selected' : ''}>${option.label}</option>`).join('');
}

function getRentAddRowButton() {
  return document.getElementById('rentapropertyaddrow');
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
  const form = document.querySelector('#rentapropertyform');
  form.querySelector('#submit')
      .addEventListener('click', rentapropertysubmit);

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
    document.getElementById('propertyid').innerHTML =
      `<option value="">-- Select Property --</option>` +
      pRes.data.map(d =>
        `<option value="${d.property.id}">${d.property.propertyname}</option>`
      ).join('');
  } else {
    return notification('Unable to retrieve properties, please reload.', 0);
  }

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
    const r = await httpRequest2('../controllers/fetchrentaproperty', payload, null, 'json');
    if (r.status && r.data.length) {
      const record = r.data[0];
      populateData(record.rentdata);

      const propertySelect = document.getElementById('propertyid');
      if (propertySelect) {
        propertySelect.value = record.rentdata.propertyid;
        await checkrentapropertyproperty(propertySelect);
      }

      const unitSelect = document.getElementById('unitid');
      if (unitSelect) {
        unitSelect.value = record.rentdata.unitid;
        await checkrentapropertyunit(unitSelect, record.rentalfees || []);
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
          durationInput.value = NOT_APPLICABLE_DURATION;
        }
      }
      const managerInput = document.getElementById('propertymanager');
      if (managerInput) {
        managerInput.value = record.tenant;
      }
    } else {
      return notification(r.message || 'Error fetching record', 0);
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
  const payload = new FormData();
  payload.append('id', pid);
  const r = await httpRequest2('../controllers/fetchrenewableunits', payload, null, 'json');
  if (!r.status || !r.data.length) {
    notification(r.message||'No units found', 0);
    document.getElementById('unitt').classList.add('hidden');
    return;
  }
  document.getElementById('unitt').classList.remove('hidden');
  rentapropertyresult = r.data;
  document.getElementById('unitid').innerHTML =
    `<option value="">-- Select Property Unit --</option>` +
    r.data.map(d =>
      `<option value="${d.id}">${d.unitname} ₦${Number(d.rent).toLocaleString()}</option>`
    ).join('');
}
  
/* -------- FETCH & RENDER FEES -------- */
async function checkrentapropertyunit(el, prefillFees) {
  const unitId = el.value;
  const tbody = document.getElementById('rentapropertytable');
  if (!tbody) return; 
  tbody.innerHTML = '';
  updateRentTotalDeposit();

  const feesContainer = document.getElementById('otherfeesview'); 
  if (feesContainer) {
    feesContainer.classList.add('hidden');
  }

  document.querySelectorAll('.remain')
          .forEach(elm => elm.classList[unitId ? 'remove' : 'add']('hidden'));
  
  if (!unitId) {
    return;
  }

  const payload = new FormData();
  payload.append('propertyid', document.getElementById('propertyid').value);
  payload.append('id', unitId);
  const response = await httpRequest2('../controllers/fetchotherfeesforaunit', payload, null, 'json');
  if (!response.status) {
    return notification(response.message, 0);
  }

  await ensureRentFeeDefinitions();
  if (feesContainer) {   
    feesContainer.classList.remove('hidden'); 
  }

  const apiRows = normalizeUnitFeeRows(response.data);
  const rows = Array.isArray(prefillFees) && prefillFees.length ? prefillFees : apiRows;
  if (rows.length) {
    rows.forEach((item, index) => {
      const feeId =
        item.feenameid ?? item.feeid ?? item.morefeesid ?? item.id ?? item.feename_id ?? '';
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
      <div class="form-group min-w-[130px]">        <input type="number" id="ra-${id}" class="form-control amount-input" placeholder="Enter Amount">
      </div>
    </td>
    <td class="hidden">     <div class="form-group w-[90px]">
        <select id="rp-${id}" class="form-control rental-period-input">${getDurationOptionsMarkup(prefill.rentalPeriod ?? '')}</select>
      </div>
    </td>
    <td>
      <div class="form-group min-w-[115px]">
        <input type="number" id="de-${id}" class="form-control deposit-input" placeholder="0">
      </div>
    </td>
    <td>
      <div class="form-group min-w-[115px]">
        <input type="number" id="di-${id}" class="form-control discount-input" placeholder="0">
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
  controls.discount.value = prefill.discount ?? '';
  controls.renewable.value = (prefill.renewable ?? 'NO').toString().toUpperCase() === 'YES' ? 'YES' : 'NO';
  controls.rental.value = prefill.rentalPeriod ?? '';

  setupRentRentalPeriodControl(controls.rental);

  controls.feeSelect.addEventListener('change', () => handleRentFeeChange(id));

  const amountHandler = () => handleRentAmountInput(id);
  controls.amount.addEventListener('input', amountHandler);
  controls.amount.addEventListener('keyup', amountHandler);
  controls.amount.addEventListener('change', amountHandler);

  controls.deposit.addEventListener('input', () => handleRentDepositDiscountChange(id, 'deposit'));
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
      const parsed = parseFloat(baseControls.amount.value);
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
  const amount = parseFloat(controls.amount.value) || 0;
  let deposit = parseFloat(controls.deposit.value) || 0;
  let discount = parseFloat(controls.discount.value) || 0;
  if (deposit + discount > amount) {
    notification('Deposit + discount cannot exceed fee amount', 0);
    if (field === 'deposit') {
      controls.deposit.value = '';
    } else if (field === 'discount') {
      controls.discount.value = '';
    }
    deposit = parseFloat(controls.deposit.value) || 0;
    discount = parseFloat(controls.discount.value) || 0;
  }
  updateRentTotalDeposit();
}

function updateRentTotalDeposit() {
  const rows = [...document.querySelectorAll('#rentapropertytable tr')];
  let depositSum = 0;
  let payableSum = 0;
  let hasAnyDeposit = false;

  rows.forEach((row) => {
    const amount = parseFloat(row.querySelector('.amount-input')?.value) || 0;
    const deposit = parseFloat(row.querySelector('.deposit-input')?.value) || 0;
    const discount = parseFloat(row.querySelector('.discount-input')?.value) || 0;
    depositSum += deposit;
    payableSum += Math.max(amount - discount, 0);
    if (deposit > 0) hasAnyDeposit = true;
  });

  const amountPaid = document.getElementById('amountpaid');
  if (amountPaid) {
    const value = hasAnyDeposit ? depositSum : payableSum;
    amountPaid.value = value ? value.toString() : '';
  }
}

/* -------- FEE TABLE EVENTS & VALIDATION -------- */
/* -------- DATE CALCULATION -------- */
function rentapropertydate(months, begin, el) {
  if (months === NOT_APPLICABLE_DURATION) {
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
async function rentapropertysubmit() {
  const formData = new FormData(document.querySelector('#rentapropertyform'));

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
  if (!fees.length) {
    return notification('Add at least one fee before submitting', 0);
  }
  formData.set('rowcount', fees.length);
  fees.forEach((r, i) => {
    const idx = i + 1;
    formData.set(`feenameid${idx}`, r.querySelector('.feename-select').value);
    formData.set(`amount${idx}`,    r.querySelector('.amount-input').value.trim());


    formData.set(`deposit${idx}`,   r.querySelector('.deposit-input').value.trim());
    formData.set(`discount${idx}`,  r.querySelector('.discount-input').value.trim());
    formData.set(`renewable${idx}`, r.querySelector('.renewable-select').value);
  });

  // if the id tenantid input is empty then set tenant to YES else set it to empty string
  if(document.getElementById('tenantid').value == ""){
    formData.set('tenantid', "YES")
  }else{
    formData.set('tenantid', document.getElementById('tenantid').value)
  }

  const btn = document.querySelector('#rentapropertyform #submit');
  const res = await httpRequest2(
    '../controllers/rentapropertyscript',
    formData,
    btn
  );
  // if (res.status) notification('Record saved successfully!', 1); and also did click on rentaproperty
  if (res.status) {notification('Record saved successfully!', 1);document.getElementById('rentaproperty').click();}else notification(res.message, 0);

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


