import { getCollection, getEntry, reference, z, type CollectionEntry } from "astro:content";
import { buildQuery } from "../../utils/query";

const projectLinkSchema = z.object({
    description: z.string(),
    href: z.string(),
    text: z.string(),
});


const projectSourceSchema = z.object({
    style: z.enum(["normal", "monospace"]).default("normal"),
    title: z.string(),
    href: z.string(),
    icon: z.string(),
});


export const projectSchema = z.object({
    links: z.array(projectLinkSchema).default([]),
    source: projectSourceSchema.optional(),
    tags: z.array(z.string()).default([]),
    note: reference("notes").optional(),
    publishedOn: z.date().optional(),
    description: z.string(),
    title: z.string(),
});

export type ProjectSource = z.infer<typeof projectSourceSchema>;
export type ProjectLink = z.infer<typeof projectLinkSchema>;
export type Project = CollectionEntry<"projects">;

export type ProjectFrontmatter = Project["data"] & {
    readingTime: string;
};

const not = <T>(fn: (value: T) => boolean) => (value: T) => !fn(value);

const isDraft = (project: Project) => !project.data.publishedOn;

const sortProjects = (projects: Project[]) => {
    projects.sort((a, b) =>
        !a.data.publishedOn && !b.data.publishedOn
            // Drafts should be sorted by title
            ? a.data.title.localeCompare(b.data.title)
            : !!a.data.publishedOn && !!b.data.publishedOn
                // Published projects should be sorted by publication date
                ? b.data.publishedOn?.getTime() - a.data.publishedOn?.getTime()
                // Drafts should always come before published projects
                : !a.data.publishedOn && !!b.data.publishedOn
                    ? -1
                    : 1);
}

const getAllProjectsQuery = z.object({
    includeDrafts: z.boolean().default(false),
});

export const getAllProjects = buildQuery(getAllProjectsQuery, async (query) => {
    let projects = await getCollection("projects");
    sortProjects(projects);

    if (!query.includeDrafts) {
        projects = projects.filter(not(isDraft));
    }

    return projects;
})

const getSingleProjectQuery = z.object({
    includeDrafts: z.boolean().default(false),
    slug: z.string(),
})

export const getSingleProject = buildQuery(getSingleProjectQuery, async (query) => {
    const project = await getEntry("projects", query.slug);

    return !!project && (!isDraft(project) || query.includeDrafts)
        ? project
        : undefined;
})

export const projectStore = {
    getSingle: getSingleProject,
    getAll: getAllProjects,
}
