<script>
	import Heading from './Heading.svelte';
	import ScreenColumn from './ScreenColumn.svelte';
</script>

<div>
	<ScreenColumn>
		<Heading>Isaac Corbrey</Heading>
		<slot />
	</ScreenColumn>
</div>

<style>
	div {
		border-bottom: solid 1px var(--outline);
		background: var(--bg-2);
		padding: 0.5rem 1rem;
	}
</style>
