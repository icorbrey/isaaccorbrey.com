<script>
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import Heading from '$lib/components/Heading.svelte';
    import { Platform } from '$lib/types/Platform';
    import { Language } from '$lib/types/Language';
    import Header from '$lib/layout/Header.svelte';
    import '../reset.scss';
</script>

<Header />

<Heading>Projects</Heading>

<ProjectCard
    title="Nintendo 64 Peripheral Access Crate"
    description="A low-level registry wrapper for building Rust applications on the Nintendo 64."
    href="https://github.com/icorbrey/nintendo64-pac"
    repository="icorbrey/nintendo64-pac"
    platform={Platform.Github}
    language={Language.Rust}
/>
<ProjectCard
    title="Rust Raytracer"
    description="A simple raytracer, built in Rust."
    href="https://github.com/icorbrey/rustrays"
    repository="icorbrey/rustrays"
    platform={Platform.Github}
    language={Language.Rust}
/>
