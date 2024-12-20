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

export const tagStore = {
    getSingle: getSingleTag,
    getAll: getAllTags,
}
