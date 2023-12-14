import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

function getFileContent(filename) {
  const absolutePath = path.join(process.cwd(), 'public', 'json', filename);
  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  return fileContent;
};

function getTemplate() {
    const pathHbs = path.join(process.cwd(), 'public', 'blog.hbs');
    const template = fs.readFileSync(pathHbs, 'utf8');
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate;
}


export default async (req, res) => {
    const postId = req.query.id;
    const json = getFileContent('data.json');

    const jsonData = JSON.parse(json);

    const posts = postId ? jsonData.filter(item => item.id === req.query.id)
        : jsonData;

    console.log(posts);

    const compiledTemplate = getTemplate();
    const markup = compiledTemplate({
        posts: posts
    });
    console.log(markup)

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(markup);
}
