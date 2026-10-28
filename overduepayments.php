<section id="salesPaymentReport" class="animate__animated animate__fadeIn sales-payment-report" data-report="overduepayments">
    <div class="sales-payment-report-heading">
        <div><p class="page-title"><span>Overdue Payments</span></p><p class="sales-payment-report-subtitle">Sales instalments past their due date.</p></div>
        <div class="sales-payment-report-actions">
            <button type="button" class="btn" style="background:#006E7093" onclick="printTable('salesPaymentReportTable', 'AVATA HOMES Overdue Payments')"><span class="material-symbols-outlined">print</span> Print</button>
            <button type="button" class="btn" style="background:#00703293" onclick="exportToExcel('salesPaymentReportTable', 'avata-homes-overdue-payments')"><span class="material-symbols-outlined">download</span> Export</button>
            <button type="button" id="salesPaymentReportRefresh" class="btn"><span class="material-symbols-outlined">refresh</span> Refresh</button>
        </div>
    </div>
    <div class="sales-payment-report-toolbar"><label>Search sales or payment records<input id="salesPaymentReportSearch" class="form-control" type="search" placeholder="Search client, property, unit or status"></label></div>
    <div id="salesPaymentReportMessage" class="sales-payment-report-message" role="status">Loading overdue payments...</div>
    <div class="table-content sales-payment-report-table-wrap"><table id="salesPaymentReportTable"><thead><tr><th>S/N</th><th>Client</th><th>Property</th><th>Property ID</th><th>Unit</th><th>Instalment</th><th>Due Date</th><th>Scheduled Amount</th><th>Amount Paid</th><th>Balance</th><th>Status</th><th>Sale ID</th></tr></thead><tbody id="salesPaymentReportBody"><tr><td colspan="12">Loading...</td></tr></tbody></table></div>
</section>
