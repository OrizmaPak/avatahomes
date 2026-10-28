<section id="salesPaymentReport" class="animate__animated animate__fadeIn sales-payment-report" data-report="overduepayments">
    <p class="page-title"><span>Overdue Payments</span></p>
    <hr class="my-10">
    <div class="sales-payment-report-toolbar">
        <label class="sales-payment-report-search">Search client, property or unit<input id="salesPaymentReportSearch" class="form-control" type="search" placeholder="Start typing to search"></label>
        <div class="sales-payment-report-actions">
            <button type="button" class="btn" style="background:#006E7093" onclick="printTable('salesPaymentReportTable', 'AVATA HOMES Overdue Payments')"><span class="material-symbols-outlined">print</span> Print</button>
            <button type="button" class="btn" style="background:#00703293" onclick="exportToExcel('salesPaymentReportTable', 'avata-homes-overdue-payments')"><span class="material-symbols-outlined">download</span> Export</button>
            <button type="button" id="salesPaymentReportRefresh" class="btn"><span class="material-symbols-outlined">refresh</span> Refresh</button>
        </div>
    </div>
    <div id="salesPaymentReportMessage" class="sales-payment-report-message" role="status">Loading overdue payments...</div>
    <div class="table-content sales-payment-report-table-wrap"><table id="salesPaymentReportTable"><thead><tr><th>S/N</th><th>Property</th><th>Client</th><th>Unit</th><th>Amount Due</th><th>Status</th><th>Action</th></tr></thead><tbody id="salesPaymentReportBody"><tr><td colspan="7">Loading...</td></tr></tbody></table></div>
    <div class="table-status flex justify-between mt-5">
        <span class="text-xs text-gray-500" id="salesPaymentReportPaginationStatus"></span>
        <span class="flex justify-between gap-6"><select id="salesPaymentReportPageSize" class="form-control !bg-white cursor-pointer"><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="250">250</option><option value="500">500</option></select><span class="flex pagination"><button type="button" id="salesPaymentReportPrev" disabled>Previous</button><span id="pagination-numbers"></span><button type="button" id="salesPaymentReportNext" disabled>Next</button></span></span>
    </div>
</section>
