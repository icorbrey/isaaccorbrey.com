<div class="outer">
	<div class="inner">
		<slot />
	</div>
</div>

<style>
	.outer {
		justify-content: center;
		flex-flow: row nowrap;
		align-items: stretch;
		display: flex;

		height: 100%;
		width: 100%;
	}

	.inner {
		flex: 0 1 auto;

		max-width: 55rem;
		width: 100%;
	}
</style>
