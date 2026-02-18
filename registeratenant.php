<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>Register Client</span>
                            </p>
                            <form id="registeratenantform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm"> 
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="country" class="control-label">last name</label>
                                            <input type="text" name="lastname" id="lastname" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">first name</label>
                                            <input type="text" name="firstname" id="firstname" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">other names</label>
                                            <input type="text" name="othernames" id="othernames" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">office address</label>
                                            <input type="text" name="officeaddress" id="officeaddress" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">phone</label>
                                            <input type="tel" name="phone" id="phone" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">referee 1</label>
                                            <input type="text" name="referee1" id="referee1" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">referee address 1</label>
                                            <input type="text" name="refereeaddress1" id="refereeaddress1" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">referee phone1</label>
                                            <input type="text" name="refereephone1" id="refereephone1" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">referee 2</label>
                                            <input type="text" name="referee2" id="referee2" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">referee address 2</label>
                                            <input type="text" name="refereeaddress2" id="refereeaddress2" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">referee phone 2</label>
                                            <input type="tel" name="refereephone2" id="refereephone2" class="form-control registeratenantverify">
                                        </div>
                                       <div class="form-group">
                                            <label for="imageurl" class="control-label">image url</label>
                                            <div id="imagePreview"></div>
                                            <input type="file" name="imageurl" id="imageurl" class="form-control registeratenantverify" onchange="previewImage('imageurl')">
                                        </div>  
                                        <div class="form-group">
                                            <label for="country" class="control-label">occupation</label>
                                            <input type="text" name="occupation" id="occupation" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">marital status</label>
                                            <input type="text" name="maritalstatus" id="maritalstatus" class="form-control registeratenantverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">date of birth</label>
                                            <input type="date" name="dateofbirth" id="dateofbirth" class="form-control registeratenantverify">
                                        </div>
                                    </div>
                                    <hr class="my-10">

                                    <div class="mt-10 remain " style="margin-top: 50px;">
                <p class="section-title font-medium text-lg mb-2">Manage Dependants</p>
                <hr style="margin: 10px 0px 25px 0px;">

                <div class="flex-shrink-0">
                    <button type="button" class="btn w-full lg:w-auto" onclick="addDependant()"
                        id="addNewDependantBtn">Add New
                        Dependant</button>
                </div>

                <div class="table-content mt-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Dependant Name</th>
                                <th>Ocuppation</th>
                                <th>phone</th>
                                <th>relationship</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="dependantTableBody">
                              <!-- <tr>
                              <td><p>John Doe</p></td>
                    <td><p>Trader</p></td>
                    <td><button type="button" class="text-red-500 material-symbols-outlined text-[red]">cancel</button></td>
                </tr>
                <tr>
                    <td><p>Jane Smith</p></td>
                    <td><p>Farmer</p></td>
                    <td><button type="button" class="text-red-500 material-symbols-outlined text-[red]">cancel</button></td>
                </tr> -->
                        </tbody>
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
