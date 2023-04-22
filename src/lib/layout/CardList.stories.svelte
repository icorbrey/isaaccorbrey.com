<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import CardList from '$lib/layout/CardList.svelte';
	import { Language } from '$lib/utilities/language';
	import { Platform } from '$lib/utilities/platform';
</script>

<Meta
	title="Layout/Card List"
	component={CardList}
	parameters={{
		layout: 'fullscreen',
	}}
/>

<Story name="Card List Demo">
	<CardList>
		{#each [...new Array(10)] as _}
			<ProjectCard
				description="This is a cool project that you should totally check out."
				platform={Platform.Github}
				language={Language.Rust}
				repository="user/repo"
				title="Project Title"
				href="#"
			/>
		{/each}
	</CardList>
</Story>
