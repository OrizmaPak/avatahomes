(function () {
  let organisationPromise;

  const escape = value => `${value ?? ''}`.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const amount = value => {
    const number = Number(`${value ?? 0}`.replace(/,/g, ''));
    return Number.isFinite(number) ? number : 0;
  };
  const money = value => `₦${amount(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const date = value => {
    if (!value) return 'Not supplied';
    const parsed = new Date(`${value}`.replace(' ', 'T'));
    return Number.isNaN(parsed.getTime()) ? escape(value) : escape(parsed.toLocaleString('en-NG', { dateStyle: 'medium', ...(`${value}`.includes(':') ? { timeStyle: 'short' } : {}) }));
  };
  const selectedText = selector => document.querySelector(selector)?.selectedOptions?.[0]?.textContent?.trim() || '';

  async function organisation() {
    if (!organisationPromise) {
      organisationPromise = fetch('../controllers/fetchorganisationscript')
        .then(response => response.json())
        .then(response => {
          if (!response?.status) return {};
          const candidates = [
            response?.data?.data?.data?.[0],
            response?.data?.data?.[0],
            response?.data?.[0],
            response?.data?.data,
            response?.data
          ];
          return candidates.find(item => item && typeof item === 'object' && !Array.isArray(item)) || {};
        })
        .catch(() => ({}));
    }
    return organisationPromise;
  }

  function logoUrl(org) {
    const logo = `${org?.logo || ''}`.trim();
    if (logo && logo !== '-' && !logo.includes('..')) {
      return new URL(`../controllers/storage/${encodeURIComponent(logo)}`, location.href).href;
    }
    return new URL('./images/icon.png', location.href).href;
  }

  function receiptHtml(receipt, org) {
    const printedAt = new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
    const details = [
      ['Client / payer', receipt.client], ['Property', receipt.property], ['Unit', receipt.unit],
      ['Payment date', date(receipt.transactionDate)], ['Recorded at', receipt.recordedAt ? date(receipt.recordedAt) : undefined],
      ['Reference', receipt.reference],
      ['Payment method', receipt.method], ['Sale ID', receipt.saleId], ['Record ID', receipt.recordId]
    ].filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== '');
    const lines = (receipt.items?.length ? receipt.items : [{ description: receipt.description || receipt.kind || 'Payment', amount: receipt.amount }])
      .map(item => `<tr><td>${escape(item.description || 'Payment')}</td><td>${money(item.amount)}</td></tr>`).join('');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(receipt.kind || 'Payment')} receipt</title>
      <style>
        @page{size:A4;margin:15mm}*{box-sizing:border-box}body{margin:0;background:#f5f2e9;color:#27312c;font-family:Arial,sans-serif}.toolbar{max-width:760px;margin:18px auto;display:flex;justify-content:flex-end}.toolbar button{border:0;border-radius:8px;padding:11px 20px;background:#9c761e;color:#fff;font-weight:700;cursor:pointer}.sheet{max-width:760px;margin:0 auto 30px;background:#fff;padding:42px 48px;box-shadow:0 16px 45px #5145271c;border-top:7px solid #c9a227}.brand{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e9e2d3;padding-bottom:24px}.brand img{width:68px;height:68px;object-fit:contain}.brand h1{font-size:20px;letter-spacing:.04em;margin:0;color:#695016}.brand p{margin:5px 0 0;font-size:12px;color:#66706a}.eyebrow{color:#a27d20;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.heading{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;padding:32px 0 22px}.heading h2{font-size:30px;margin:5px 0}.heading small{color:#68736b}.amount{font-size:27px;font-weight:800;color:#1d6a51;text-align:right}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;padding:20px;background:#faf8f1;border:1px solid #eee6d4;border-radius:12px}.grid span{display:block;color:#788077;font-size:11px;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}.grid strong{font-size:13px;font-weight:600;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;margin-top:28px}th{text-align:left;background:#f1eee5;color:#59635c;font-size:11px;text-transform:uppercase;letter-spacing:.08em}td,th{padding:13px 14px;border-bottom:1px solid #eee9dd}td:last-child,th:last-child{text-align:right}.total{display:flex;justify-content:space-between;margin-top:15px;padding:18px 14px;border-top:2px solid #c9a227;font-size:18px;font-weight:800}.footer{margin-top:55px;border-top:1px solid #e9e2d3;padding-top:18px;color:#788077;font-size:11px;display:flex;justify-content:space-between;gap:20px}.footer strong{color:#6d551c}@media(max-width:600px){.sheet{padding:24px 18px}.heading{display:block}.amount{text-align:left}.grid{grid-template-columns:1fr}.footer{display:block}}@media print{body{background:#fff}.toolbar{display:none}.sheet{max-width:none;box-shadow:none;margin:0;padding:0;border-top:0}}
      </style></head><body><div class="toolbar"><button onclick="window.print()">Print receipt</button></div><main class="sheet"><div class="brand"><img src="${escape(logoUrl(org))}" alt="Avata Homes logo" onerror="this.onerror=null;this.src='${escape(new URL('./images/icon.png', location.href).href)}'"><div><h1>${escape(org?.companyname || 'AVATA HOMES')}</h1><p>${escape(org?.address || '')}</p><p>${escape([org?.telephone || org?.mobile, org?.email].filter(Boolean).join(' · '))}</p></div></div><div class="heading"><div><span class="eyebrow">Payment confirmation</span><h2>${escape(receipt.kind || 'Payment')} receipt</h2><small>${receipt.reference ? `Reference ${escape(receipt.reference)}` : 'Reference not supplied'}</small></div><div class="amount">${money(receipt.amount)}</div></div><div class="grid">${details.map(([label, value]) => `<div><span>${escape(label)}</span><strong>${['Payment date', 'Recorded at'].includes(label) ? value : escape(value)}</strong></div>`).join('')}</div><table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody>${lines}</tbody></table><div class="total"><span>${receipt.kind === 'Expense' ? 'Amount paid out' : 'Amount received'}</span><span>${money(receipt.amount)}</span></div><div class="footer"><span>Printed ${escape(printedAt)}. Thank you.</span><strong>avatahomes.com</strong></div></main></body></html>`;
  }

  async function open(receipt) {
    if (!(amount(receipt?.amount) > 0)) return notification('No paid amount is available for this receipt.', 0);
    document.getElementById('avata-receipt-modal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'avata-receipt-modal';
    overlay.innerHTML = `<div class="avata-receipt-dialog" role="dialog" aria-modal="true" aria-label="Payment receipt">
      <div class="avata-receipt-dialog-header"><div><span>AVATA HOMES</span><h2>Payment receipt</h2></div><button type="button" data-receipt-close aria-label="Close receipt">×</button></div>
      <div class="avata-receipt-dialog-body"><div class="avata-receipt-loader" role="status"><span class="avata-receipt-spinner"></span>Loading receipt…</div><iframe title="Receipt preview" hidden></iframe></div>
      <div class="avata-receipt-dialog-actions"><button type="button" data-receipt-download disabled>Download PDF</button><button type="button" data-receipt-print disabled>Print receipt</button></div>
    </div>`;
    document.body.appendChild(overlay);
    const frame = overlay.querySelector('iframe');
    const loader = overlay.querySelector('.avata-receipt-loader');
    const printButton = overlay.querySelector('[data-receipt-print]');
    const downloadButton = overlay.querySelector('[data-receipt-download]');
    const close = () => { overlay.remove(); document.removeEventListener('keydown', onKeyDown); };
    const onKeyDown = event => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', onKeyDown);
    overlay.querySelector('[data-receipt-close]').addEventListener('click', close);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    printButton.addEventListener('click', () => { frame.contentWindow.focus(); frame.contentWindow.print(); });
    downloadButton.addEventListener('click', async () => {
      downloadButton.disabled = true;
      downloadButton.textContent = 'Preparing PDF…';
      try {
        if (!frame.contentWindow.html2pdf) {
          await new Promise((resolve, reject) => {
            const script = frame.contentDocument.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = reject;
            frame.contentDocument.head.appendChild(script);
          });
        }
        const filename = `avata-receipt-${`${receipt.reference || receipt.kind || 'payment'}`.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}.pdf`;
        await frame.contentWindow.html2pdf().set({ margin: 10, filename, image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } })
          .from(frame.contentDocument.querySelector('.sheet')).save();
      } catch (error) {
        notification('Unable to create the PDF. Please use Print and choose Save as PDF.', 0);
      } finally {
        downloadButton.disabled = false;
        downloadButton.textContent = 'Download PDF';
      }
    });
    try {
      const org = await organisation();
      if (!overlay.isConnected) return;
      frame.addEventListener('load', () => {
        frame.contentDocument.querySelector('.toolbar')?.remove();
        loader.hidden = true;
        frame.hidden = false;
        printButton.disabled = false;
        downloadButton.disabled = false;
      }, { once: true });
      frame.srcdoc = receiptHtml(receipt, org);
    } catch (error) {
      loader.textContent = 'Unable to load this receipt. Please try again.';
    }
  }

  function offer(receipt) {
    if (!(amount(receipt?.amount) > 0)) return;
    document.getElementById('avata-receipt-offer')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'avata-receipt-offer';
    overlay.innerHTML = `<div class="avata-receipt-offer-card" role="dialog" aria-modal="true" aria-label="Payment receipt"><div class="avata-receipt-offer-icon">✓</div><h2>Payment recorded</h2><p>${money(receipt.amount)} has been saved. View, print or download the receipt.</p><div><button type="button" data-receipt-later>Later</button><button type="button" data-receipt-print>View receipt</button></div></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('[data-receipt-later]').addEventListener('click', () => overlay.remove());
    overlay.querySelector('[data-receipt-print]').addEventListener('click', () => { open(receipt); overlay.remove(); });
  }

  function fromSale(record) {
    const sale = record?.rentdata || {};
    const fees = Array.isArray(record?.rentalfees) ? record.rentalfees : [];
    const deposits = fees.filter(fee => fee.deposit !== undefined && fee.deposit !== null);
    const paid = deposits.length ? deposits.reduce((sum, fee) => sum + amount(fee.deposit), 0) : amount(sale.amountpaid);
    return { kind: `${sale.exitmode || 'SALE'}`.toUpperCase() === 'SALE' ? 'Sale' : 'Rental', amount: paid,
      client: record?.tenant, property: record?.property, unit: record?.unitname, saleId: sale.id,
      transactionDate: sale.paymentdate, recordedAt: sale.created_at, reference: sale.reference,
      description: deposits.length ? 'Initial payment / deposit' : 'Amount paid on transaction record' };
  }

  function fromLedger(item, kind = 'Payment') {
    return { kind, amount: kind === 'Expense' ? item?.debit : item?.credit,
      client: [item?.firstname, item?.lastname].filter(Boolean).join(' ') || undefined,
      property: item?.propertyname, transactionDate: item?.transactiondate, recordedAt: item?.created_at, reference: item?.reference,
      description: item?.description || (kind === 'Expense' ? 'Expense payment' : 'Payment received'), method: item?.paymentmethod };
  }

  function savedDetails(response) {
    const data = (Array.isArray(response?.data) ? response.data[0] : response?.data?.rentdata || response?.data) || {};
    return { reference: data.reference || response?.reference, recordedAt: data.created_at || data.updated_at,
      recordId: data.id };
  }

  window.AvataReceipts = { open, offer, fromSale, fromLedger, savedDetails, selectedText, amount };
})();
