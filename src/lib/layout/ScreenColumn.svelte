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

		&:not(:first-child) {
			margin-top: 35px;
		}

		.inner {
			max-width: 1200px;
			padding: 0px 14px;
			height: 100%;
			width: 100%;
		}
	}
</style>
