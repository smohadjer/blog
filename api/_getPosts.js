import marked from 'marked';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

function getTemplate() {
    //const pathHbs = path.join(process.cwd(), 'public', 'blog.hbs');
    const pathHbs = path.join(process.cwd(), 'api', '_blog.hbs');
    const template = fs.readFileSync(pathHbs, 'utf8');
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate;
}

export default async (req, collection) => {
    const slug = req.query.slug;
    const query = (slug && slug.length > 0) ? {'slug': slug} : {};
    const data = await collection.find(query).toArray();

    // detail page
    if (slug && slug.length > 0) {
        data.map((item) => {
            item.content = marked.parse(item.content);
        });
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
    }

    const compiledTemplate = getTemplate();
    const markup = compiledTemplate({
        posts: data
    });

    return markup;
}
