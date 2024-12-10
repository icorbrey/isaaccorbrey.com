import { getCollection, getEntry, z, type CollectionEntry } from "astro:content";
import { buildQuery } from "../utils/query";

export const noteSchema = z.object({
	blueskyPostUri: z.string().optional(),
	tags: z.array(z.string()).default([]),
	description: z.string().optional(),
	publishedOn: z.date().optional(),
	imageUrl: z.string().optional(),
	title: z.string(),
});

export type Note = CollectionEntry<"notes">;

export type NoteFrontmatter = Note["data"] & {
	readingTime: string;
};

const not = <T>(fn: (value: T) => boolean) => (value: T) => !fn(value);

const isDraft = (note: Note) => !note.data.publishedOn;

const isTaggedWith = (tags: string[]) => (note: Note) =>
	0 < tags.filter(t => note.data.tags.includes(t)).length

const sortNotes = (notes: Note[]) => {
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
}

const getAllNotesQuery = z.object({
	includeDrafts: z.boolean().default(false),
})

export const getAllNotes = buildQuery(getAllNotesQuery, async (query) => {
	let notes = await getCollection("notes");
	sortNotes(notes);

	if (!query.includeDrafts) {
		notes = notes.filter(not(isDraft));
	}

	return notes;
})

const getSingleNoteQuery = z.object({
	includeDrafts: z.boolean().default(false),
	slug: z.string(),
})

export const getSingleNote = buildQuery(getSingleNoteQuery, async (query) => {
	const note = await getEntry("notes", query.slug);

	return !!note && (!isDraft(note) || query.includeDrafts)
		? note
		: undefined;
});

const recentNotesQuery = z.object({
	includeDrafts: z.boolean().default(false),
	limit: z.number().default(10),
})

export const getRecentNotes = buildQuery(recentNotesQuery, async (query) => {
	const notes = await getAllNotes({
		includeDrafts: query.includeDrafts,
	});

	return notes.slice(0, query.limit);
});

const taggedNotesQuery = z.object({
	includeDrafts: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
});

export const getTaggedNotes = buildQuery(taggedNotesQuery, async (query) => {
	const notes = await getAllNotes({
		includeDrafts: query.includeDrafts,
	});

	return notes.filter(isTaggedWith(query.tags))
})

const getNotesByYearQuery = z.object({
	includeDrafts: z.boolean().default(false),
});

export const getNotesByYear = buildQuery(getNotesByYearQuery, async (query) => {
	const notes = await getAllNotes({
		includeDrafts: query.includeDrafts,
	});

	const groups = notes.reduce((acc: { [key: string]: Note[] }, note) => {
		const year = note.data.publishedOn?.getUTCFullYear().toString() ?? "Unpublished notes";
		acc[year] = [...acc[year] ?? [], note];
		return acc;
	}, {})

	const noteGroups = Object.keys(groups).map(title => ({
		notes: groups[title],
		title,
	}));

	noteGroups.sort((a, b) => b.title.localeCompare(a.title))

	return noteGroups
})

export const noteStore = {
	getByYear: getNotesByYear,
	getRecent: getRecentNotes,
	getTagged: getTaggedNotes,
	getSingle: getSingleNote,
}
