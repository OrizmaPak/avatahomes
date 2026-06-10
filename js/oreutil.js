function validateForm(formm, ids=null) {
    let form = document.getElementById(formm)
    let errorElements = form.querySelectorAll('.control-error')
    let controls = [] 
    
    if(ids){
        for(let i=0;i<ids.length;i++){
            if(controlHasValue(form, `#${ids[i]}`))controls.push([form.querySelector(`#${ids[i]}`), `${form.querySelector(`#${ids[i]}`).previousElementSibling.textContent ? form.querySelector(`#${ids[i]}`).previousElementSibling.textContent : ids[i]} is required`])
        }
    }
    
    return mapValidationErrors(errorElements, controls)   

}

function updateImage(event, id='logoFrame') {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const displayImg = document.getElementById(id);
            displayImg.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

const callController =(controller, params, name, validate, funct, silent, e)=>{ 
    silent ? null : showSpinner();
    if(validate){
        if(!validateInputsComponent(validate)){ 
		hideSpinner();
		return null; 
		}
    }
    var request = getAjaxObject();
    request.open('POST',`../controllers/${controller}`,true);
    request.onreadystatechange = function(){
        if(request.readyState == 1){
        }
        if(request.readyState == 4 && request.status == 200){
            hideSpinner();
                // console.log(`controller request.responseText ${name}:`, request.responseText)
                let result = JSON.parse(request.responseText); 
                //console.log(result);
                if(result["code"] == "invalid session data. Proceed to login"){
                    // window.location.href = "login.php";
                    return;
                }
                if(result["message"] == "invalid session data. Proceed to login"){
                    // window.location.href = "login.php";
                    return;
                }
                if(result["result"] === "ERROR"){
                    // console.log(`contrlr status ${name}: ERROR`);
                    callModal(`Failed: ${result.message ? result.message : ''}`, 0);
                    return null;
                }else{
                    // console.log(`controller ${controller}`, result, 'NB: result returned','name', `${name}`);
                    if(!silent){
                        if(result.message == 'Successful'){
                            callModal(`${result.message ? result.message : 'Successful'}`, 1)
                        }else{
                            callModal(`${result.message ? result.message : 'Successful'}`, 2)
                        }
                    }
                    //console.log(funct)
                    if(funct){
                        return funct(result);
                    } 
                }
        }else{
            hideSpinner();
        }
        try{
            e.stopPropagation();
        }catch(ex){}
    };
    if(params != null){
            //   console.log(name, 'PARAMS BELOW');    
        for (var pair of params.entries()) {
            //   console.log(pair[0] + ', ' + pair[1]);   
            // return(name, pair[0]+ ', ' + pair[1]); 
            }
    }
      
    request.setRequestHeader('Connection','close');
    request.send(params);
};

function previewImage(img="url") {
        var input = document.getElementById(`${img}`);
        var preview = document.getElementById('imagePreview');

        // Clear previous preview
        preview.innerHTML = '';

        // Check if any file is selected
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // Create an image element
                var image = document.createElement('img');
                image.src = e.target.result;
                image.style.width = '200px'; // Set a specific width for the preview (adjust as needed)
                image.style.borderRadius = '10px'; // Set a specific width for the preview (adjust as needed)

                // Append the image to the preview div
                preview.appendChild(image);
            };

            // Read the selected file as a data URL
            reader.readAsDataURL(input.files[0]);
        }
    }

function showFileName(id) {
    const input = document.getElementById(id);
    if (!input || !input.files || input.files.length === 0) return '';
    return input.files[0].name;
}

function getFile(id) {
    const input = document.getElementById(id);
    if (!input || !input.files || input.files.length === 0) return '';
    return input.files[0];
}
    
// TO POPULATE DATA FROM AN ENDPOINT 
function populateData(data){
    let valuesArray = Object.values(data);
            let keysArray = Object.keys(data);
            let mappedKeys = keysArray.map(function(key) {
                return key 
            });
            let mappedValues = valuesArray.map(function(val) {
                return val 
            });
            console.log(mappedKeys, mappedValues)
            for(let i=0;i<mappedKeys.length;i++){
                try{
                    if(document.getElementById(`${mappedKeys[i]}`))document.getElementById(`${mappedKeys[i]}`).value = mappedValues[i]
                }catch(err){
                    console.log(err)
                }
            }
}

// RESOLVING FORMDATA AND ACCOUNTING FOR ADDITIONAL DATA... NB:additional = [ ['id', 12], ['name', 'oreva'], ['age', 23] ]
const getFormData2 =(form=null, additional=[])=> {
    let formdata = new FormData(form)
    if(additional){
        for(let i=0;i<additional.length;i++){
            formdata.append(`${additional[i][0]}`, additional[i][1])
        }
    }
    formdata.forEach(function (value, key) {
        console.log(`${key}: ${value}`);
    });
    return formdata
} 

//TO SCROLL TO THE TOP
function scrollToTop(id=null) {
    if(id)document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // You can use 'auto' or 'smooth' for scrolling behavior
    });
}

// TO GET ALL IDS
function getallid(cls){
    let idss = []
    for(let i=0; i<document.getElementsByClassName(`${cls}`).length; i++){
        idss.push(document.getElementsByClassName(`${cls}`)[i].id)
    }
    return idss
} 

// GENERATE RANDOM NUMBERS
function randomId() { 
  let timestamp = new Date().getTime();
  return Math.floor(timestamp % Number.MAX_SAFE_INTEGER);
}

function did(element){
  return document.getElementById(element);
}

function getIdFromCls(cls, scope = null){
  let root = scope;
  if (typeof scope === 'string') root = document.getElementById(scope);
  if (!root) root = document;
  const ids = [];
  const elements = root.getElementsByClassName(cls);
  for (let i = 0; i < elements.length; i++) ids.push(elements[i].id);
  return ids;
}

function genID() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000);
  return `${timestamp}${randomPart}`;
}

function getLabelByValue(id, value) {
  const selectElement = document.getElementById(id);
  if (!selectElement) return null;
  for (const option of selectElement.options) {
    if (option.value === value) return option.text;
  }
  return null;
}

const checkdatalist = (element, id, dlist = '', clear = true) => {
  if (!element?.value) return;
  if (!element.getAttribute('list')) {
    if (id && document.getElementById(id)) document.getElementById(id).value = element.value;
    return true;
  }
  if (!element.list?.id) return true;
  const listId = element.list.id;
  const datalistElement = document.getElementById(listId);
  if (!datalistElement) return true;
  const datalistOptions = datalistElement.options;
  const inputValue = element.value;

  let isMatch = false;
  for (let i = 0; i < datalistOptions.length; i++) {
    if (inputValue === datalistOptions[i].value) {
      isMatch = true;
      break;
    }
  }

  if (isMatch) {
    if (id && document.getElementById(id)) {
      document.getElementById(id).value = getLabelByValue(dlist ? dlist : listId, element.value) || element.value;
    }
    return true;
  }

  if (clear) {
    notification(`${inputValue} is not a valid option`, 0);
    const initialBorder = element.style.borderColor;
    element.style.borderColor = 'red';
    element.style.color = 'red';
    element.value = '';
    setTimeout(() => {
      element.style.borderColor = initialBorder;
      element.style.color = 'black';
    }, 3000);
    if (id && document.getElementById(id)) document.getElementById(id).value = '';
    return false;
  }

  if (id && document.getElementById(id)) document.getElementById(id).value = element.value;
  return false;
}

function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  });
  return formatter.format(amount || 0);
}


// FORMAT NUMBER
function formatNumber(number) {
           if (isNaN(number)) {
                      return '0';
           }
           return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// FORMAT DATE
function formatDate(inputDate) {
    // Parse the inputDate string to create a Date object
    var date = new Date(inputDate);

    // Check if the parsed date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    // Get the day, month, and year from the parsed date
    var day = date.getDate();
    var month = date.toLocaleString('en-us', { month: 'short' });
    var year = date.getFullYear();

    // Add ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th, ...)
    var dayWithSuffix = day + getOrdinalSuffix(day);

    // Format the date as "22nd Dec, 2023"
    var formattedDate = dayWithSuffix + ' ' + month + ', ' + year;

    return formattedDate;
}

// Function to get the ordinal suffix for a given day
function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }

    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

// TO PRINT

function printTable() {
    // Get the table content
    const tableContent = document.querySelector('.table-content');

    // Check if the table content exists
    if (tableContent) {
        // Clone the table content to avoid modifying the original
        const clonedContent = tableContent.cloneNode(true);

        // Remove the "action" column from the cloned content
        const headers = clonedContent.querySelectorAll('thead th');
        const lastHeader = headers[headers.length - 1];

        if (lastHeader.textContent.trim().toLowerCase() === 'action') {
            lastHeader.parentNode.removeChild(lastHeader);

            const dataRows = clonedContent.querySelectorAll('tbody tr');
            dataRows.forEach(row => {
                const lastCell = row.querySelector('td:last-child');
                if (lastCell) {
                    lastCell.parentNode.removeChild(lastCell);
                }
            });
        } else {
            console.warn('Last column header is not titled "Action". No action taken.');
        }

        // Create a new window and append the cloned content with inline styles
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title><link rel="stylesheet" href="./css/index.css"><link rel="stylesheet" href="./css/css_vanilla.css"></head><body>');
        printWindow.document.body.appendChild(clonedContent);
        printWindow.document.write('</body></html>');

        // Trigger the print dialog
        printWindow.print();
        printWindow.document.close();
    } else {
        console.error('Table content not found.');
    }
}


// TO EXPORT TO EXCEL
function exportToExcel(tableId = null, filename = 'table-export') {
    let tableElement = null;
    if (tableId && typeof tableId === 'string') {
        const maybeTable = document.getElementById(tableId);
        if (maybeTable) tableElement = maybeTable.tagName?.toLowerCase() === 'table' ? maybeTable : maybeTable.querySelector('table');
    }
    if (!tableElement) {
        tableElement = document.querySelector('.table-content table');
    }
    if (!tableElement) {
        console.error('Table content not found.');
        return;
    }

    const clonedTable = tableElement.cloneNode(true);
    const headers = clonedTable.querySelectorAll('thead th');
    const lastHeader = headers[headers.length - 1];
    if (lastHeader && lastHeader.textContent.trim().toLowerCase() === 'action') {
        lastHeader.parentNode.removeChild(lastHeader);
        const dataRows = clonedTable.querySelectorAll('tbody tr');
        dataRows.forEach(row => {
            const lastCell = row.querySelector('td:last-child');
            if (lastCell) lastCell.parentNode.removeChild(lastCell);
        });
    }

    const csvContent = Array.from(clonedTable.querySelectorAll('tr'))
        .map(row => Array.from(row.children).map(cell => `"${cell.textContent.trim()}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

async function exportToPDF(id, vertical = false) {
    const element = document.getElementById(id);
    if (!element) return notification('Unable to export PDF. Content not found.', 0);

    if (!window.html2pdf) {
        await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = resolve;
            document.head.appendChild(script);
        });
    }
    if (!window.html2pdf) return notification('Unable to load PDF helper.', 0);

    const options = {
        margin: 10,
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: vertical ? 'landscape' : 'portrait' }
    };
    window.html2pdf().set(options).from(element).save();
}

if (typeof window !== 'undefined') {
    try {
        if (typeof getFormData2 === 'function') window.getFormData2 = getFormData2;
        if (typeof validateForm === 'function') window.validateForm = validateForm;
        if (typeof populateData === 'function') window.populateData = populateData;
        if (typeof getallid === 'function') window.getallid = getallid;
        if (typeof did === 'function') window.did = did;
        if (typeof getIdFromCls === 'function') window.getIdFromCls = getIdFromCls;
        if (typeof genID === 'function') window.genID = genID;
        if (typeof checkdatalist === 'function') window.checkdatalist = checkdatalist;
        if (typeof formatCurrency === 'function') window.formatCurrency = formatCurrency;
        if (typeof exportToExcel === 'function') window.exportToExcel = exportToExcel;
        if (typeof exportToPDF === 'function') window.exportToPDF = exportToPDF;
    } catch (e) {
        console.log('utility export bridge failed', e);
    }
}











// LIST OF ALL THE COUNTRIES IN THE WORLD
const oreCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
  "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

function loadCountries(){
     if(document.getElementById('countrylist'))document.getElementById('countrylist').innerHTML = oreCountries.map(data=>`<option value="${data}"/>`).join('')
}
