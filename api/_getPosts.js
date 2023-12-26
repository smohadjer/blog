import { marked } from 'marked';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

function getTemplate(filename) {
    const pathHbs = path.join(process.cwd(), 'templates', filename);
    console.log('template: ', pathHbs);
    const template = fs.readFileSync(pathHbs, 'utf8');
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate;
}

export default async (req, collection) => {
    const slug = req.query.slug;
    const tag = req.query.tag;

    const query = slug
        ? {slug: slug}
        : tag ? {tags: tag} : {};

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
            // if post has summary instead of content show summary
            // and a link to detail page
            if (item.summary) {
                const link = `<p><a href="/${item.slug}">Read More</a></p>`;
                item.content = marked.parse(item.summary) + link;
            } else {
                item.content = marked.parse(item.content);
            }
        });

        const compiledTemplate = getTemplate('listing.hbs');
        const markup = compiledTemplate({
            posts: data
        });

        return markup;
    }
}
