<script lang="ts">
    import { faGithub } from '@fortawesome/free-brands-svg-icons';
    import { faCube } from '@fortawesome/free-solid-svg-icons';
    import { Platform } from '$lib/utilities/platform';
    import FontAwesome from 'svelte-fa';

    let className: string = '';
    export { className as class };
    export let platform: Platform;

    const icon = {
        [Platform.Github]: faGithub,
        [Platform.Printables]: faCube,
    }[platform];
</script>

<FontAwesome {icon} class={className} />
