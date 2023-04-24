<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import CardList from '$lib/layout/CardList.svelte';
	import * as lang from '$lib/utilities/language';
	import * as plat from '$lib/utilities/platform';
</script>

<Meta
	title="Layout/Card List"
	component={CardList}
	parameters={{
		layout: 'fullscreen',
	}}
/>

<Story name="Demo">
	<CardList>
		{#each [...new Array(9)] as _, i}
			<ProjectCard
				title={`Cool Project ${i + 1}`}
				description="This is a cool project that you should totally check out."
				platform={plat.Platform.Github}
				language={lang.Language.Rust}
				repository="user/repo"
			/>
		{/each}
	</CardList>
</Story>
