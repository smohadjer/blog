import client from './_db.js';
import { ObjectId } from 'mongodb';
import getPosts from './_getPosts.js';

export default async (req, res) => {
    try {
        await client.connect();
        const database = client.db('blog');
        const collection = database.collection('demo-posts');

        if (req.method === 'GET') {
            const markup = await getPosts(req, collection);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(markup);
        }

        if (req.method === 'POST') {
            // const obj = await insertPost(posts, req);
            // if (obj.id) {
            //   // create or update blog files on github using github API
            //   await github(obj.doc, obj.id);

            //   res.status(200).send({
            //     message: 'Post inserted!',
            //     post_id: obj.id
            //   });
            // } else {
            //   res.status(500).send({
            //     error: 500,
            //     message: obj.error || 'Invalid data!'
            //   });
            // }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
