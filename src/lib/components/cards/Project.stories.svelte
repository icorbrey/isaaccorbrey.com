<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import * as lang from '$lib/utilities/language';
	import * as plat from '$lib/utilities/platform';
	import Project from './Project.svelte';
</script>

<Meta
	title="Components/Cards/Project Card"
	component={Project}
	parameters={{
		layout: 'centered',
	}}
/>

<Story name="Rust Project">
	<Project
		description="This is a cool project that you should totally check out."
		platform={plat.Platform.Github}
		language={lang.Language.Rust}
		repository="user/repo"
		title="Project Title"
	/>
</Story>

<Story name="Python Project">
	<Project
		description="This is a cool project that you should totally check out."
		platform={plat.Platform.Github}
		language={lang.Language.Python}
		repository="user/repo"
		title="Project Title"
	/>
</Story>

<Story name="Shell Project">
	<Project
		description="This is a cool project that you should totally check out."
		platform={plat.Platform.Github}
		language={lang.Language.Shell}
		repository="user/repo"
		title="Project Title"
	/>
</Story>
