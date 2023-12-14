import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import client from './_db.js';
import { ObjectId } from 'mongodb';
import marked from 'marked';

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
    try {
        await client.connect();
        const database = client.db('blog');
        const collection = database.collection('demo-posts');
        console.log('slug:', req.query.slug);
        const slug = req.query.slug;
        const query = (slug && slug.length > 0) ? {'slug': slug} : {};

        if (req.method === 'GET') {
            const data = await collection.find(query).toArray();
            data.map((item) => {
                item.content = marked.parse(item.content);
            });
            const compiledTemplate = getTemplate();
            const markup = compiledTemplate({
                posts: data
            });

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(markup);
          }

          if (req.method === 'POST') {
            const obj = await insertPost(posts, req);
            if (obj.id) {
              // create or update blog files on github using github API
              await github(obj.doc, obj.id);

              res.status(200).send({
                message: 'Post inserted!',
                post_id: obj.id
              });
            } else {
              res.status(500).send({
                error: 500,
                message: obj.error || 'Invalid data!'
              });
            }
          }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    // const postId = req.query.id;
    // const json = getFileContent('data.json');

    // const jsonData = JSON.parse(json);

    // const posts = postId ? jsonData.filter(item => item.id === req.query.id)
    //     : jsonData;

}
