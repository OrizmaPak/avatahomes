<section id="installmentPaymentsPage" class="animate__animated animate__fadeIn installment-payments-page">
    <div class="installment-payments-heading">
        <div><p class="page-title"><span>Installment Payments</span></p><p class="installment-payments-subtitle">View remaining payments and record the next instalment for a client.</p></div>
        <div class="flex items-center gap-2">
            <button type="button" class="btn" style="background:#006E7093" onclick="printTable('installmentPaymentsExportTable', 'AVATA HOMES Installment Payments')"><span class="material-symbols-outlined">print</span> Print</button>
            <button type="button" class="btn" style="background:#00703293" onclick="exportToExcel('installmentPaymentsExportTable', 'avata-homes-installment-payments')"><span class="material-symbols-outlined">download</span> Export</button>
            <button type="button" id="installmentPaymentsRefresh" class="btn"><span class="material-symbols-outlined">refresh</span> Refresh</button>
        </div>
    </div>
    <div class="installment-payments-toolbar">
        <label>Search client, property or unit<input id="installmentPaymentsSearch" class="form-control" type="search" placeholder="Start typing to search"></label>
        <label>Payment status<select id="installmentPaymentsStatus" class="form-control"><option value="REMAINING">Remaining payments</option><option value="ALL">All instalments</option></select></label>
    </div>
    <div id="installmentPaymentsMessage" class="installment-payments-message" role="status">Loading installment schedules...</div>
    <div class="table-content installment-payments-table-wrap"><table id="installmentPaymentsExportTable"><thead><tr><th>S/N</th><th>Client</th><th>Property</th><th>Unit</th><th>Mode</th><th>Instalment</th><th>Due date</th><th>Scheduled amount</th><th>Amount paid</th><th>Status</th><th>Action</th></tr></thead><tbody id="installmentPaymentsTable"><tr><td colspan="11">Loading...</td></tr></tbody></table></div>
</section>
