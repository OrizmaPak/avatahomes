<section id="floorplansPage" class="animate__animated animate__fadeIn floorplans-page">
    <div class="floorplans-heading">
        <div>
            <p class="page-title"><span>Floor Plans</span></p>
            <p class="floorplans-subtitle">Explore buildings, floors and apartment availability.</p>
        </div>
        <button type="button" id="floorplansRefresh" class="btn"><span class="material-symbols-outlined">refresh</span> Refresh</button>
    </div>

    <div class="floorplans-toolbar">
        <label>Search buildings or units<input id="floorplansSearch" type="search" class="form-control" placeholder="Search by name or unit"></label>
        <label>Building<select id="floorplansBuilding" class="form-control"><option value="">All buildings</option></select></label>
        <label>Floor<select id="floorplansFloor" class="form-control"><option value="">All floors</option></select></label>
        <label>Status<select id="floorplansStatus" class="form-control"><option value="ALL">All statuses</option><option value="AVAILABLE">Available</option><option value="TAKEN">Taken</option><option value="NEEDS_REVIEW">Needs review</option><option value="UNCONFIRMED">Unconfirmed</option></select></label>
        <div class="floorplans-view-toggle" role="group" aria-label="View mode"><button type="button" class="is-active" data-floorplans-view="plan">Plan</button><button type="button" data-floorplans-view="list">List</button></div>
    </div>

    <div class="floorplans-legend" aria-label="Apartment status legend">
        <span><i class="floorplans-dot available"></i>Available</span>
        <span><i class="floorplans-dot taken"></i>Taken</span>
        <span><i class="floorplans-dot review"></i>Needs review</span>
        <span><i class="floorplans-dot unconfirmed"></i>Unconfirmed</span>
        <span class="floorplans-updated" id="floorplansUpdated">Not loaded</span>
    </div>

    <div id="floorplansMessage" class="floorplans-message" role="status" aria-live="polite">Loading property data...</div>
    <div id="floorplansOverview" class="floorplans-overview"></div>

    <div id="floorplansExplorer" class="floorplans-explorer hidden">
        <aside id="floorplansFloorRail" class="floorplans-floor-rail"></aside>
        <div class="floorplans-plan-column">
            <div class="floorplans-plan-header"><div><h2 id="floorplansSelectedBuilding"></h2><p id="floorplansSelectedFloor"></p></div><span>Schematic - not to scale</span></div>
            <div id="floorplansPlan" class="floorplans-plan" aria-label="Apartment floor plan"></div>
            <div id="floorplansAdditional" class="floorplans-additional hidden"></div>
        </div>
        <aside id="floorplansDetails" class="floorplans-details" aria-live="polite"><div class="floorplans-empty-detail"><span class="material-symbols-outlined">touch_app</span><p>Select an apartment to view its details.</p></div></aside>
    </div>
    <div id="floorplansList" class="floorplans-list hidden"></div>
</section>

<style>
    .floorplans-page .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;font-size:16px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased;font-feature-settings:'liga';font-variation-settings:'FILL' 0,'wght' 500,'GRAD' 0,'opsz' 20;vertical-align:middle}.floorplans-status-marker{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:1px}.floorplans-status-marker.available{background:#2f9c62}.floorplans-status-marker.taken{background:#d95959}.floorplans-status-marker.review{background:#e1a936}.floorplans-status-marker.unconfirmed{background:#94a3b8}
</style>
