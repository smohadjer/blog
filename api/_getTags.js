export default async (collection) => {
    const docs = await collection.find({
        permission: { $ne: 'private' }
    }).toArray();
    const allTags = [];
    docs.forEach(item => {
        if (item.tags) {
            item.tags.forEach(tag => {
                if (!allTags.includes(tag)) {
                    allTags.push(tag);
                }
            });
        }
    });

    return allTags;
}
