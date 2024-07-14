<div class="outer">
	<div class="inner">
		<slot />
	</div>
</div>

<style>
	.outer {
		flex-flow: column nowrap;
		align-items: center;
		display: flex;
	}

	.outer:not(:first-child) {
		margin-top: 2.5rem;
	}

	.inner {
		max-width: 1200px;
		padding: 0 1rem;
		height: 100%;
		width: 100%;
	}
</style>
