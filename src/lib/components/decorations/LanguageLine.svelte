<script lang="ts">
    import { Language } from '$lib/utilities/language';

    export let language: Language;

    let color = {
        [Language.Python]: '#3572a5',
        [Language.Shell]: '#89e051',
        [Language.Rust]: '#dea584',
    }[language];
</script>

<div class="language-line" style={`background-color: ${color}`} />

<style lang="scss">
    .language-line {
        flex: 0 0 auto;
        height: 8.5px;
    }
</style>
