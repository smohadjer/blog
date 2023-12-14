import path from 'path';
import fs from 'fs';

export function getFileContent(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);
  console.log(absolutePath);
  const fileContent =  fs.readFileSync(absolutePath, 'utf8');
  return fileContent;
};

export default async (req, res) => {
    const postId = req.query.id;
    const json = getFileContent('public/json/data.json');
    const jsonData = JSON.parse(json);

    if (postId) {
        const posts = jsonData.filter(item => item.id === req.query.id);
    }

    const posts = postId ? jsonData.filter(item => item.id === req.query.id)
        : jsonData;

    let markup = '';

    posts.forEach((post) => {
        markup += `<div class="post"><h1>${post.title}</h1></div>`;
    })

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(markup);
}
