<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>DOCUMENTS</span>
                            </p>
                            <form id="moredocumentsform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
                                        <div class="form-group">
                                            <label for="country" class="control-label">client</label>
                                            <select class="form-control moredocumentsverify" name="tenantid" id="tenantid">
                                                <option value="">-- Select Client --</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">description</label>
                                            <textarea type="number" name="description" id="description" class="form-control moredocumentsverify"></textarea>
                                        </div>
                                        <div class="form-group ">
                                            <label for="country" class="control-label">document</label>
                                            <input type="file" name="document" id="document" class="form-control">
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
