<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';
</script>

<Meta title="Components/Heading" component={Heading} />

<Template let:args>
	<Heading level={args.level}>
		{`Heading ${args.level}`}
	</Heading>
</Template>

<Story name="H1" args={{ level: 1 }} />
<Story name="H2" args={{ level: 2 }} />
<Story name="H3" args={{ level: 3 }} />
<Story name="H4" args={{ level: 4 }} />
<Story name="H5" args={{ level: 5 }} />
<Story name="H6" args={{ level: 6 }} />
