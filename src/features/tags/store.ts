import { getCollection, getEntry, z, type CollectionEntry } from "astro:content";

export const tagSchema = z.object({
    imageUrl: z.string().optional(),
    description: z.string(),
});

export type Tag = CollectionEntry<"tags">;

export const getAllTags = async () => {
    return getCollection("tags");
}

export const getSingleTag = async (slug: string) => {
    return await getEntry("tags", slug);
}

export const getMultipleTags = async (tags: string[]) => {
    return (await getAllTags()).filter(({ id }) => tags.includes(id));
}

export const tagStore = {
    getMultiple: getMultipleTags,
    getSingle: getSingleTag,
    getAll: getAllTags,
}
