<script lang="ts">
	import ScreenColumn from './ScreenColumn.svelte';
</script>

<header>
	<ScreenColumn>
		<div class="inner">
			<a href="/"><h1>Isaac Corbrey</h1></a>
			&nbsp;
			<a href="/support">Support Me</a>
		</div>
	</ScreenColumn>
</header>

<style lang="scss">
	header {
		box-shadow: 0px 7px 7px 0px rgba(0, 0, 0, 0.3);

		.inner {
			display: grid;
			grid-template-columns: auto 1fr auto;
			align-items: center;

			font-family: 'Nunito Sans', sans-serif;

			a {
				text-decoration: none;
				color: black;
				padding: 7px 0px;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
</style>
