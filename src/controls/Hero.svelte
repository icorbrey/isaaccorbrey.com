<script lang="ts">
	export let title: string;
</script>

<div>
	<h1>{title}</h1>
	<slot />
</div>

<style>
	div {
		padding: 4rem 0;
	}

	@media (min-width: 40rem) {
		div {
			padding: 8rem 0;
		}
	}
</style>
