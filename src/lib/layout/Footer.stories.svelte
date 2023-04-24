<script lang="ts">
    import { Meta, Story } from '@storybook/addon-svelte-csf';
    import Footer from './Footer.svelte';
</script>

<Meta
    title="Layout/Footer"
    component={Footer}
    parameters={{
        layout: 'fullscreen',
    }}
/>

<Story name="Demo">
    <Footer />
</Story>
