<section class="animate__animated animate__fadeIn">
    <p class="page-title">
        <span>popular hotels</span>
    </p>
    <form id="popularhotelsform">
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
                    <label for="locationinfo" class="control-label">Location information</label>
                    <input type="text" name="locationinfo" id="locationinfo" class="form-control">
                </div>
            </div>
            <div class="flex gap-6">
                <div class="form-group">
                    <label for="otherinfo" class="control-label">other information</label>
                    <input type="text" name="otherinfo" id="otherinfo" class="form-control">
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
                <label for="imageurl" class="control-label">Image Url</label>
                <div id="imagePreview"></div>
                <input type="file" name="imageurl" id="imageurl" class="form-control" onchange="previewImage(this.id)">
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
                        <th>location</th>
                        <th>image url</th>
                        <th>others</th>
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