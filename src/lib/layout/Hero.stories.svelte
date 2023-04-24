<script>
    import { Meta, Story } from '@storybook/addon-svelte-csf';
    import Hero from './Hero.svelte';
    import Heading from '$lib/components/text/Heading.svelte';
    import Paragraph from '$lib/components/text/Paragraph.svelte';
</script>

<Meta title="Layout/Hero" component={Hero} />

<Story name="Demo">
    <Hero>
        <Heading>Hero Heading</Heading>
        <Paragraph>Paragraph 1</Paragraph>
        <Paragraph>Paragraph 2</Paragraph>
        <Paragraph>Paragraph 3</Paragraph>
    </Hero>
</Story>
