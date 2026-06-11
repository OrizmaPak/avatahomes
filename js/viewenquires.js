let viewenquiresid;

function formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setCurrentWeekDefaults(form) {
    const startDateInput = form.querySelector('#startdate');
    const endDateInput = form.querySelector('#enddate');
    if (!startDateInput || !endDateInput) return;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    startDateInput.value = formatDateInputValue(weekStart);
    endDateInput.value = formatDateInputValue(weekEnd);
}

async function viewenquiresActive() {
    const form = document.querySelector('#viewenquiresform');
    if (!form) return;

    const submitButton = form.querySelector('#submit');
    if (submitButton) submitButton.addEventListener('click', () => viewenquiresFormSubmitHandler('payload'));
    setCurrentWeekDefaults(form);

    datasource = [];
    await viewenquiresFormSubmitHandler();
}

function viewenquiresPayload(extra = []) {
    const form = document.querySelector('#viewenquiresform');
    if (!form) return null;

    const payload = new FormData();
    const startDate = form.querySelector('#startdate')?.value.trim();
    const endDate = form.querySelector('#enddate')?.value.trim();

    if (startDate) payload.append('startdate', startDate);
    if (endDate) payload.append('enddate', endDate);

    if (Array.isArray(extra)) {
        extra.forEach(([key, value]) => payload.append(key, value));
    }

    return Array.from(payload.keys()).length ? payload : null;
}

function formatInquiryType(value, label = '') {
    if (label) return label;
    if (value === 'BUY_PROPERTY') return 'Buy Property';
    if (value === 'GENERAL_INQUIRY') return 'General Inquiry';
    return value || '-';
}

async function fetchSingleEnquire(id) {
    const payload = viewenquiresPayload([['id', id]]);
    return httpRequest2('../controllers/fetchinquiries.php', payload, null, 'json');
}

async function showEnquireDetails(id) {
    const request = await fetchSingleEnquire(id);
    if (!request || !request.status || !request.data || !request.data.length) {
        return notification('Unable to fetch enquiry details', 0);
    }

    const item = request.data[0];
    viewenquiresid = item.id;

    Swal.fire({
        title: `<span style="color:black;">${item.firstname} ${item.lastname}</span>`,
        html: `
            <div class="text-left text-sm" style="text-align:left;color:#1f2937;">
                <p><strong>Date:</strong> ${item.created_at || '-'}</p>
                <p><strong>Other Names:</strong> ${item.othernames || '-'}</p>
                <p><strong>Email:</strong> ${item.email || '-'}</p>
                <p><strong>Phone:</strong> ${item.phone || '-'}</p>
                <p><strong>Request:</strong> ${formatInquiryType(item.inquirytype, item.inquirytype_label)}</p>
                <p><strong>Address:</strong> ${item.address || '-'}</p>
                <p><strong>More Details:</strong><br>${item.moredetails || '-'}</p>
            </div>
        `,
        width: '48rem',
        confirmButtonText: 'Close'
    });
}

async function onviewenquiresTableDataSignal() {
    const rows = getSignaledDatasource().map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.created_at || '-'}</td>
            <td>${item.firstname || ''} ${item.lastname || ''}</td>
            <td>${item.email || '-'}</td>
            <td>${item.phone || '-'}</td>
            <td>${formatInquiryType(item.inquirytype, item.inquirytype_label)}</td>
            <td>${item.address || '-'}</td>
            <td class="flex items-center gap-3">
                <button title="View enquiry" onclick="showEnquireDetails('${item.id}')" class="material-symbols-outlined rounded-full bg-primary-g h-8 w-8 text-white drop-shadow-md text-xs" style="font-size: 18px;">visibility</button>
            </td>
        </tr>
    `).join('');

    injectPaginatatedTable(rows);
}

async function viewenquiresFormSubmitHandler(flag = '') {
    document.getElementById('tabledata').innerHTML = '';

    const button = flag ? document.querySelector('#viewenquiresform #submit') : null;
    const payload = flag ? viewenquiresPayload() : null;
    const request = await httpRequest2('../controllers/fetchinquiries.php', payload, button, 'json');

    if (request && request.status === true) {
        if (request.data.length) {
            datasource = request.data;
            resolvePagination(datasource, onviewenquiresTableDataSignal);
        } else {
            document.getElementById('tabledata').innerHTML = 'No records retrieved';
        }
        return;
    }

    notification(request?.message || 'Unable to retrieve enquiries', 0);
}
