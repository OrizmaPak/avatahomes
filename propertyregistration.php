<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>Register Property </span>
                            </p>
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
                                            <label for="country" class="control-label">number of units</label>
                                            <input type="number" name="numberofunits" id="numberofunits" class="form-control propertyregistrationverify">
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



