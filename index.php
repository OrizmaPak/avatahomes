<?php
session_start();
if(!isset($_SESSION["wuseremail"]))
{
	header('Location: login');
}

?> 

<!DOCTYPE html> 
<html lang="en"> 


<head> 
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avatar Homes Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="./css/index.css?v=20260219c">
    <link rel="stylesheet" href="./css/css_vanilla.css?v=20260219c">
     <!-- PWA Manifest --> 
  <link rel="manifest" href="./manifest.json"> 
      <!-- ios support -->
      <link rel="apple-touch-icon" href="images/16.png" />
    <link rel="apple-touch-icon" href="images/32.png" />
    <link rel="apple-touch-icon" href="images/icon.png" />
    <link rel="apple-touch-icon" href="images/128.png" />



  <meta name="theme-color" content="#c9a227">
  <link rel="icon" href="./images/icon.png">

  <!-- JavaScript Files -->
  <!-- <script src="./js/web-push/src/index.js"></script> -->
  <script src="./js/main.js" defer></script>
  <script src="./js/push.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,700&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,0,0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
</head>

<body class="dashboard-theme"> 

    <main class="h-screen bg-primary/10">
        <div class="h-full">

            <!-- header -->
            <header> 
                <div class="dashboard-header flex items-center bg-white border-b border-gray-200/50">
                    <span
                        class="xl:w-[250px] font-bold text-base block py-3 pl-5 selection:bg-white capitalize font-heebo dashboard-brand">Avatar <span>Homes</span></span>
                    <div class="flex-1 flex items-center justify-end xl:justify-between">
                        <button id="toggler"
                            class="flex items-center justify-center h-7 w-7 rounded hover:bg-primary transition ease-linear duration-300 text-gray-400">
                            <span class="material-symbols-outlined">menu</span>
                        </button>
                        <span class="relative order-first flex gap-2 px-1 xl:order-last">
                  <button onclick="notificationpanel()" title="notification" class="qq hover:bg-primary relative flex h-7 w-7 items-center justify-center rounded text-gray-500 transition duration-300 ease-linear">
                    <span class="qq material-symbols-outlined" style="font-size: 19px">notifications</span>
                    <p id="notification_badge_count" class="qq absolute right-[2px] top-[-2.5px] hidden h-3.5 w-3.5 rounded-full bg-[red] px-1 text-[10px] text-white shadow-lg">0</p>
                  </button>
                  <div id="notificationpanel" class="qq absolute left-[-220px] top-10 z-[500] flex !h-[0px] h-[400px] w-[250px] flex-col gap-4 overflow-auto rounded-md bg-[white] px-3 text-center shadow transition-all lg:w-[300px]">
                    <p class="qq mt-3 font-semibold">Notification</p>
                    <hr class="qq opacity-[0.5]" />
                    <p class="qq text-xs font-normal">Your Attention needed!!</p>
                    <div id="notification_content_holder">
                      <!-- <div name="notification_approvenotification" class="qq flex justify-between rounded-md border p-2">-->
                      <!--    <div class="qq flex flex-col gap-2">-->
                      <!--        <p class="qq text-left text-sm font-semibold">Requisition</p>-->
                      <!--        <p class="qq text-xs font-normal">Items needs approval.</p>-->
                      <!--    </div>-->
                      <!--    <p class="qq my-auto rounded-full bg-blue-500 px-1 text-xs text-white">1</p>-->
                      <!--</div> -->
                    </div>
                  </div>
                            <button onclick="logoff()" title="logout" class="flex items-center justify-center h-7 w-7 rounded hover:bg-primary transition ease-linear duration-300 text-gray-500">
                                <span class="material-symbols-outlined" style="font-size:19px">power_settings_new</span>
                            </button>
                        </span>
                    </div>
                </div>
            </header>
            <button id="installBtn" class="hidden">Install App</button>
            <section>
                <div class="xl:flex h-screen relative">
                    <!-- navigation -->
                    <nav id="navigation" class="dashboard-nav fixed top-0 left-0 z-40 lg:relative lg:z-0 w-4/5 xl:w-[250px] h-full bg-white border-r border-gray-200/50 pb-14">
                        <div class="overflow-y-auto overflow-x-hidden h-full">
                            <ul class="font-poppins mt-5">
                                  <li class="nav-item">
                                    <span class="navitem-title group">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">person</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>user</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <!-- <li class="navitem-child" id="profile">Profile</li>     -->
                                        <!-- <li class="navitem-child" id="user/select">Select User</li> -->
                                        <li class="navitem-child" id="access_control">Access Control</li>
                                        <li class="navitem-child" id="user/deactivate">Deactivate User</li>

                                        <li class="navitem-child" id="password">Change Password</li>
                                        <li class="navitem-child" id="organisationinfo">Organisation Info</li>
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <span class="navitem-title group">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">home_app_logo</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Property</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <!--<li class="navitem-child" id="logo">logo</li>-->
                                        <li class="navitem-child" id="propertyregistration">Register Property</li>
                                        <li class="navitem-child" id="viewpropertyregistration">View Property</li>
                                    </ul>
                                </li>
                              
                                <li class="nav-item">
                                    <span class="navitem-title group">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">hotel_class</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>Clients/Sales</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child" id="registeratenant">Register Client</li>
                                        <li class="navitem-child" id="viewtenants">View Clients</li>
                                        <li class="navitem-child" id="rentaproperty">Property Sales</li>
                                        <li class="navitem-child" id="viewrentaproperty">View Property Sales</li>
                                        <li class="navitem-child" id="duerentals">Due Property Payments</li>
                                        <li class="navitem-child" id="moredocuments">more documents</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">point_of_sale</span>
                                            <span class="group-hover:text-primary-g">
                                            <span>other transactions</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child" id="otherpayments">Other Payments</li>
                                        <li class="navitem-child" id="paymenthistory">Payment History</li>
                                        <li class="navitem-child" id="expenses">expenses</li>
                                        <li class="navitem-child" id="viewexpenses">view expenses</li>
                                        <li class="navitem-child" id="net">Net Transactions</li>
                                        <!-- <li class="navitem-child" id="viewmorefees">View More Fees</li> -->
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <span class="navitem-title group">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">account_balance</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>accounts</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child" id="addglaccount">Add GL Account</li>
                                        <li class="navitem-child" id="viewglaccount">View GL Accounts</li>
                                        <li class="navitem-child" id="addgltransaction">Add GL Transaction</li>
                                        <li class="navitem-child" id="gltransactionhistory">GL Transaction History</li>
                                        <li class="navitem-child" id="trialbalance">Trial Balance</li>
                                        <li class="navitem-child" id="incomestatement">Income Statement</li>
                                        <li class="navitem-child" id="balancesheet">Balance Sheet</li>
                                    </ul>
                                </li>
                                <li class="nav-item"> 
                                    <span class="navitem-title group">
                                        <span class="material-symbols-outlined group-hover:text-primary-g"
                                            style="font-size: 20px;">settings</span>
                                        <span class="group-hover:text-primary-g">
                                            <span>settings</span>
                                            <span class="material-symbols-outlined" style="font-size: 15px;">chevron_right</span>
                                        </span>
                                    </span>
                                    <ul class="ml-14 gap-y-4 flex flex-col">
                                        <li class="navitem-child" id="morefees">More Fees</li>
                                        <!-- <li class="navitem-child" id="viewmorefees">View More Fees</li> -->
                                    </ul>
                                </li>
                                
                            </ul>
                        </div>
                    </nav>
                    <section class="flex-1 flex flex-col justify-between pb-14">
                        <!-- content area -->
                        <div  class="overflow-y-auto overflow-x-hidden h-full">
                            <div class="xl:w-5/6 3xl:w-3/5 w-full mx-auto mt-5 p-5 xl:p-0" id="workspace"></div>
                        </div>
                        <footer class="mt-5 p-5 xl:p-0">
                            <p class="xl:w-5/6 3xl:w-3/5 mx-auto py-1 border-t border-gray-200 text-xs text-gray-400"> &copy; 2023 Trecadero.com.ng
                            </p>
                        </footer>
                    </section>
                </div>
            </section>
        </div>
    </main>
     <div class="j-outer-container" id="jmodal-area">
        <div class="modal-content" id="modal-content"></div>
    </div>
    <script src="./js/util.js?v=20260220a"></script>
    <script src="./js/router.js?v=20260220a"></script>
    <script src="./js/index.js?v=20260220a"></script>
    <script src="./js/oreutil.js?v=20260220a"></script>
</body>

</html> 



