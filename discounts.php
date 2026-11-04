<section class="animate__animated animate__fadeIn discounts-page">
    <p class="page-title"><span>Discounts</span></p>

    <div class="discounts-intro">
        <div>
            <span class="material-symbols-outlined">percent</span>
            <div>
                <h2>Sales discount and instalment rules</h2>
                <p>Create the percentage discounts available for each permitted number of instalments.</p>
            </div>
        </div>
        <button type="button" id="discountaddrow" class="discount-add-button">
            <span class="material-symbols-outlined">add</span> Add row
        </button>
    </div>

    <form id="discountdataform" class="discount-form-card">
        <div class="table-content">
            <table class="discount-entry-table" data-no-table-tools>
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Discount (%)</th>
                        <th>Number of instalments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="discountentryrows"></tbody>
            </table>
        </div>
        <div class="discount-form-actions">
            <button type="button" id="discountsubmit" class="btn">
                <div class="btnloader" style="display:none"></div>
                <span>Save discount rules</span>
            </button>
        </div>
    </form>

    <hr class="my-10">

    <div class="discount-saved-heading">
        <div>
            <h2>Saved discount rules</h2>
            <p>These rules will be used when preparing a property sale.</p>
        </div>
        <button type="button" id="discountrefresh" class="discount-refresh-button">
            <span class="material-symbols-outlined">refresh</span> Refresh
        </button>
    </div>
    <div class="table-content">
        <table id="discountstable" data-export-name="discount-rules">
            <thead>
                <tr>
                    <th>S/N</th>
                    <th>Discount</th>
                    <th>Number of instalments</th>
                </tr>
            </thead>
            <tbody id="discountstabledata">
                <tr><td colspan="3" class="text-center opacity-70">Loading discount rules...</td></tr>
            </tbody>
        </table>
    </div>
</section>

<style>
    .discounts-page { --discount-gold:#c89a2b; --discount-deep:#755713; }
    .discounts-intro,.discount-saved-heading { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1rem; }
    .discounts-intro>div { display:flex; align-items:center; gap:.85rem; }
    .discounts-intro>div>.material-symbols-outlined { display:grid; place-items:center; width:2.6rem; height:2.6rem; border-radius:.8rem; background:#fff3cd; color:var(--discount-deep); }
    .discounts-intro h2,.discount-saved-heading h2 { margin:0; color:#3f3a2e; font-size:1rem; font-weight:800; }
    .discounts-intro p,.discount-saved-heading p { margin:.2rem 0 0; color:#7b7465; font-size:.78rem; }
    .discount-form-card { padding:1rem; border:1px solid #eadfbd; border-radius:14px; background:#fffdf8; box-shadow:0 8px 24px rgba(117,87,19,.06); }
    .discount-entry-table>thead>tr>th,#discountstable>thead>tr>th { background:#8a6a1f!important; color:#fff!important; }
    .discount-entry-table input { min-width:150px; }
    .discount-add-button,.discount-refresh-button { display:inline-flex; align-items:center; gap:.35rem; border:1px solid #d6b85e; border-radius:8px; padding:.55rem .8rem; background:#fff9e9; color:var(--discount-deep); font-size:.78rem; font-weight:800; cursor:pointer; }
    .discount-add-button:hover,.discount-refresh-button:hover { background:#fff1bf; }
    .discount-add-button .material-symbols-outlined,.discount-refresh-button .material-symbols-outlined { font-size:17px; }
    .discount-remove-button { display:grid; place-items:center; width:2rem; height:2rem; border:0; border-radius:50%; background:#fee2e2; color:#b91c1c; cursor:pointer; }
    .discount-remove-button:hover { background:#fecaca; }
    .discount-form-actions { display:flex; justify-content:flex-end; margin-top:1rem; }
    .discount-percent-badge { display:inline-flex; min-width:3.8rem; justify-content:center; border-radius:999px; padding:.3rem .6rem; background:#fff3cd; color:#755713; font-weight:800; }
    @media(max-width:640px){.discounts-intro,.discount-saved-heading{align-items:flex-start;flex-direction:column}.discount-add-button,.discount-refresh-button{width:100%;justify-content:center}}
</style>
