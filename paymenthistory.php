<!-- PAYMENT HISTORY SECTION -->
<section class="animate__animated animate__fadeIn">
  <p class="page-title"><span>payment history</span></p>

  <!-- 🔍  Filter form -->
  <form id="paymenthistoryform">
    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm"> 
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="form-group">
          <label for="startdate" class="control-label">start date</label>
          <input type="date" name="startdate" id="startdate" class="form-control">
        </div>
        <div class="form-group">
          <label for="enddate" class="control-label">end date</label>
          <input type="date" name="enddate" id="enddate" class="form-control">
        </div>
        <div class="form-group">
          <label for="ownerid" class="control-label">client</label>
          <select class="form-control otherpaymentsverify" name="tenantid" id="ownerid">
            <option value="">-- Select Client --</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end mt-5">
        <button type="button" id="submit" class="btn">
          <div class="btnloader" style="display:none;"></div><span>Submit</span>
        </button>
      </div>
    </div>
  </form>

  <hr class="my-10" />

  <!-- 📊  Actions + totals (top) -->
  <div>
    <div class="flex justify-end gap-2">
      <button type="button" id="print"  class="btn" style="background:#006E7093" onclick="printTable()">
        <div class="btnloader" style="display:none;"></div><span>Print</span>
      </button>
      <button type="button" id="export" class="btn" style="background:#00703293" onclick="exportToExcel()">
        <div class="btnloader" style="display:none;"></div><span>Export</span>
      </button>
    </div>

    <!-- ⬇ totals card (top) -->
    <div class="card bg-white shadow-md rounded-lg p-6 my-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-right">
        <div><h2 class="font-semibold text-gray-700">Debit</h2>   <span id="totalDebit"    class="text-xl font-bold text-primary">0</span></div>
        <div><h2 class="font-semibold text-gray-700">Credit</h2>  <span id="totalCredit"   class="text-xl font-bold text-primary">0</span></div>
        <div><h2 class="font-semibold text-gray-700">Discount</h2><span id="totalDiscount" class="text-xl font-bold text-primary">0</span></div>
        <div><h2 class="font-semibold text-gray-700">Balance</h2> <span id="totalBalance"  class="text-xl font-bold text-primary">0</span></div>
      </div>
    </div>

    <!-- 📋  Data table -->
    <div class="table-content">
      <table>
        <thead>
          <tr>
            <th>s/n</th>
            <th>Transaction Date</th>
            <th>Reference</th>
            <th>Description</th>
            <th>Client Name</th>
            <th>Debit (₦)</th>
            <th>Credit (₦)</th>
            <th>Discount (₦)</th>
            <th>Balance (₦)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="tabledata"><!-- rows injected by JS --></tbody>
      </table>

      <!-- ⬇ totals card (bottom) -->
      <div class="card bg-white shadow-md rounded-lg p-6 my-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-right">
          <div><h2 class="font-semibold text-gray-700">Debit</h2>   <span id="totalDebit2"    class="text-xl font-bold text-primary">0</span></div>
          <div><h2 class="font-semibold text-gray-700">Credit</h2>  <span id="totalCredit2"   class="text-xl font-bold text-primary">0</span></div>
          <div><h2 class="font-semibold text-gray-700">Discount</h2><span id="totalDiscount2" class="text-xl font-bold text-primary">0</span></div>
          <div><h2 class="font-semibold text-gray-700">Balance</h2> <span id="totalBalance2"  class="text-xl font-bold text-primary">0</span></div>
        </div>
      </div>
    </div>

    <!-- 📄  Pagination -->
    <div class="table-status flex justify-between mt-5">
      <span class="text-xs text-gray-500" id="pagination-status">Showing 0 – 0 of 0</span>
      <span class="flex gap-6">
        <select id="pagination-limit" class="form-control !bg-white cursor-pointer">
          <option value="20">20</option><option value="30">30</option><option value="40">40</option>
          <option value="70">70</option><option value="100">100</option><option value="150">150</option>
          <option value="200">200</option><option value="250">250</option><option value="500">500</option>
        </select>
        <span class="flex pagination">
          <button type="button" id="pagination-prev-button" disabled>previous</button>
          <span id="pagination-numbers"><button class="pagination-number" page-index="1" type="button">1</button></span>
          <button type="button" id="pagination-next-button" disabled>next</button>
        </span>
      </span>
    </div>
  </div>
</section>

<!-- jsPDF (for PDF receipts) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
