<script>
	import ScreenColumn from './ScreenColumn.svelte';
</script>

<header>
	<ScreenColumn>
		<nav>
			<a href="/"><h1>Isaac Corbrey</h1></a>
			<a href="/projects">Projects</a>
			<a href="/packages">Packages</a>
			<a href="/models">Models</a>
			<a href="/contact">Contact</a>
		</nav>
	</ScreenColumn>
</header>

<style lang="scss">
	header {
		background-color: gainsboro;
	}

	nav {
		display: grid;
		grid-template-columns: 1fr repeat(4, auto);
		grid-template-rows: auto;
		align-items: stretch;

		a {
			display: flex;
			align-items: center;
			padding: 8px 12px;
			text-decoration: none;
			color: black;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
