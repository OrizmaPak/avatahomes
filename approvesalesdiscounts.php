<section class="animate__animated animate__fadeIn approval-page">
    <p class="page-title"><span>Approve Sales Discounts</span></p>
    <div class="approval-layout">
        <div class="approval-list-panel">
            <div class="approval-toolbar">
                <input id="salesapprovalsearch" class="form-control" type="search" placeholder="Search pending sales">
                <input id="salesapprovalstartdate" class="form-control" type="date" aria-label="Start date">
                <input id="salesapprovalenddate" class="form-control" type="date" aria-label="End date">
                <button type="button" class="btn" id="salesapprovalrefresh">Refresh</button>
            </div>
            <div class="table-content approval-table-wrap">
                <table>
                    <thead><tr><th>Client</th><th>Property</th><th>Unit</th><th>Final total</th><th>Discount</th><th>Instalments</th><th>Mode</th><th>Status</th></tr></thead>
                    <tbody id="salesapprovaltable"><tr><td colspan="8">Loading approvals...</td></tr></tbody>
                </table>
            </div>
        </div>
        <aside id="salesapprovaldetail" class="approval-detail-panel">
            <div class="approval-empty-state">Select a pending sale to review its details.</div>
        </aside>
    </div>
</section>
