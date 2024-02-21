import { ObjectId } from 'mongodb';

export default async (req, collection) => {
    const document = {
      date: req.body.date,
      title: req.body.title.trim(),
      slug: req.body.slug.trim().replace('.html', ''),
      content: req.body.content,
    };

    if (req.body.summary) {
        document.summary = req.body.summary;
    }

    if (req.body.permission) {
      document.permission = req.body.permission;
    }

    if (req.body.tags) {
        const tagsString = req.body.tags.replaceAll(' ', '').toLowerCase();
        document.tags = tagsString.split(',');
    }

    if (req.body.post_id) {
      const query = {_id: new ObjectId(req.body.post_id)};
      const result = await collection.replaceOne(query, document);
      return {
        id: req.body.post_id,
        doc: document
      }
    } else {
      const doc = await collection.findOne({ slug: document.slug});
      if (doc) {
        return {
          error: 'A document with same slug already exists!'
        }
      } else {
        const insertResponse = await collection.insertOne(document);
        return {
          id: insertResponse.insertedId,
          doc: document
        }
      }
    }
}
