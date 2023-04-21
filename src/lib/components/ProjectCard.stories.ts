import type { Meta, StoryObj } from '@storybook/svelte';
import { Platform } from '$lib/types/Platform';
import ProjectCard from './ProjectCard.svelte';
import { Language } from '$lib/types/Language';

const details = {
    title: 'Components/Project Card',
    component: ProjectCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }
} satisfies Meta<ProjectCard>;

export default details;

type Story = StoryObj<typeof details>;

export const GithubProject: Story = {
    args: {
        title: "My cool new project!",
        description: 'This is my project that I am very proud of.',
        repository: 'icorbrey/project',
        platform: Platform.Github,
        language: Language.Rust,
        href: '#'
    }
};
