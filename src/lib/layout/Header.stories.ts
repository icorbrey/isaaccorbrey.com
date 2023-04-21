import type { Meta, StoryObj } from '@storybook/svelte';
import Header from './Header.svelte';

const details = {
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<Header>;

export default details;

type Story = StoryObj<typeof details>;

export const Always: Story = {};
