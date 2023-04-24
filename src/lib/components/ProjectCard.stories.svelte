<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import * as lang from '$lib/utilities/language';
	import * as plat from '$lib/utilities/platform';
	import ProjectCard from './ProjectCard.svelte';
</script>

<Meta
	title="Components/Cards/Project Card"
	component={ProjectCard}
	parameters={{
		layout: 'centered',
	}}
/>

<Story name="Rust Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={plat.Platform.Github}
		language={lang.Language.Rust}
		repository="user/repo"
		title="Project Title"
	/>
</Story>

<Story name="Python Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={plat.Platform.Github}
		language={lang.Language.Python}
		repository="user/repo"
		title="Project Title"
	/>
</Story>

<Story name="Shell Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={plat.Platform.Github}
		language={lang.Language.Shell}
		repository="user/repo"
		title="Project Title"
	/>
</Story>
