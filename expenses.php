<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>EXPENSES</span>
                            </p>
                            <form id="expensesform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="form-group">
                                            <label for="country" class="control-label">description</label>
                                            <input type="text" name="description" id="description" class="form-control expensesverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">property</label>
                                            <select class="form-control expensesverify" name="ownerid" id="ownerid">
                                                <option value="">-- Select Property --</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">Amount</label>
                                            <input type="number" name="debit" id="debit" class="form-control expensesverify">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">fee</label>
                                            <select class="form-control otherpaymentsverify" name="feenameid" id="feenameid">
                                                <option value="">-- Select Fee --</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">transaction date</label>
                                            <input type="date" name="transactiondate" id="transactiondate" class="form-control expensesverify">
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