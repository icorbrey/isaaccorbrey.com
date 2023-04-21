import type { Meta, StoryObj } from '@storybook/svelte';
import Heading from './Heading.svelte';

const details = {
    title: 'Components/Heading',
    component: Heading,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }
} satisfies Meta<Heading>;

export default details;

type Story = StoryObj<typeof details>;

export const GithubProject: Story = {
    args: {}
};
