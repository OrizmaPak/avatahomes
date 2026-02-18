<section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>net transaction</span>
                            </p>
                            <form id="netform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div class="form-group">
                                            <label for="logoname" class="control-label">start date</label>
                                            <input type="date" name="startdate" id="startdate" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">end date</label>
                                            <input type="date" name="enddate" id="enddate" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">Property Number
                                            </label>
                                            <input type="text" name="propertyidno" id="propertyidno" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="logoname" class="control-label">location
                                            </label>
                                            <input type="text" name="location" id="location" class="form-control">
                                        </div>
                                        
                                        
                                    <div class="flex justify-end mt-5">
                                        <button type="button" id="submit" class="btn">
                                            <div class="btnloader" style="display: none;" ></div>
                                            <span>Submit</span>
                                        </button>
                                    </div>
                                    </div> 
                        
                                </div>
                            </form>
                            <hr class="my-10">
                            <div >
                                    <div class="flex justify-end gap-2">
                                       
                                    <div class="flex justify-end mt-5">
                                        <button type="button" id="print" class="btn" style="background: #006E7093" onclick="printTable()">
                                            <div class="btnloader" style="display: none;" ></div>
                                            <span>Print</span>
                                        </button>
                                    </div>
                                    <div class="flex justify-end mt-5">
                                        <button type="button" id="export" class="btn" style="background: #00703293" onclick="exportToExcel()">
                                            <div class="btnloader" style="display: none;" ></div>
                                            <span>Export</span>
                                        </button>
                                    </div>
                                    </div> 
                        
                                <div class="table-content">
                               
  <hr class="my-0" />

<!-- NET TRANSACTION WRAPPER -->
<div class="net-transaction">
  
  <!-- Display Totals -->
  <div class="totals-display" style="margin-bottom: 20px;">
    <span style="margin-right: 40px;">
      <strong>Total Inflow:</strong> 
      <span id="total-inflow">0</span>
    </span>

    <span style="margin-right: 40px;">
      <strong>Total Outflow:</strong> 
      <span id="total-outflow">0</span>
    </span>

    <span>
      <strong>Net:</strong> 
      <span id="total-net">0</span>
    </span>
  </div>

  <!-- Two Tables Side by Side -->
 <!-- Container where all fee‐sections will be injected -->
 <div id="net-table-container" style="margin:20px 0;">
  <table id="netTable" style="font-size:12px;width:100%; border-collapse:collapse; font-family:Arial, sans-serif;">
    <thead>
      <tr>
        <!-- indent column for grouping -->
        <th style="width:20px;"></th>
        <th style="border-bottom:1px solid #ccc; text-align:left; padding:8px;">ITEM/DESCRIPTION</th>
        <th style="border-bottom:1px solid #ccc; text-align:right; padding:8px;">DEBIT</th>
        <th style="border-bottom:1px solid #ccc; text-align:right; padding:8px;">CREDIT</th>
      </tr>
    </thead>
    <tbody>
      <!-- rows will be injected here -->
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td style="text-align:right; font-weight:bold; padding:8px; border-top:2px solid #000;">
          Grand Total
        </td>
        <td id="grand-debit" style="text-align:right; font-weight:bold; padding:8px; border-top:2px solid #000;"></td>
        <td id="grand-credit" style="text-align:right; font-weight:bold; padding:8px; border-top:2px solid #000;"></td>
      </tr>
    </tfoot>
  </table>
</div>
<style>
  #netTable tbody tr td {
  font-size: 12px !important;
}
</style>


  

                                </div>
                                <div class="table-status flex justify-between mt-5">
                                    <span class="text-xs text-gray-500" id="pagination-status">Showing 1 - 20 of 40</span>
                                    <span class=" flex justify-between gap-6">
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
                                                <option value="750">750</option>
                                                <option value="1000">1000</option>
                                                <option value="1500">1500</option>
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

                        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>