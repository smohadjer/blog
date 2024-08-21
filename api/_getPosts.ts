import setQuery from './_setQuery.js';

export default async (req, collection) => {
    const slug = req.query.slug;
    const tag = req.query.tag;
    const permission = req.query.permission;
    const query = setQuery(slug, tag, permission);
    const data = await collection.find(query).sort({'date': -1}).toArray();
    return data;
}
