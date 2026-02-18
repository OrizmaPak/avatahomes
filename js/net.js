async function netActive() {
  const form = document.querySelector('#netform');
  if (form?.querySelector('#submit')) {
    form.querySelector('#submit').addEventListener('click', fetchnet);
  }
  await fetchnet();
}

async function fetchnet() {
  const payload = getFormData2(document.querySelector('#netform'));
  const request = await httpRequest2(
    '../controllers/netiotransactions',
    payload,
    document.querySelector('#netform #submit'),
    'json'
  );

  if (request?.status && Array.isArray(request.data)) {
    populateDatass(request.data);
  } else {
    notification('No records retrieved');
  }
}

function populateDatass(segments) {
  const tbody = document.querySelector('#netTable tbody');
  tbody.innerHTML = '';

  let grandDebit  = 0;
  let grandCredit = 0;

  segments.forEach(segment => {
    const items = segment.data || [];
    if (!items.length) return;

    const feeName = items[0].feename || 'Unnamed Fee';

    // We'll accumulate subtotals from the *visible* values:
    let subtotalDebit  = 0;
    let subtotalCredit = 0;

    // 1) Fee‐name header row
    const hdr = document.createElement('tr');
    hdr.innerHTML = `
      <td></td>
      <td style="font-weight:bold;text-align:left; padding:6px 8px; border-top:0.3px solid #ccc;">
        ${feeName}
      </td>
      <td style="border-top:0.3px solid #ccc;"></td>
      <td style="border-top:0.3px solid #ccc;"></td>
    `;
    tbody.appendChild(hdr);

    // 2) Individual items
    items.forEach(item => {
      const rawDebit  = parseFloat(item.debit)  || 0;
      const rawCredit = parseFloat(item.credit) || 0;
      let visibleDebit  = 0;
      let visibleCredit = 0;
      let debitCell  = '';
      let creditCell = '';

      if (item.accountname === 'RECEIVABLES') {
        visibleCredit = rawCredit;
        creditCell    = rawCredit ? formatNumber(rawCredit) : '';
      } else if (item.accountname === 'PAYABLES') {
        visibleDebit = rawDebit;
        debitCell    = rawDebit ? formatNumber(rawDebit) : '';
      } else {
        visibleDebit  = rawDebit;
        visibleCredit = rawCredit;
        debitCell     = rawDebit  ? formatNumber(rawDebit)  : '';
        creditCell    = rawCredit ? formatNumber(rawCredit) : '';
      }

      subtotalDebit  += visibleDebit;
      subtotalCredit += visibleCredit;
      grandDebit     += visibleDebit;
      grandCredit    += visibleCredit;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td></td>
        <td style="padding:4px 8px;text-align:left">${item.description || ''}</td>
        <td style="text-align:right; padding:4px 8px;">
          ${debitCell}
        </td>
        <td style="text-align:right; padding:4px 8px;">
          ${creditCell}
        </td>
      `;
      tbody.appendChild(row);
    });

    // 3) Subtotal row (uses the visible subtotals)
    const sub = document.createElement('tr');
    sub.innerHTML = `
      <td></td>
      <td style="font-weight:bold; padding:6px 8px; border-bottom:1px solid #ccc;">
        ${feeName} SUB TOTAL
      </td>
      <td style="text-align:right; font-weight:bold; padding:6px 8px; border-bottom:1px solid #ccc;">
        ${formatNumber(subtotalDebit)}
      </td>
      <td style="text-align:right; font-weight:bold; padding:6px 8px; border-bottom:1px solid #ccc;">
        ${formatNumber(subtotalCredit)}
      </td>
    `;
    tbody.appendChild(sub);
  });

  // 4) Grand totals (now reflect only visible values)
  document.getElementById('grand-debit' ).textContent = formatNumber(grandDebit);
  document.getElementById('grand-credit').textContent = formatNumber(grandCredit);

  const totalInflow  = grandCredit; // credit = inflow
  const totalOutflow = grandDebit;  // debit  = outflow
  const net = totalInflow - totalOutflow;

  document.getElementById('total-inflow' ).textContent = formatNumber(totalInflow);
  document.getElementById('total-outflow').textContent = formatNumber(totalOutflow);
  document.getElementById('total-net'     ).textContent = formatNumber(net);
}



// your existing helpers
function formatNumber(n) {
  if (isNaN(n)) {
    return '0'; 
  }
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
 