type Document = {
    tags?: string[]
};
type Tag = {
    label: string;
    count: number;
}

const addTag = (tag: string, allTags: Tag[]) => {
    const foundItem = allTags.find(item => item.label === tag);
    if (foundItem) {
        foundItem.count += 1;
    } else {
        allTags.push({
            label: tag,
            count: 1
        });
    }
}

export default async (collection) => {
    const allTags: Tag[] = [];
    const docs = await collection.find({
        permission: { $ne: 'private' }
    }).toArray();

    docs.forEach((doc: Document) => {
        if (doc.tags) {
            doc.tags.forEach((tag) => {
                addTag(tag, allTags);
            });
        }
    });

    // sort tags based on how often they are used
    allTags.sort((a, b) =>  b.count - a.count);
    return allTags;
}
