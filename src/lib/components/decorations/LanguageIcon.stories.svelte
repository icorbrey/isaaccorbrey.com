<script lang="ts">
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
    import { Language } from '$lib/utilities/language';
    import LanguageIcon from './LanguageIcon.svelte';
</script>

<Meta title="Components/Decorations/Language Icon" component={LanguageIcon} />

<Template let:args>
    <LanguageIcon language={args.language} />
</Template>

<Story name="Python Icon" args={{ language: Language.Python }} />
<Story name="Rust Icon" args={{ language: Language.Rust }} />
<Story name="Shell Icon" args={{ language: Language.Shell }} />
