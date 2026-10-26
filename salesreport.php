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
