init(document.querySelector('form'));

function init(form) {
    populateSelect(form);

    // set date field in form to today's date
    const dateField = form.querySelector('input[name=date]');
    dateField.value = getDateAsIsoString(new Date());

    document.querySelector('#new-post').addEventListener('click', () => {
        resetForm(form);
    });
}

// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
function getDateAsIsoString(date) {
    const offset = date.getTimezoneOffset();
    const normalizedDate = new Date(date.getTime() - (offset*60*1000));
    const normalizedDateISO = normalizedDate.toISOString().split('T')[0];
    return normalizedDateISO;
}

async function populateSelect(form) {
    const select = document.querySelector('select');
    try {
        const response = await fetch('/api/blog?response=json');
        const posts = await response.json();
        let options = '';
        posts.forEach((doc) => {
            options += `<option value=${doc._id}>${doc.title}</option>`;
        });
        const optionsDOM = new DOMParser().parseFromString(options, 'text/html').body.children;
        select.append(...optionsDOM);
        select.addEventListener('change', (e) => {
            resetForm(form);
            populateForm(e.target.value, form, posts);
        });
    } catch (err) {
        console.log(err);
    }
}

function resetForm(form) {
    const hiddenField = form.querySelector('input[type=hidden]');
    if (hiddenField) {
        hiddenField.remove();
    }
    form.reset();

    // set date field in form to today's date
    const dateField = form.querySelector('input[name=date]');
    dateField.value = getDateAsIsoString(new Date());
}

function populateForm(post_id, form, posts) {
    if (post_id.length === 0) return;

    const post = posts.find(post => post._id === post_id);
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach((input) => {
        const fieldName = input.getAttribute('name');
        if (post[fieldName]) {
            input.value = post[fieldName];
        }
    });

    // add a hidden input field for id
    const input = `<input type="hidden" name="post_id" value="${post_id}">`
    const inputElm = new DOMParser().parseFromString(input, 'text/html').body.firstChild;
    form.append(inputElm);
}
