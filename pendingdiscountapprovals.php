<section class="animate__animated animate__fadeIn approval-page">
    <p class="page-title"><span>Pending Discount Approvals</span></p>
    <div class="approval-toolbar">
        <input id="pendingapprovalsearch" class="form-control" type="search" placeholder="Search client, property, unit or reference">
        <button type="button" class="btn" id="pendingapprovalrefresh">Refresh</button>
    </div>
    <div class="approval-summary">
        <span id="pendingapprovalcount">0 pending requests</span>
        <span>Discount requests awaiting review</span>
    </div>
    <div class="table-content approval-table-wrap">
        <table>
            <thead><tr><th>S/N</th><th>Client</th><th>Property</th><th>Unit</th><th>Final total</th><th>Discount</th><th>Status</th><th>Action</th></tr></thead>
            <tbody id="pendingapprovaltable"><tr><td colspan="8">Loading pending approvals...</td></tr></tbody>
        </table>
    </div>
</section>
