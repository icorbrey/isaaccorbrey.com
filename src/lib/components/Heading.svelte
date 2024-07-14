<script lang="ts">
	type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

	export let colorful: boolean = false;
	export let level: HeaderLevel = 1;

	const style = colorful ? 'colorful' : undefined;
</script>

{#if level === 1}
	<h1 class={style}><slot /></h1>
{:else if level === 2}
	<h2 class={style}><slot /></h2>
{:else if level === 3}
	<h3 class={style}><slot /></h3>
{:else if level === 4}
	<h4 class={style}><slot /></h4>
{:else if level === 5}
	<h5 class={style}><slot /></h5>
{:else if level === 6}
	<h6 class={style}><slot /></h6>
{/if}

<style>
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: var(--heading-font);
		margin: 0;
	}

	h1.colorful {
		color: var(--red-500);
	}

	h2.colorful {
		color: var(--orange-500);
	}

	h3.colorful {
		color: var(--yellow-500);
	}

	h4.colorful {
		color: var(--green-500);
	}

	h5.colorful {
		color: var(--blue-500);
	}

	h6.colorful {
		color: var(--purple-500);
	}

	h1:not(:first-child),
	h2:not(:first-child) {
		margin-top: 2rem;
	}

	h3:not(:first-child),
	h4:not(:first-child) {
		margin-top: 1.5rem;
	}

	h5:not(:first-child) {
		margin-top: 1rem;
	}

	h6:not(:first-child) {
		margin-top: 0.5rem;
	}
</style>
