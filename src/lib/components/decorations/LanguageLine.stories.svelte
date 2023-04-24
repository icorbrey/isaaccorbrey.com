<script lang="ts">
    import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
    import { Language } from '$lib/utilities/language';
    import LanguageLine from './LanguageLine.svelte';
</script>

<Meta title="Components/Decorations/Language Line" component={LanguageLine} />

<Template let:args>
    <LanguageLine language={args.language} />
</Template>

<Story name="Python Line" args={{ language: Language.Python }} />
<Story name="Rust Line" args={{ language: Language.Rust }} />
<Story name="Shell Line" args={{ language: Language.Shell }} />
