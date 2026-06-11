window.addEventListener('DOMContentLoaded', initializeExternalInquiryForm, false)

let inquiryNotifier

function getInquiryNotifier() {
    if (inquiryNotifier) return inquiryNotifier
    if (typeof Notyf === 'undefined') return null

    inquiryNotifier = new Notyf({
        duration: 4500,
        position: {
            x: 'right',
            y: 'top'
        },
        types: [
            {
                type: 'success',
                background: '#2f8f3d',
                icon: false
            },
            {
                type: 'error',
                background: '#c35a1b',
                icon: false
            }
        ]
    })

    return inquiryNotifier
}

function notifyInquiry(message, type = 'error') {
    const notifier = getInquiryNotifier()
    if (!notifier) {
        notification(message, type === 'success' ? 1 : 0)
        return
    }

    notifier.open({
        type,
        message
    })
}

function initializeExternalInquiryForm() {
    const form = document.getElementById('external-inquiry-form')
    if(!form) return

    const submitButton = form.querySelector('button#submit')
    if(submitButton) submitButton.addEventListener('click', submitExternalInquiry, false)

    form.addEventListener('keydown', function(event) {
        if(event.key !== 'Enter') return
        event.preventDefault()
        submitExternalInquiry()
    })
}

async function submitExternalInquiry() {
    const form = document.getElementById('external-inquiry-form')
    if(!form) return
    if(!runExternalInquiryValidations(form)) return
 
    const payload = new FormData(form)
    payload.set('role', 'STAFF')

    const submitButton = form.querySelector('button#submit')
    const result = await httpRequest('../controllers/addinquiry.php', payload, submitButton)

    if(result && result.status && Number(result.code) === 200) {
        notifyInquiry('Inquiry registration submitted successfully.', 'success')
        form.reset()
        return
    }

    if(result && result.message) {
        notifyInquiry(result.message, 'error')
        return
    }

    notifyInquiry('Unable to submit inquiry at this time. Please try again.', 'error')
}

function runExternalInquiryValidations(form) {
    const controls = []
    const errorElements = form.querySelectorAll('.control-error')

    const firstname = form.querySelector('#firstname')
    const lastname = form.querySelector('#lastname')
    const othernames = form.querySelector('#othernames')
    const email = form.querySelector('#email')
    const phone = form.querySelector('#phone')
    const address = form.querySelector('#address')
    const inquirytype = form.querySelector('#inquirytype')
    const moredetails = form.querySelector('#moredetails')

    if(firstname.value.trim().length < 1) controls.push([firstname, 'First name is required'])
    if(lastname.value.trim().length < 1) controls.push([lastname, 'Last name is required'])
    if(othernames.value.trim().length < 1) controls.push([othernames, 'Other names are required'])

    if(email.value.trim().length < 1) controls.push([email, 'Email is required'])
    else if(!email.value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        controls.push([email, 'Email is not a valid address'])
    }

    if(phone.value.trim().length < 1) controls.push([phone, 'Phone is required'])
    if(address.value.trim().length < 1) controls.push([address, 'Address is required'])
    if(inquirytype.value.trim().length < 1) controls.push([inquirytype, 'Please select your request'])
    if(moredetails && moredetails.value.trim().length < 1) controls.push([moredetails, 'Please add a short detail'])

    errorElements.forEach(item => item.remove())

    if(controls.length) {
        controls.forEach(item => {
            const errorElement = document.createElement('span')
            errorElement.classList.add('control-error', 'dom-entrance')
            const control = item[0]
            const message = item[1]
            errorElement.textContent = message 
            control.parentElement.appendChild(errorElement)
        })
        return false
    }

    return true
}
 
