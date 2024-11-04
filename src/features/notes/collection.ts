import { getCollection, z, type CollectionEntry } from "astro:content";

export type Note = CollectionEntry<"notes">;

export const noteSchema = z.object({
	tags: z.array(z.string()).default([]),
	description: z.string().optional(),
	publishedOn: z.date().optional(),
	imageUrl: z.string().optional(),
	title: z.string(),
})

type NotesQuery = {
	includeDrafts?: boolean;
	limit?: number;
}

export const getNotes = async (query?: NotesQuery): Promise<Note[]> => {
	let notes = await getCollection("notes");

	notes.sort((a: Note, b: Note) =>
		!a.data.publishedOn && !b.data.publishedOn
			// Drafts should be sorted by title
			? a.data.title.localeCompare(b.data.title)
			: !!a.data.publishedOn && !!b.data.publishedOn
				// Published notes should be sorted by publication date
				? b.data.publishedOn?.getTime() - a.data.publishedOn?.getTime()
				// Drafts should always come before published notes
				: !a.data.publishedOn && !!b.data.publishedOn
					? -1
					: 1);

	if (!query?.includeDrafts) {
		console.log(notes)
		notes = notes.filter((note: Note) => !!note.data.publishedOn);
	}

	return !!query?.limit
		? notes.slice(0, query?.limit)
		: notes;
}
