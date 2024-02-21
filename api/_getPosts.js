import { marked } from 'marked';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

function getTemplate(filename) {
    const pathHbs = path.join(process.cwd(), 'templates', filename);
    const footerHbs = path.join(process.cwd(), 'templates', 'footer.hbs');
    const headerHbs = path.join(process.cwd(), 'templates', 'header.hbs');
    console.log('template: ', pathHbs);
    const template = fs.readFileSync(pathHbs, 'utf8');

    const footer = fs.readFileSync(footerHbs, 'utf8');
    const header = fs.readFileSync(headerHbs, 'utf8');
    Handlebars.registerPartial('footer', footer);
    Handlebars.registerPartial('header', header);

    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate;
}

export default async (req, collection) => {
    const slug = req.query.slug;
    const tag = req.query.tag;
    const permission = req.query.permission;
    const query = {};

    if (slug) {
        query.slug = slug;
    } else if (tag) {
        query.tags = tag;
        if (!permission) {
            query.permission = { $ne: 'private' }
        }
    } else if (!permission) {
        /* if no permission parameter is sent with request we only show
        posts that are not marked as private */
        query.permission = { $ne: 'private' }
    }

    console.log(query);

    const data = await collection.find(query).sort({'date': -1}).toArray();

    if (req.query.response === 'json') {
        return data;
    }

    // detail page
    if (slug && slug.length > 0) {
        data.map((item) => {
            item.content = marked.parse(item.content);
        });

        const compiledTemplate = getTemplate('detail.hbs');
        const markup = compiledTemplate(data[0]);
        return markup;
    // listing page
    } else {
        data.map((item) => {
            const markdown = item.summary ? item.summary : item.content;
            item.content =  marked.parse(markdown);
        });

        const compiledTemplate = getTemplate('listing.hbs');
        const markup = compiledTemplate({
            posts: data
        });

        return markup;
    }
}
