import client from './_db.js';
import getPosts from './_getPosts.js';
import insertPost from './_insertPost.js';
import getTags from './_getTags.js';
import getMarkup from './_getMarkup.js';
import { ObjectId } from 'mongodb';

type RequestBody = {
    date: string;
    title: string;
    slug: string;
    content: string;
    summary: string;
    permission: string;
    tags: string;
    post_id: string;
  }

type Request = {
    body: RequestBody;
    method: string;
    query: {
        response: string;
    };
}

export default async (req: Request, res) => {
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
                const tags = await getTags(collection);
                const markup = getMarkup(posts, tags, req);
                res.end(markup);
            }
        }

        if (req.method === 'POST') {
            const obj = await insertPost(req, collection);
            if (obj.id) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.send(`<p>Post successful! Post ID: ${obj.id}<br><a href="/${obj.doc.slug}">${obj.doc.title}</a></p>`);
            } else {
              res.status(500).send({
                error: 500,
                message: obj.error || 'Invalid data!'
              });
            }
        }

        if (req.method === 'DELETE') {
            const query = {_id: new ObjectId(req.body.post_id)};
            const doc = await collection.find(query).toArray();
            const deleteResult = await collection.deleteOne(doc[0]);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(`<p>Deleted ${deleteResult.deletedCount} documents!</p`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
