import client from './_db.js';
import getPosts from './_getPosts.js';
import insertPost from './_insertPost.js';

export default async (req, res) => {
    try {
        await client.connect();
        const database = client.db('blog');
        const collection = database.collection('demo-posts');

        if (req.method === 'GET') {
            const posts = await getPosts(req, collection);

            if (req.query.response === 'json') {
                res.setHeader('Content-Type', 'application/json');
                res.json(posts);
            } else {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(posts);
            }
        }

        if (req.method === 'POST') {
            const obj = await insertPost(req, collection);
            if (obj.id) {
            //   res.status(200).send({
            //     message: 'Post inserted!',
            //     post_id: obj.id
            //   });
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.send(`<p>Post successful! Post ID: ${obj.id}<br><a href="/${obj.doc.slug}">${obj.doc.title}</a>`);
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
}
