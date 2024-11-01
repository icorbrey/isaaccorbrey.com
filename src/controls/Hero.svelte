<script lang="ts">
	export let title: string;
</script>

<div>
	<h1>{title}</h1>
	<slot />
</div>

<style>
	div {
		padding: 8rem 0rem;
	}
</style>
