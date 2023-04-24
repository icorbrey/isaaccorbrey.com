<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';
</script>

<Meta title="Components/Text/Heading" component={Heading} />

<Story name="Single Heading">
	<div>
		<Heading>This is my heading!</Heading>
	</div>
</Story>

<Story name="Multiple Headings">
	<div>
		<Heading level={1}>Heading, level 1!</Heading>
		<Heading level={2}>Heading, level 2!</Heading>
		<Heading level={3}>Heading, level 3!</Heading>
		<Heading level={4}>Heading, level 4!</Heading>
		<Heading level={5}>Heading, level 5!</Heading>
		<Heading level={6}>Heading, level 6!</Heading>
	</div>
</Story>
