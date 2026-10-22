<section id="avataDashboard" class="avata-dashboard" aria-labelledby="dashboardTitle">
    <header class="dashboard-hero">
        <div>
            <p class="dashboard-eyebrow">AVATA HOMES / PORTFOLIO OVERVIEW</p>
            <h1 id="dashboardTitle">Every building. One clear view.</h1>
            <p>Explore your portfolio, find an available apartment and see what needs attention.</p>
            <div id="dashboardLinks" class="dashboard-links"></div>
        </div>
        <div class="dashboard-hero-actions">
            <span id="dashboardDate"></span>
            <button id="dashboardRefresh" type="button">Refresh overview <span aria-hidden="true">↻</span></button>
            <small id="dashboardUpdated">Waiting for data</small>
        </div>
    </header>

    <p id="dashboardMessage" class="dashboard-message" role="status" aria-live="polite">Loading your portfolio…</p>
    <div id="dashboardMetrics" class="dashboard-metrics" aria-label="Portfolio statistics"></div>

    <div class="dashboard-overview-grid">
        <section class="dashboard-panel" aria-labelledby="dashboardMixTitle">
            <div class="dashboard-panel-heading"><div><p class="dashboard-eyebrow">THE BIG PICTURE</p><h2 id="dashboardMixTitle">Portfolio mix</h2></div><span class="dashboard-chip">Registered units</span></div>
            <div id="dashboardMix" class="dashboard-mix"><p class="dashboard-empty">Loading availability…</p></div>
        </section>
        <section class="dashboard-panel" aria-labelledby="dashboardBuildingsTitle">
            <div class="dashboard-panel-heading"><div><p class="dashboard-eyebrow">BUILDING BY BUILDING</p><h2 id="dashboardBuildingsTitle">Availability at a glance</h2></div></div>
            <p class="dashboard-note">Select a building to explore its floors below.</p>
            <div id="dashboardBuildings" class="dashboard-buildings"><p class="dashboard-empty">Loading buildings…</p></div>
        </section>
    </div>

    <section id="dashboardFinance" class="dashboard-panel" aria-labelledby="dashboardFinanceTitle" hidden>
        <div class="dashboard-panel-heading"><div><p class="dashboard-eyebrow">SALES &amp; RENTALS</p><h2 id="dashboardFinanceTitle">Transaction snapshot</h2></div><a href="index.php?r=viewrentaproperty">View property sales →</a></div>
        <div id="dashboardFinanceValues" class="dashboard-finance-values"></div>
        <p id="dashboardFinanceNote" class="dashboard-note">Final totals are after discount. This is a transaction summary, not a general-ledger report.</p>
    </section>

    <div id="dashboardAttention" class="dashboard-attention" hidden>
        <section id="dashboardPayments" class="dashboard-panel" aria-labelledby="dashboardPaymentsTitle" hidden>
            <div class="dashboard-panel-heading"><div><p class="dashboard-eyebrow">WHAT’S NEXT</p><h2 id="dashboardPaymentsTitle">Instalment watchlist</h2></div><a href="index.php?r=installmentpayments">All payments →</a></div>
            <p class="dashboard-note">Next unpaid instalment per sale, ordered by due date. Payment status comes from the saved schedule.</p>
            <div id="dashboardPaymentRows" class="dashboard-payment-rows"></div>
        </section>
        <section id="dashboardApprovals" class="dashboard-panel dashboard-approval-panel" aria-labelledby="dashboardApprovalsTitle" hidden>
            <p class="dashboard-eyebrow">YOUR APPROVAL DESK</p>
            <h2 id="dashboardApprovalsTitle">Discount requests</h2>
            <div id="dashboardApprovalSummary"></div>
            <a class="dashboard-action-link" href="index.php?r=approvesalesdiscounts">Review discount requests →</a>
            <p class="dashboard-note">Requests awaiting a decision, not completed sales.</p>
        </section>
    </div>

    <section class="dashboard-layouts" aria-labelledby="dashboardLayoutsTitle">
        <div class="dashboard-panel-heading"><div><p class="dashboard-eyebrow">EXPLORE YOUR PORTFOLIO</p><h2 id="dashboardLayoutsTitle">Interactive floor layouts</h2><p class="dashboard-note">Choose a building, switch floors and select any apartment for details.</p></div><a id="dashboardFloorLink" href="index.php?r=floorplans" hidden>Open Floor Plans →</a></div>
        <?php include __DIR__ . '/floorplans.php'; ?>
    </section>
</section>
