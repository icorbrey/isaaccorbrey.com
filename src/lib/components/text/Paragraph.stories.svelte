<script lang="ts">
    import { Meta, Story } from '@storybook/addon-svelte-csf';
    import Paragraph from './Paragraph.svelte';
</script>

<Meta title="Components/Text/Paragraph" component={Paragraph} />

<Story name="Single Paragraph">
    <div>
        <Paragraph>This is a single paragraph.</Paragraph>
    </div>
</Story>

<Story name="Multiple Paragraphs">
    <div>
        <Paragraph>This is the first paragraph.</Paragraph>
        <Paragraph>This is the second paragraph.</Paragraph>
    </div>
</Story>
