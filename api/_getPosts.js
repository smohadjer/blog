import { marked } from 'marked';
import getTags from './_getTags.js';
import getTemplate from './_getTemplate.js';
import setQuery from './_setQuery.js';

export default async (req, collection) => {
    const slug = req.query.slug;
    const tag = req.query.tag;
    const permission = req.query.permission;
    const query = setQuery(slug, tag, permission);
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
            posts: data,
            tags: await getTags(collection)
        });

        return markup;
    }
}
