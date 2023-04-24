<script lang="ts">
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
    import { Platform } from '$lib/utilities/platform';
    import PlatformIcon from './PlatformIcon.svelte';
</script>

<Meta title="Components/Decorations/Platform Icon" component={PlatformIcon} />

<Template let:args>
    <PlatformIcon platform={args.platform} />
</Template>

<Story name="GitHub Icon" args={{ platform: Platform.Github }} />
<Story name="Printables Icon" args={{ platform: Platform.Printables }} />
