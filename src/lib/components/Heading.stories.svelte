<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';

	const args = (level: number) => ({
		text: `Heading ${level}`,
		level,
	});
</script>

<Meta title="Components/Heading" component={Heading} />

<Template let:args>
	<Heading level={args.level}>
		{args.text}
	</Heading>
</Template>

<Story name="H1" args={args(1)} />
<Story name="H2" args={args(2)} />
<Story name="H3" args={args(3)} />
<Story name="H4" args={args(4)} />
<Story name="H5" args={args(5)} />
<Story name="H6" args={args(6)} />
