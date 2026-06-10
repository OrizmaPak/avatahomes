<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>view expenses</span>
    </p>
    <form id="viewexpensesform">
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
        <div class="card bg-white shadow-md rounded-lg p-6 mb-6 flex justify-end items-center">
                <h2 class="text-lg font-semibold text-gray-700" style="margin:10px">Total:</h2>
                <p id="total22" class="text-2xl font-bold text-primary" style="margin:20px">0</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>s/n </th>
                        <th>transaction date</th>
                        <th>property id no</th>
                        <th class="hidden">account name</th>
                        <th>property</th>
                        <th>description</th>
                        <th>reference</th>
                        <th>amount</th>
                    </tr>
                </thead>
                <tbody id="tabledata">
                    <!--<tr>-->
                    <!--    <td>1</td>-->
                    <!--    <td>VOTE</td>-->
                    <!--    <td>gos to Abk</td>-->
                    <!--    <td>https://dummyimageurl.com</td>-->
                    <!--    <td>Display</td>-->
                    <!--    <td class="flex items-center gap-3">-->
                    <!--        <button title="Edit row entry" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">edit</button>-->
                    <!--        <button title="Delete row entry" class="material-symbols-outlined rounded-full bg-red-600 h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">delete</button>-->
                    <!--    </td>-->
                    <!--</tr>-->
                    
                </tbody>
            </table>
            <div class="card bg-white shadow-md rounded-lg p-6 mb-6 flex justify-end items-center">
                <h2 class="text-lg font-semibold text-gray-700" style="margin:10px">Total:</h2>
                <p id="total11" class="text-2xl font-bold text-primary" style="margin:20px">0</p>
            </div>
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