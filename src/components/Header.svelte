<script lang="ts">
	import ScreenColumn from './ScreenColumn.svelte';
</script>

<header>
	<h1><a href="/">Isaac Corbrey</a></h1>
	<ul>
		<li><a href="/posts">Posts</a></li>
		<li><a href="/projects">Projects</a></li>
		<li><a href="/who-am-i">Who am I?</a></li>
	</ul>
</header>

<style>
	header {
		flex-flow: row nowrap;
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
</style>
