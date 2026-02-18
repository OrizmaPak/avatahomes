
<section class="h-full overflow-y-auto">
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-2/5 mx-auto text-center mt-10 lg:mb-10"> 
            <!--He<span class="text-gray-400">ms</span>-->
        </div> 
        <div class="bg-white xl:border w-[90%] mx-auto rounded py-14 px-12 drop-shadow-sm pt-4">
            <h1 class="font-bold text-2xl text-center">Organisation Information</h1>
            <!--<p class="mt-5 text-xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">Provide the information below to register a new account</p>-->
            <form class="mt-10" id="organisationinfoform" autocomplete="off">
            <div class="flex flex-col w-5/6 m-auto items-center py-5 sticky top-0 bg-white border-b border-gray-200/50">
                <div title="Click to update profile logo" class="relative cp">
                    <img id="logoFrame" alt="Logo Preview" class="w-[250px] lg:w-[200px] h-auto rounded-full overflow-hidden object-center" onclick="document.getElementById('logo').click()" src="./images/default-avatar.png">
                    <span class="absolute bottom-0 right-[10px] lg:right-[50px] bg-white rounded-full p-1 cursor-pointer shadow-xl" onclick="document.getElementById('logo').click()">
                        <span class="material-symbols-outlined h-6 w-6 text-gray-500">edit</span>
                    </span>
                    <input type="file" name="logo" id="logo" class="form-control hidden" accept="image/*" onchange="updateImage(event)">
                </div>
            </div>
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group">
                            <label for="organisationname" class="control-label">Organisation Name</label>
                            <input name="organisationname" id="organisationname" type="text" class="form-control">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group">
                            <label for="country" class="control-label">Country</label>
                            <input name="country" id="country" type="text" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="state" class="control-label">State</label>
                            <input name="state" id="state" type="text" class="form-control">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3 my-5">
                        <div class="form-group">
                            <label for="address" class="control-label">Address</label>
                            <input name="address" id="address" type="text" class="form-control">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3 my-5">
                        <div class="form-group">
                            <label for="email" class="control-label">Email</label>
                            <input name="email" id="email" type="email" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="phone" class="control-label">Phone</label>
                            <input name="phone" id="phone" type="tel" class="form-control">
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
