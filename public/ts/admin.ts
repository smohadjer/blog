type Post = {
    _id: string;
    title: string;
    [key: string]: string;
};

const fetchPosts = async () => {
    try {
        const response = await fetch('/api/blog?response=json&permission=all');
        const posts = await response.json();
        return posts;
    } catch (err) {
        console.log(err);
    }
};

const setDateField = (form: HTMLFormElement) => {
    // set date field in form to today's date
    const dateField: HTMLInputElement = form.querySelector('input[name=date]')!;
    dateField.value = getDateAsIsoString(new Date());
};

const form: HTMLFormElement = document.querySelector('form')!;

init(form);

async function init(form: HTMLFormElement) {
    const posts: Post[] = await fetchPosts();
    const select: HTMLSelectElement = document.querySelector('select')!;

    if (posts) {
        populateSelect(select, posts);
        select.addEventListener('change', (event) => {
            console.log(event);
            if (event.target instanceof HTMLSelectElement) {
                const select = event.target!;
                console.log('change fired on select, value = ', select.value.length);
                resetForm(form);
                if (event.target.value.length > 0) {
                    populateForm(event.target.value, form, posts);
                }
            }
        });
    }

    setDateField(form);

    form.querySelector('input[type=reset]')!.addEventListener('click', (e) => {
        e.preventDefault();
        resetSelect(select);
        resetForm(form);
    });

    // click handler for delete button
    form.querySelector('#delete')!.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target instanceof Element) {
            e.target.setAttribute('disabled', 'disabled');
            const inputField: HTMLInputElement = form.querySelector('input[name=post_id]')!;
            const postId = inputField.value;
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
        }
    });

    const slugField: HTMLInputElement = form.querySelector('#slug')!;
    const titleField: HTMLInputElement = form.querySelector('#title')!;
    populateSlug(titleField, slugField);
}

// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
function getDateAsIsoString(date: Date) {
    const offset = date.getTimezoneOffset();
    const normalizedDate = new Date(date.getTime() - (offset*60*1000));
    const normalizedDateISO = normalizedDate.toISOString().split('T')[0];
    return normalizedDateISO;
}

function populateSelect(select: HTMLSelectElement, posts: Post[]) {
    let options = '';
    posts.forEach((doc) => {
        options += `<option value=${doc._id}>${doc.title}</option>`;
    });
    const optionsDOM = new DOMParser().parseFromString(options, 'text/html').body.children;
    select.append(...optionsDOM);
    select.removeAttribute('disabled');
    document.querySelector('.loading')!.remove();
}

function resetSelect(select: HTMLSelectElement) {
    select.querySelectorAll('option')[0].selected = true;
}

function resetForm(form: HTMLFormElement) {
    console.log('reseting the form...')
    const inputField = form.querySelector('input[name=post_id]');
    if (inputField) {
        inputField.remove();
    }

    form.querySelector('#delete')!.setAttribute('disabled', 'disabled');
    form.reset();

    setDateField(form);
}

function populateForm(post_id: string, form: HTMLFormElement, posts: Post[]) {
    console.log('populating form...', post_id, posts);
    const post: Post | undefined = posts.find(post => post._id === post_id);
    if (post === undefined) return;
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach((input) => {
        const fieldName = input.getAttribute('name')!;
        if (post[fieldName]) {
            if (input.getAttribute('type') === 'checkbox' && input instanceof HTMLInputElement) {
                input.checked = true;
            } else {
                if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                    input.value = post[fieldName];
                }
            }
        }
    });

    // add an input field for id
    const input = `<input name="post_id" value="${post_id}">`
    const inputElm = new DOMParser().parseFromString(input, 'text/html').body.firstChild!;
    form.append(inputElm);

    form.querySelector('#delete')!.removeAttribute('disabled');
}

// populate slug field from title field
function populateSlug(titleField: HTMLInputElement, slugField: HTMLInputElement) {
    const setSlug = (value: string) => {
        const normalizedValue = value.trim()
            .toLowerCase()
            .replace(/[^a-z0-9\ ]/g, '')
            .replace(/\ /g, '-');
        slugField.value = normalizedValue;
    };

    titleField.addEventListener('keyup', (event) => {
        if (event.target instanceof HTMLInputElement) {
            setSlug(event.target.value);
        }
    });
}
