<div class="card-list">
	<slot />
</div>

<style lang="scss">
	.card-list {
		gap: 21px;

		@media screen and (min-width: 0px) {
			display: flex;
			flex-flow: column nowrap;
		}

		@media screen and (min-width: 800px) {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: repeat(auto);
		}

		@media screen and (min-width: 1200px) {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: repeat(auto);
		}

		&:not(:first-child) {
			padding-top: 14px;
		}
	}
</style>
