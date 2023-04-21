<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import ProjectCard from './ProjectCard.svelte';
	import { Language } from '$lib/types/Language';
	import { Platform } from '$lib/types/Platform';
</script>

<Meta
	title="Components/Cards/Project"
	component={ProjectCard}
	parameters={{
		layout: 'centered',
	}}
/>

<Story name="GitHub Project">
	<ProjectCard
		description="This is a cool project that you should totally check out."
		platform={Platform.Github}
		language={Language.Rust}
		repository="user/repo"
		title="Project Title"
		href="#"
	/>
</Story>
