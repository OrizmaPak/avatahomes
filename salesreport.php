<section class="animate__animated animate__fadeIn">
    <p class="page-title"><span>Sales</span></p>
    <form id="salesreportform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="form-group">
                    <label for="salesreportstartdate" class="control-label">Start date</label>
                    <input type="date" name="startdate" id="salesreportstartdate" class="form-control">
                </div>
                <div class="form-group">
                    <label for="salesreportenddate" class="control-label">End date</label>
                    <input type="date" name="enddate" id="salesreportenddate" class="form-control">
                </div>
                <div class="form-group">
                    <label for="salesreportpropertyidno" class="control-label">Property number</label>
                    <input type="text" name="propertyidno" id="salesreportpropertyidno" class="form-control">
                </div>
                <div class="form-group">
                    <label for="salesreportlocation" class="control-label">Location</label>
                    <input type="text" name="location" id="salesreportlocation" class="form-control">
                </div>
                <div class="flex justify-end items-end lg:col-span-2">
                    <button type="button" id="salesreportsubmit" class="btn">
                        <div class="btnloader" style="display: none;"></div>
                        <span>Generate report</span>
                    </button>
                </div>
            </div>
        </div>
    </form>

    <hr class="my-10">
    <div>
        <div class="flex justify-end gap-2">
            <button type="button" class="btn" style="background: #006E7093" onclick="printSalesReport()"><span>Print</span></button>
            <button type="button" class="btn" style="background: #00703293" onclick="exportSalesReport()"><span>Export</span></button>
        </div>
        <div class="table-content" style="scrollbar-width: thin;">
            <table id="salesreporttable">
                <thead>
                    <tr style="background:#64748b !important; color: white !important;">
                        <th>S/N</th>
                        <th>Product/Property</th>
                        <th>Sales Fees</th>
                        <th>Client</th>
                        <th>Unit</th>
                        <th>Amount Paid</th>
                        <th>Other Fees</th>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Instalments</th>
                    </tr>
                </thead>
                <tbody id="salesreporttabledata">
                    <tr><td colspan="10">Choose a date range and generate the sales report.</td></tr>
                </tbody>
            </table>
        </div>
        <div class="table-status flex justify-between mt-5">
            <span class="text-xs text-gray-500" id="salesreportpaginationstatus"></span>
            <span class="flex justify-between gap-6">
                <select id="salesreportpaginationlimit" class="form-control !bg-white cursor-pointer">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                </select>
                <span class="flex pagination">
                    <button type="button" id="salesreportprev" disabled>Previous</button>
                    <span id="salesreportpagenumbers"></span>
                    <button type="button" id="salesreportnext" disabled>Next</button>
                </span>
            </span>
        </div>
    </div>
</section>
<style>
    .sales-report-fees-table { min-width: 230px; border-collapse: collapse; }
    .sales-report-fees-table th { padding: .38rem .5rem; background: #f8f2e2; color: #80651b; font-size: .67rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    .sales-report-fees-table td { padding: .42rem .5rem; font-size: .76rem; vertical-align: middle; }
    .sales-report-fees-table .sales-report-fee-currency { color: #80651b; font-size: .7rem; font-weight: 700; }
    .sales-report-fees-table .sales-report-fee-amount { color: #334155; font-weight: 700; text-align: right; white-space: nowrap; }
    .sales-report-schedule-button { border: 1px solid #c9a227; border-radius: 6px; padding: .38rem .65rem; background: #fffaf0; color: #604d17; font-size: .76rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
    .sales-report-schedule-button:hover { background: #fff3cd; }
    .sales-report-no-schedule { color: #94a3b8; font-size: .76rem; }
    .sales-report-modal { position: fixed; inset: 0; z-index: 1000; }
    .sales-report-modal-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, .56); backdrop-filter: blur(3px); }
    .sales-report-modal-dialog { position: relative; width: min(760px, calc(100% - 2rem)); max-height: calc(100vh - 2rem); overflow: auto; margin: 1rem auto; border: 1px solid #eadfbd; border-radius: 16px; background: #fffdf7; box-shadow: 0 24px 70px rgba(15, 23, 42, .25); }
    .sales-report-modal-header { display: flex; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.4rem; border-bottom: 1px solid #eadfbd; background: linear-gradient(135deg, #fffdf7, #fff5d9); }
    .sales-report-modal-eyebrow { color: #a77d0b; font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .sales-report-modal-header h2 { margin: .2rem 0; color: #604d17; font-size: 1.25rem; }
    .sales-report-modal-header p { margin: 0; color: #80651b; font-size: .8rem; }
    .sales-report-modal-close { width: 2rem; height: 2rem; border: 0; border-radius: 50%; background: #fff; color: #604d17; font-size: 1.5rem; line-height: 1; cursor: pointer; }
    .sales-report-modal-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: .65rem; padding: 1rem 1.4rem; }
    .sales-report-modal-summary div { padding: .7rem; border: 1px solid #f0e4c4; border-radius: 9px; background: #fff; }
    .sales-report-modal-summary small, .sales-report-installment-row small { display: block; color: #80651b; font-size: .68rem; text-transform: uppercase; }
    .sales-report-modal-summary strong, .sales-report-installment-row strong { display: block; margin-top: .2rem; color: #334155; font-size: .85rem; }
    .sales-report-schedule-list { display: grid; gap: .55rem; padding: 0 1.4rem 1.4rem; }
    .sales-report-installment-row { display: grid; grid-template-columns: 2rem 1fr 1fr 1fr auto; align-items: center; gap: .75rem; padding: .75rem; border: 1px solid #f0e4c4; border-radius: 9px; background: #fff; box-shadow: 0 2px 8px rgba(122, 90, 18, .06); }
    .sales-report-installment-index { display: grid; place-items: center; width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #fff3cd; color: #8a6116; font-weight: 800; }
    .sales-report-installment-status { padding: .25rem .5rem; border-radius: 999px; background: #fff3cd; color: #8a6116; font-size: .68rem; font-weight: 800; }
    @media (max-width: 650px) { .sales-report-modal-summary { grid-template-columns: repeat(2, 1fr); } .sales-report-installment-row { grid-template-columns: 2rem 1fr; } .sales-report-installment-status { grid-column: 2; justify-self: start; } }
</style>
