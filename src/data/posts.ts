import { getCollection } from "astro:content";

const getAll = async () => await getCollection("posts");

const getMostRecent = async (limit: number) => {
    const posts = await getAll();
    posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
    return posts.slice(0, limit);
}

export const posts = {
    getAll,
    getMostRecent,
}
