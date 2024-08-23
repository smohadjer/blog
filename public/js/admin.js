const fetchPosts = async () => {
    try {
        const response = await fetch('/api/blog?response=json&permission=all');
        const posts = await response.json();
        return posts;
    } catch (err) {
        console.log(err);
    }
};

const setDateField = (form) => {
    // set date field in form to today's date
    const dateField = form.querySelector('input[name=date]');
    dateField.value = getDateAsIsoString(new Date());
};

init(document.querySelector('form'));


async function init(form) {
    const posts = await fetchPosts();
    const select = document.querySelector('select');

    if (posts) {
        populateSelect(select, posts);
        select.addEventListener('change', (e) => {
            console.log('change fired on select, value = ', e.target.value.length);
            resetForm(form);

            if (e.target.value.length > 0) {
                populateForm(e.target.value, form, posts);
            }
        });
    }

    setDateField(form);

    form.querySelector('input[type=reset]').addEventListener('click', (e) => {
        e.preventDefault();
        resetSelect(select);
        resetForm(form);
    });

    // click handler for delete button
    form.querySelector('#delete').addEventListener('click', (e) => {
        e.preventDefault();
        e.target.setAttribute('disabled', 'disabled');
        const postId = form.querySelector('input[name=post_id]').value;
        const endpoint = form.getAttribute('action') + '/' + postId;
        console.log(endpoint);
        fetch(endpoint, {
            method: 'DELETE',
            body: JSON.stringify({})
        })
            .then((response) => response.text())
            .then((resText) => {
                console.log('deleted blog post!', resText);
                window.location.reload();
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

function resetSelect(select) {
    select.querySelectorAll('option')[0].selected = true;
}

function resetForm(form) {
    console.log('reseting the form...')
    const inputField = form.querySelector('input[name=post_id]');
    if (inputField) {
        inputField.remove();
    }

    form.querySelector('#delete').setAttribute('disabled', 'disabled');
    form.reset();

    setDateField(form);
}

function populateForm(post_id, form, posts) {
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
