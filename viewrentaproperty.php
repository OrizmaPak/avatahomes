                    <section class="animate__animated animate__fadeIn">
                            <p class="page-title">
                                <span>View Property Sales</span>
                            </p>
                            <form id="viewrentapropertysform">
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
                                <div class="table-content" style="    scrollbar-width: thin;
">
                                <table class="">
    <thead class="">
        <tr style="background:#64748b !important; color: white !important;">
            <th>S/N</th>
            <th>Product</th>
            <th>Client</th>
            <th>Unit</th>
            <th>Amount Paid</th>
            <th class="hidden">Rent</th>
            <th>Other Fees</th>
            <th>Begin Date</th>
            <th>Expiry Date</th>
            <th>Payment Date</th>
            <th>Reference</th>
            <th>Sales Fees</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody id="tabledata">
        <!-- Data will be injected here -->
    </tbody>
</table>

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
                        
                        </section>  <style>
.receipt-container {
    font-family: 'Arial', sans-serif;
    background: #ffffff;
    padding: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.header h2 {
    color: #2c3e50;
    letter-spacing: 2px;
}

.details-grid p {
    margin-bottom: 0.5rem;
}

.table th {
    background: #f8f9fa !important;
}

.signature-section {
    margin-top: 50px;
}
.d-none{
    display: none;
}
</style>

<!-- Add to your HTML -->
<div id="receiptTemplate" class="d-none">
  <div class="receipt-container p-4 bg-white" style="max-width: 800px;">
    <div class="header text-center mb-4">
      <h2 class="text-2xl font-bold">PROPERTY SALES PAYMENT RECEIPT</h2>
      <p class="text-sm text-gray-500">Official Payment Confirmation</p>
    </div>
    
    <div class="details-grid row mb-4">
      <div class="col-md-6">
        <p><strong>Client:</strong> <span id="rcptTenant"></span></p>
        <p><strong>Property:</strong> <span id="rcptProperty"></span></p>
        <p><strong>Unit:</strong> <span id="rcptUnit"></span></p>
      </div>
      <div class="col-md-6">
        <p><strong>Payment Date:</strong> <span id="rcptPaymentDate"></span></p>
        <p><strong>Reference No:</strong> <span id="rcptReference"></span></p>
        <p><strong>Receipt Date:</strong> <span id="rcptReceiptDate"></span></p>
      </div>
    </div>

    <table class="table table-bordered mb-4">
      <thead class="bg-gray-200">
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sales Amount</td>
          <td id="rcptAnnualRent"></td>
        </tr>
        <tr>
          <td>Other Fees</td>
          <td id="rcptOtherFees"></td>
        </tr>
        <tr>
          <td>Amount Paid</td>
          <td id="rcptAmountPaid"></td>
        </tr>
      </tbody>
    </table>

    <div class="signature-section text-right">
      <p class="border-top pt-3">Authorized Signature</p>
    </div>
  </div>
</div>

<!-- Add to your JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
