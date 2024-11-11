<script>
	import LayoutFooter from "./LayoutFooter.svelte";
	import LayoutHeader from "./LayoutHeader.svelte";
	import ScreenColumn from "./ScreenColumn.svelte";
</script>

<ScreenColumn>
	<LayoutHeader />
	<slot />
	<LayoutFooter />
</ScreenColumn>
