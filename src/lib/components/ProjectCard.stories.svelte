<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Language } from '$lib/utilities/language';
	import { Platform } from '$lib/utilities/platform';
	import ProjectCard from './ProjectCard.svelte';
</script>

<Meta
	title="Components/Cards/Project"
	component={ProjectCard}
	parameters={{
		layout: 'centered',
	}}
/>

<Story name="Rust Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={Platform.Github}
		language={Language.Rust}
		repository="user/repo"
		title="Project Title"
	/>
</Story>

<Story name="Python Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={Platform.Github}
		language={Language.Python}
		repository="user/repo"
		title="Project Title"
	/>
</Story>

<Story name="Shell Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={Platform.Github}
		language={Language.Shell}
		repository="user/repo"
		title="Project Title"
	/>
</Story>
