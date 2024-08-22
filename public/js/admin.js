const fetchPosts = async () => {
    try {
        const response = await fetch('/api/blog?response=json&permission=all');
        const posts = await response.json();
        return posts;
    } catch (err) {
        console.log(err);
    }
};

init(document.querySelector('form'));

async function init(form) {
    const posts = await fetchPosts();
    if (posts) {
        const select = document.querySelector('select');
        populateSelect(select, posts);
        select.addEventListener('change', (e) => {
            resetForm(form);
            populateForm(e.target.value, form, posts);
        });
    }

    // set date field in form to today's date
    const dateField = form.querySelector('input[name=date]');
    dateField.value = getDateAsIsoString(new Date());

    form.querySelector('input[type=reset]').addEventListener('click', (e) => {
        resetForm(form);
    });

    // click handler for delete button
    form.querySelector('#delete').addEventListener('click', (e) => {
        e.preventDefault();
        const postId = form.querySelector('input[name=post_id]').value;
        const endpoint = form.getAttribute('action') + '/' + postId;
        console.log(endpoint);
        fetch(endpoint, {
            method: 'DELETE',
            body: JSON.stringify({})
        }).then(() => {
            console.log('deleted blog post!');
        }).catch((err) => {
            console.error(err);
        });
    });

    const slugField = form.querySelector('#slug');
    const titleField = form.querySelector('#title');
    populateSlug(titleField, slugField);
}

// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
function getDateAsIsoString(date) {
    const offset = date.getTimezoneOffset();
    const normalizedDate = new Date(date.getTime() - (offset*60*1000));
    const normalizedDateISO = normalizedDate.toISOString().split('T')[0];
    return normalizedDateISO;
}

function populateSelect(select, posts) {
    let options = '';
    posts.forEach((doc) => {
        options += `<option value=${doc._id}>${doc.title}</option>`;
    });
    const optionsDOM = new DOMParser().parseFromString(options, 'text/html').body.children;
    select.append(...optionsDOM);
    select.removeAttribute('disabled');
    document.querySelector('.loading').remove();
}

function resetForm(form) {
    const inputField = form.querySelector('input[name=post_id]');
    if (inputField) {
        inputField.remove();
    }

    form.querySelector('#delete').setAttribute('disabled', 'disabled');

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
            if (input.getAttribute('type') === 'checkbox') {
                input.checked = true;
            } else {
                input.value = post[fieldName];
            }
        }
    });

    // add an input field for id
    const input = `<input name="post_id" value="${post_id}">`
    const inputElm = new DOMParser().parseFromString(input, 'text/html').body.firstChild;
    form.append(inputElm);

    form.querySelector('#delete').removeAttribute('disabled');
}

// populate slug field from title field
function populateSlug(titleField, slugField) {
    const setSlug = (value) => {
        const normalizedValue = value.trim()
            .toLowerCase()
            .replace(/[^a-z0-9\ ]/g, '')
            .replace(/\ /g, '-');
        slugField.value = normalizedValue;
    };

    titleField.addEventListener('keyup', (event) => {
        setSlug(event.target.value);
    });
}

