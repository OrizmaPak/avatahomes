<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>Register Property </span>
                            </p>
                            <div class="mb-5 rounded-sm border border-[#e8d7a6] bg-[#fffaf0] p-4">
                                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <p class="font-semibold text-[#7a5a12]">Temporary Excel import</p>
                                        <p class="text-xs text-[#7a6332]">Upload the apartment property Excel to preview each block, then submit the properties one after another.</p>
                                        <p class="text-xs text-[#9a6b12]">Fill the blank property details and studio prices in the Excel before importing.</p>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <a href="./templates/avata_apartment_property_import.xlsx" download class="btn !bg-[#334155] !text-white">Download prepared Excel</a>
                                        <button type="button" class="btn" id="propertyImportUploadBtn">Upload Excel</button>
                                        <input type="file" id="propertyImportInput" accept=".xlsx,.xls,.csv" class="hidden">
                                    </div>
                                </div>
                                <div id="propertyImportPreview" class="mt-4 hidden">
                                    <div class="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                        <p id="propertyImportSummary" class="text-sm font-semibold text-[#475569]"></p>
                                        <div class="flex items-center gap-2">
                                            <button type="button" class="btn !bg-[#64748b] !text-white" id="propertyImportClearBtn">Clear</button>
                                            <button type="button" class="btn" id="propertyImportSubmitBtn">
                                                <div class="btnloader" style="display: none;"></div>
                                                <span>Submit imported properties</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div id="propertyImportStatus" class="mb-3 text-xs font-semibold text-[#7a6332]"></div>
                                    <div class="table-content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Import</th>
                                                    <th>Property</th>
                                                    <th>Units</th>
                                                    <th>Floors</th>
                                                    <th>Total amount</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody id="propertyImportTable"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <form id="propertyregistrationform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="country" class="control-label">property name</label>
                                            <input type="text" name="propertyname" id="propertyname" class="form-control propertyregistrationverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">state</label>
                                            <input type="text" name="state" id="state" class="form-control propertyregistrationverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">city</label>
                                            <input type="text" name="city" id="city" class="form-control propertyregistrationverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">address</label>
                                            <input type="text" name="address" id="address" class="form-control propertyregistrationverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="numberofunits" class="control-label inline-flex items-center gap-1">
                                                number of units
                                                <span class="material-symbols-outlined text-gray-400 cursor-help" style="font-size: 16px;" tabindex="0" role="img" aria-label="Number of units information" title="Automatically generated from the number of rows in the unit table. Add a row to increase the unit count or remove a row to decrease it.">info</span>
                                            </label>
                                            <input type="number" name="numberofunits" id="numberofunits" class="form-control propertyregistrationverify" min="0" readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="numberoffloors" class="control-label inline-flex items-center gap-1">
                                                number of floors
                                                <span class="material-symbols-outlined text-gray-400 cursor-help" style="font-size: 16px;" tabindex="0" role="img" aria-label="Number of floors information" title="Automatically generated from the unique floor values entered in the unit table. Each different floor value counts as one floor.">info</span>
                                            </label>
                                            <input type="number" name="numberoffloors" id="numberoffloors" class="form-control propertyregistrationverify" min="0" readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">location</label>
                                            <input type="text" name="location" id="location" class="form-control propertyregistrationverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">type of units</label>
                                            <select class="form-control propertyregistrationverify" name="typeofunits" id="typeofunits">
                                                <option value="">-- Select Type of Units --</option>
                                                <option value="FLATS">FLATS</option>
                                                <option value="DUPLEX">DUPLEX</option>
                                                <option value="MINI FLATS">MINI FLATS</option>
                                                <option value="COMPLETE BUILDING">COMPLETE BUILDING</option>
                                                <option value="WAREHOUSE">WAREHOUSE</option>
                                                <option value="SHOPS">SHOPS</option>
                                                <option value="DOUBLE SHOPS">DOUBLE SHOPS</option> 
                                                <option value="OFFICE">OFFICE</option>
                                                <option value="SHORT LET">SHORT LET</option> 
                                                <option value="OTHERS">OTHERS</option>
                                            </select> 
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">facility manager</label>
                                            <input type="text" name="propertymanager" id="propertymanager" class="form-control propertyregistrationverify">
                                        </div>
                                    </div>
                                    <hr class="my-10">
                                    <div >
                                        <div class="table-content">
                                            <table>
                                                <thead>   
                                                    <tr>
                                                        <th>unit name</th>
                                                        <th>floor</th>
                                                        <th>Fee Name</th> 
                                                        <th>Mode</th>  
                                                        <th>Amount</th> 
                                                        <th title="Enter number of months e.g. 1, 3, 6, 12.">payment period</th>
                                                        <th class="hidden">Apply % to</th> 
                                                        <th>
                                                            <div id="propertyregistrationaddrow" style="padding: 10px 20px;border-radius: 10px;background: white;border: 2px solid green;width: fit-content; height: fit-content;font-size: larger; color: green;font-weight: bold;">+</div>
                                                        </th>
                                                    </tr> 
                                                </thead>
                                                <tbody id="propertyregistrationtable"></tbody>
                                            </table>
                                        </div>
                                    </div> 
                        
                                </div>
                                <div class="flex justify-end mt-5">
                                    <button type="button" class="btn" id="submit">
                                        <div class="btnloader" style="display: none;" ></div>
                                        <span>Submit</span>
                                    </button>
                                </div>
                            </form>
                        <datalist id="countrylist"></datalist>
                        </section>



