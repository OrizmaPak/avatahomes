<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>footer quick links</span>
    </p>
    <form id="footerquicklinksform">
        <div class="flex flex-col space-y-3 bg-white/90 p-5 xl:p-10 rounded-sm">
            <div class="flex gap-6">
                <div class="form-group">
                    <label for="owner" class="control-label">Owner</label>
                    <select class="form-control" name="owner" id="owner">
                        <option value="TRAVELS AND TOURS">TRAVELS AND TOURS</option>
                        <option value="EVENT">EVENT</option>
                        <option value="FORMS">FORMS</option>
                        <option value="TRIVIA">TRIVIA</option>
                        <option value="BLOG">BLOG</option>
                        <option value="VENDOR">VENDOR</option>
                        <option value="VOTE">VOTE</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="category" class="control-label">category</label>
                    <select class="form-control" name="category" id="category">
                        <option value="Service">Service</option>
                        <option value="Account">Account</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-6">
                <div class="form-group">
                    <label for="title" class="control-label">title</label>
                    <input type="text" name="title" id="title" class="form-control">
                </div>
                <div class="form-group">
                    <label for="status" class="control-label">status</label>
                    <select class="form-control" name="status" id="status">
                        <option value="DISPLAY">DISPLAY</option>
                        <option value="HIDE">HIDE</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="url" class="control-label">url</label>
                <input type="url" name="url" id="url" class="form-control">
            </div>
        </div>
        <div class="flex justify-end mt-5">
            <button id="submit" type="button" class="btn">
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
                        <th>owner</th>
                        <th>category</th>
                        <th>title</th>
                        <th>url</th>
                        <th>status</th>
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