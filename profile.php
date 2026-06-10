
    <section class="h-full overflow-y-auto">
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-2/5 mx-auto text-center mt-10 lg:mb-10"> 
            <!--He<span class="text-gray-400">ms</span>-->
        </div> 
        <div class="bg-white xl:border w-[90%] mx-auto rounded py-14 px-12 drop-shadow-sm pt-4">
            <h1 class="font-bold text-2xl text-center">Profile</h1>
            <!--<p class="mt-5 text-xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">Provide the information below to register a new account</p>-->
             <div class="flex flex-col w-5/6 m-auto items-center py-5 sticky top-0 bg-white border-b border-gray-200/50">
                <div title="Click to update profile logo" class="relative cp">
                    <img id="logoFrame" alt="Logo Preview" class="w-[250px] lg:w-[200px] h-auto rounded-full overflow-hidden object-center" onclick="document.getElementById('imageurl').click()" src="./images/default-avatar.png">
                    <span class="absolute bottom-0 right-[10px] lg:right-[50px] bg-white rounded-full p-1 cursor-pointer shadow-xl" onclick="document.getElementById('imageurl').click()">
                        <span class="material-symbols-outlined h-6 w-6 text-gray-500">edit</span>
                    </span>
                    <input type="file" name="imageurl" id="imageurl" class="form-control hidden" accept="image/*" onchange="updateImage(event)">
                </div>
                <span class="font-extrabold text-normal font-mont capitalize mt-2" name="user_name">Loading...</span>
                <span name="user_role" class="rounded-full text-white text-3xs font-bold capitalize bg-blue-500 px-2 py-0.5 text-center">Loading...</span>
            </div>
            <form class="mt-10" id="profilesform" autocomplete="of">
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group">
                            <label for="firstname" class="control-label">first name</label>
                            <input name="firstname" id="firstname" type="text" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="lastname" class="control-label">last name</label>
                            <input name="lastname" id="lastname" type="text" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="othernames" class="control-label">other names</label>
                            <input name="othernames" id="othernames" type="text" class="form-control">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3 my-5">
                        <div class="form-group">
                            <label for="email" class="control-label">email</label>
                            <input name="email" id="email" type="email" readonly class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="phone" class="control-label">phone</label>
                            <input name="phone" id="phone" type="tel" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="address" class="control-label">address</label>
                            <input name="address" id="address" type="text" class="form-control">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group hidden">
                            <label for="role" class="control-label">role</label>
                            <select readonly="readonly" name="role" id="role" class="form-control">
                                <option value="STAFF" selected="selected">STAFF</option>
                                <option id="MERCHANT" class="hidden">MERCHANT</option>
                                <option id="SUPERADMIN" class="hidden">SUPERADMIN</option>
                            </select>
                        </div>
                        <div class="form-group hidden">
                            <label for="location_name" class=" control-label">location name</label>
                            <input  id="location_name" type="text" name="location_name" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="dateofbirth" class="control-label">date of birth</label>
                            <input  id="dateofbirth" type="date" name="dateofbirth" class="form-control">
                        </div>
                    </div>
                
                    <div class="flex gap-3 3xl:gap-1 flex-col md:flex-row items-center mt-10">
                        <button id="submit" style="background:#e55757" type="button" class="w-full md:w-max rounded-md text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8  py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                            <div class="btnloader" style="display: none;" ></div>
                            <span>Update</span>
                        </button>
                        
                    </div>
                </div>
            </form>
            
        </div>
    </section>
