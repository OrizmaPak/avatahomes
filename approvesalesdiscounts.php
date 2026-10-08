<section class="animate__animated animate__fadeIn approval-page">
    <p class="page-title"><span>Approve Sales Discounts</span></p>
    <div class="approval-layout">
        <div class="approval-list-panel">
            <div class="approval-toolbar">
                <input id="salesapprovalsearch" class="form-control" type="search" placeholder="Search pending sales">
                <button type="button" class="btn" id="salesapprovalrefresh">Refresh</button>
            </div>
            <div class="table-content approval-table-wrap">
                <table>
                    <thead><tr><th>Client</th><th>Unit</th><th>Discount</th><th>Status</th></tr></thead>
                    <tbody id="salesapprovaltable"><tr><td colspan="4">Loading approvals...</td></tr></tbody>
                </table>
            </div>
        </div>
        <aside id="salesapprovaldetail" class="approval-detail-panel">
            <div class="approval-empty-state">Select a pending sale to review its details.</div>
        </aside>
    </div>
</section>
