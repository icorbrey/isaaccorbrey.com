<script lang="ts">
    import { Language } from '$lib/utilities/language';
    import { faPython, faRust } from '@fortawesome/free-brands-svg-icons';
    import { faTerminal } from '@fortawesome/free-solid-svg-icons';
    import FontAwesome from 'svelte-fa';

    let className: string = '';
    export { className as class };
    export let language: Language;

    const icon = {
        [Language.Python]: faPython,
        [Language.Rust]: faRust,
        [Language.Shell]: faTerminal,
    }[language];
</script>

<FontAwesome {icon} class={className} />
