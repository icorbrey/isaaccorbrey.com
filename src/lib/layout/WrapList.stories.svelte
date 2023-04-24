<script lang="ts">
	import ProjectCard from '$lib/components/cards/Project.svelte';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Language } from '$lib/utilities/language';
	import { Platform } from '$lib/utilities/platform';
	import WrapList from '$lib/layout/WrapList.svelte';
</script>

<Meta
	title="Layout/Wrap List"
	component={WrapList}
	parameters={{
		layout: 'fullscreen',
	}}
/>

<Story name="Demo">
	<WrapList>
		{#each [...new Array(9)] as _, i}
			<ProjectCard
				title={`Cool Project ${i + 1}`}
				description="This is a cool project that you should totally check out."
				platform={Platform.Github}
				language={Language.Rust}
				repository="user/repo"
			/>
		{/each}
	</WrapList>
</Story>
