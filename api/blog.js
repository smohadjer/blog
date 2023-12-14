import path from 'path';
import fs from 'fs';

export function getFileContent(filePath) {
  //const absolutePath = path.join(process.cwd(), filePath);
  console.log(process.cwd());
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent;
};

export default async (req, res) => {
    const postId = req.query.id;
    const json = getFileContent('api/_json/data.json');
    const jsonData = JSON.parse(json);

    const posts = postId ? jsonData.filter(item => item.id === req.query.id)
        : jsonData;

    let markup = '';

    posts.forEach((post) => {
        markup += `<div class="post"><h1>${post.title}</h1></div>`;
    })

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(markup);
}
