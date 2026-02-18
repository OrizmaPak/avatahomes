<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>OTHER PAYMENTS</span>
                            </p>
                            <form id="otherpaymentsform"> 
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="country" class="control-label">other details</label>
                                            <input type="text" name="description" id="description" class="form-control otherpaymentsverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">client</label>
                                            <select class="form-control otherpaymentsverify" name="ownerid" id="ownerid">
                                                <option value="">-- Select Client --</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">fee</label>
                                            <select class="form-control otherpaymentsverify" name="feenameid" id="feenameid">
                                                <option value="">-- Select Fee --</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">credit</label>
                                            <input type="text" name="credit" id="credit" class="form-control otherpaymentsverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">transaction date</label>
                                            <input type="date" name="transactiondate" id="transactiondate" class="form-control otherpaymentsverify">
                                        </div>
                                        <div class="form-group hidden">
                                            <label for="country" class="control-label">reference</label>
                                            <input type="tel" name="reference" id="reference" class="form-control">
                                        </div>
                                    </div>
                                    <hr class="my-10">
                        
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
