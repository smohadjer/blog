type Item = {
    tags: string[]
};

export default async (collection) => {
    const docs = await collection.find({
        permission: { $ne: 'private' }
    }).toArray();
    const allTags: string[] = [];
    docs.forEach((item: Item) => {
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
