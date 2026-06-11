<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>View enquires</span>
    </p>

    <form id="viewenquiresform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="form-group">
                    <label for="startdate" class="control-label">Start Date</label>
                    <input type="date" name="startdate" id="startdate" class="form-control">
                </div>
                <div class="form-group">
                    <label for="enddate" class="control-label">End Date</label>
                    <input type="date" name="enddate" id="enddate" class="form-control">
                </div>
            </div>

            <div class="flex justify-end mt-5">
                <button type="button" id="submit" class="btn">
                    <div class="btnloader" style="display:none;"></div>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    </form>

    <hr class="my-10">

    <div>
        <div class="flex justify-end gap-2">
            <div class="flex justify-end mt-5">
                <button type="button" id="print" class="btn" style="background: #006E7093" onclick="printTable()">
                    <div class="btnloader" style="display:none;"></div>
                    <span>Print</span>
                </button>
            </div>
            <div class="flex justify-end mt-5">
                <button type="button" id="export" class="btn" style="background: #00703293" onclick="exportToExcel('viewEnquiresExportTable', 'enquiries')">
                    <div class="btnloader" style="display:none;"></div>
                    <span>Export</span>
                </button>
            </div>
        </div>

        <div class="table-content">
            <table id="viewEnquiresExportTable">
                <thead>
                    <tr>
                        <th>s/n</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Request</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tabledata"></tbody>
            </table>
        </div>

        <div class="table-status flex justify-between mt-5">
            <span class="text-xs text-gray-500" id="pagination-status">Showing 0 - 0 of 0</span>
            <span class="flex justify-between gap-6">
                <span>
                    <select id="pagination-limit" class="form-control !bg-white cursor-pointer">
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="35">35</option>
                        <option value="40">40</option>
                        <option value="70">70</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                        <option value="250">250</option>
                        <option value="500">500</option>
                    </select>
                </span>
                <span class="flex pagination">
                    <button type="button" id="pagination-prev-button" disabled="true">previous</button>
                    <span id="pagination-numbers">
                        <button class="pagination-number" page-index="1" type="button" aria-label="Page 1">1</button>
                    </span>
                    <button type="button" id="pagination-next-button" disabled="true">next</button>
                </span>
            </span>
        </div>
    </div>
</section>
