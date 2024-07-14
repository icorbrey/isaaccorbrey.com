<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';
</script>

<Meta title="Components/Heading" component={Heading} />

<Story name="Standard headings">
	<div>
		<Heading level={1}>H1</Heading>
		<Heading level={2}>H2</Heading>
		<Heading level={3}>H3</Heading>
		<Heading level={4}>H4</Heading>
		<Heading level={5}>H5</Heading>
		<Heading level={6}>H6</Heading>
	</div>
</Story>

<Story name="Colorful headings">
	<div>
		<Heading colorful level={1}>H1</Heading>
		<Heading colorful level={2}>H2</Heading>
		<Heading colorful level={3}>H3</Heading>
		<Heading colorful level={4}>H4</Heading>
		<Heading colorful level={5}>H5</Heading>
		<Heading colorful level={6}>H6</Heading>
	</div>
</Story>
