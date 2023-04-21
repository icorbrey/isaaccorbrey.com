<script lang="ts">
	export let level: 1 | 2 | 3 | 4 | 5 | 6;
</script>

{#if level === 1}
	<h1><slot /></h1>
{:else if level === 2}
	<h2><slot /></h2>
{:else if level === 3}
	<h3><slot /></h3>
{:else if level === 4}
	<h4><slot /></h4>
{:else if level === 5}
	<h5><slot /></h5>
{:else if level === 6}
	<h6><slot /></h6>
{/if}

<style lang="scss">
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: 'Nunito Sans', sans-serif;
	}
</style>
