<div class="outer">
	<div class="inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.outer {
		display: flex;
		justify-content: center;
		width: 100%;

		.inner {
			flex: 1 1 auto;
			max-width: 1400px;
		}
	}
</style>
