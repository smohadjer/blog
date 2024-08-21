import getTemplate from './_getTemplate.js';
import { marked } from 'marked';

export default (posts, tags, req) => {
    // detail page
    if (req.body.slug && req.body.slug.length > 0) {
        posts.map((item) => {
            item.content = marked.parse(item.content);
        });
        const compiledTemplate = getTemplate('detail.hbs');
        return compiledTemplate(posts[0]);
    // listing page
    } else {
        posts.map((item) => {
            const markdown = item.summary ? item.summary : item.content;
            item.content =  marked.parse(markdown);
        });
        const compiledTemplate = getTemplate('listing.hbs');
        return compiledTemplate({posts, tags});
    }
}
