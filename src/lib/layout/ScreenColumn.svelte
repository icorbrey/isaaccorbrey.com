<div class="outer">
	<div class="inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.outer {
		flex-flow: column nowrap;
		align-items: center;
		display: flex;

		.inner {
			max-width: 1400px;
			padding: 0px 21px;
			height: 100%;
			width: 100%;
		}
	}
</style>
