<section class="animate__animated animate__fadeIn">
                                            <input type="hidden" id="id" >
                            <p class="page-title">
                                <span>MORE FEES</span>
                            </p>
                            <form id="morefeesform">
                                <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label for="country" class="control-label">fee name</label>
                                            <input type="text" name="feename" id="feename" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">mode</label>
                                            <select name="mode" id="mode" class="form-control">
                                                <option value="FLAT">FLAT</option>
                                                <option value="PERCENTAGE">PERCENTAGE</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="country" class="control-label">amount</label>
                                            <input type="number" name="amount" id="amount" class="form-control">
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

                            <hr class="my-10">
    <div >
        <div class="table-content">
            <table>
                <thead>
                    <tr>
                        <th>s/n </th>
                        <th>fee name</th>
                        <th>mode</th>
                        <th>amount</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody id="tabledata">
                    <tr>
                        <td colspan="100%" class="text-center opacity-70"> Table is empty</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-status"></div>
    </div>
                            
                            
                        </section>