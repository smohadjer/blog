type Query = {
    slug?: string;
    tags?: string;
    permission?: {};
}

export default function setQuery(slug, tag, permission) {
    const query: Query = {};

    if (slug) {
        query.slug = slug;
    } else if (tag) {
        query.tags = tag;
        if (!permission) {
            query.permission = { $ne: 'private' }
        }
    } else if (!permission) {
        /* if no permission parameter is sent with request we only show
        posts that are not marked as private */
        query.permission = { $ne: 'private' }
    }

    return query;
}
