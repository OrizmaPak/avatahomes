<section class="animate__animated animate__fadeIn">
    <input type="hidden" id="id">
    <p class="page-title">
        <span>Property Sales</span>
    </p>
    <form id="rentapropertyform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            
            <div>
                <div id="registeratenantform" class="hidden">
                    <p class="section-title font-medium text-lg mb-2">Client Details</p>
                    <hr>
                    <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm"> 
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div class="form-group">
                                <label for="country" class="control-label">last name</label>
                                <input type="text" name="lastname" id="lastname"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">first name</label>
                                <input type="text" name="firstname" id="firstname"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">other names</label>
                                <input type="text" name="othernames" id="othernames"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group"> 
                                <label for="country" class="control-label">office address</label>
                                <input type="text" name="officeaddress" id="officeaddress"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">phone</label>
                                <input type="tel" name="phone" id="phone" class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">referee 1</label>
                                <input type="text" name="referee1" id="referee1"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">referee address 1</label>
                                <input type="text" name="refereeaddress1" id="refereeaddress1"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">referee phone1</label>
                                <input type="text" name="refereephone1" id="refereephone1"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">referee 2</label>
                                <input type="text" name="referee2" id="referee2"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">referee address 2</label>
                                <input type="text" name="refereeaddress2" id="refereeaddress2"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">referee phone 2</label>
                                <input type="tel" name="refereephone2" id="refereephone2"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="imageurl" class="control-label">image url</label>
                                <div id="imagePreview"></div>
                                <input type="file" name="imageurl" id="imageurl"
                                    class="form-control registeratenantverify" onchange="previewImage('imageurl')">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">occupation</label>
                                <input type="text" name="occupation" id="occupation"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">marital status</label>
                                <input type="text" name="maritalstatus" id="maritalstatus"
                                    class="form-control registeratenantverify">
                            </div>
                            <div class="form-group">
                                <label for="country" class="control-label">date of birth</label>
                                <input type="date" name="dateofbirth" id="dateofbirth"
                                    class="form-control registeratenantverify">
                            </div>
                        </div>
                        <hr class="my-10">


                    </div>
                </div>

            </div>
            <p class="section-title font-medium text-lg mb-2">Property Details</p>
            <hr>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div id="selecte" class="flex justify-end mt-5 hidden">
                    <button type="button" class="btn"
                        onclick="did('selecte').classList.add('hidden');did('registeratenantform').classList.add('hidden');did('existingtenant').classList.remove('hidden')">
                        <div class="btnloader" style="display: none;"></div>
                        <span>Select from existing client</span>
                    </button>
                </div>


                <div id="existingtenant">
                    <label for="tenantid" class="control-label text-gray-700 font-medium text-sm">Client</label>
                    <div class="flex-1 flex items-center gap-2">
                        <select
                            class="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-shadow"
                            name="tenantid" id="tenantid">
                            <option value="">-- Select Existing Client --</option>
                        </select>
                        <button type="button"
                            onclick="did('selecte').classList.remove('hidden');did('registeratenantform').classList.remove('hidden');did('existingtenant').classList.add('hidden')"
                            class="shrink-0 px-2.5 py-1.5 text-xs font-medium text-[green] rounded-md focus:outline-none shadow-sm">
                            ➕ Add
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="country" class="control-label">property</label>
                    <select class="form-control rentapropertyverify" onchange="checkrentapropertyproperty(this)"
                        name="propertyid" id="propertyid">
                        <option value="">-- Select Property --</option>
                    </select>
                </div>
                <div id="unitt" class="form-group hidden">
                    <label for="country" class="control-label">unit</label>
                    <select class="form-control rentapropertyverify" onchange="checkrentapropertyunit(this)"
                        name="unitid" id="unitid">
                        <option value="">-- Select Unit --</option>
                    </select>
                </div>
                <div id="begin" class="form-group remain hidden">
                    <label for="country" class="control-label">begin date</label>
                    <input type="date" name="begindate" id="begindate"
                        onchange="document.getElementById('duration').value = '';document.getElementById('expirationdate').value = ''"
                        class="form-control rentapropertyverify">
                </div>
                <div class="form-group remain hidden">
                    <label for="country" class="control-label">Duration</label>
                    <select class="form-control propertyregistrationverify"
                        onchange="rentapropertydate(this.value, document.getElementById('begindate').value, this)"
                        id="duration" name="duration">
                        <option value="">-- Select Duration --</option>
                        <option class="uppercase" value="1">One Month</option>
                        <option class="uppercase" value="2">Two Months</option>
                        <option class="uppercase" value="3">Three Months</option>
                        <option class="uppercase" value="4">Four Months</option>
                        <option class="uppercase" value="5">Five Months</option>
                        <option class="uppercase" value="6">Six Months</option>
                        <option class="uppercase" value="7">Seven Months</option>
                        <option class="uppercase" value="8">Eight Months</option>
                        <option class="uppercase" value="9">Nine Months</option>
                        <option class="uppercase" value="10">Ten Months</option>
                        <option class="uppercase" value="11">Eleven Months</option>
                        <option class="uppercase" value="12">One Year</option>
                        <option class="uppercase" value="18">One Year six months</option>
                        <option class="uppercase" value="24">Two Years</option>
                        <option class="uppercase" value="30">Two Years six months</option>
                        <option class="uppercase" value="36">Three Years</option>
                        <option class="uppercase" value="48">Four Years</option>
                        <option class="uppercase" value="60">Five Years</option>
                        <option class="uppercase" value="60">Six Years</option>
                        <option class="uppercase" value="60">Seven Years</option>
                        <option class="uppercase" value="60">Eight Years</option>
                        <option class="uppercase" value="60">Nine Years</option>
                        <option class="uppercase" value="60">Ten Years</option>
                    </select>
                </div>
                <div class="form-group remain hidden">
                    <label for="country" class="control-label">expiration date</label>
                    <input type="text" readonly name="expirationdate" id="expirationdate"
                        class="form-control rentapropertyverify">
                </div>
                <div class="form-group remain hidden">
                    <label for="country" class="control-label">paymentdate</label>
                    <input type="date" name="paymentdate" id="paymentdate" class="form-control rentapropertyverify">
                </div>
                <div class="form-group remain !hidden" style="display: none">
                    <label for="country" class="control-label">other fees</label>
                    <input type="text" name="otherfees" id="otherfees" class="form-control ">
                </div>
                <div class="form-group remain !hidden" style="display: none">
                    <label for="country" class="control-label">other fees description</label>
                    <input type="text" name="otherfeesdescription" id="otherfeesdescription" class="form-control ">
                </div>
                <div class="form-group remain hidden">
                    <label for="country" class="control-label">amount paid</label>
                    <input type="number" name="amountpaid" id="amountpaid" readonly class="form-control rentapropertyverify">
                </div>
                <div class="form-group hidden">
                    <label for="country" class="control-label">reference</label>
                    <input type="number" name="reference" id="reference" class="form-control">
                </div>
                <div class="form-group reman hidden">
                    <label for="country" class="control-label">property manager</label>
                    <input type="text" name="propertymanager" id="propertymanager" class="form-control ">
                </div>
            </div>

            <div class="mt-10 remain hidden" style="margin-top: 50px;">
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

            <div id="otherfeesview" class="hidden !my-10" style="margin-top: 50px;">
                <p class="section-title font-medium text-lg mb-2">Manage Fees</p>
                <hr>
                <div class="table-content">
                    <table>
                        <thead>
                            <tr> 
                                <th>Fee Name</th>
                                <th>Mode</th> 
                                 <th>Amount</th>
                                <th class="hidden">payment period (months)</th>   
                                <th>Deposit</th>
                                <th>Discount</th>
                                <th>Apply % to</th>
                                <th>Instalment</th>
                                <th>
                                     <div id="rentapropertyaddrow" style="padding: 10px 20px;border-radius: 10px;background: white;border: 2px solid green;width: fit-content; height: fit-content;font-size: larger; color: green;font-weight: bold;">+</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="rentapropertytable"></tbody>
                    </table>
                </div>
            </div>
 
            <hr class="my-10">

        </div>
        <div class="flex justify-end mt-5">
            <button type="button" class="btn" id="submit">
                <div class="btnloader" style="display: none;"></div>
                <span>Submit</span>
            </button>
        </div>
    </form>
    <datalist id="countrylist"></datalist>
</section> 

