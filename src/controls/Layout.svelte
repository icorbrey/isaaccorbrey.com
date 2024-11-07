<script>
	import ScreenColumn from './ScreenColumn.svelte';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
</script>

<ScreenColumn>
	<Header />
	<slot />
	<Footer />
</ScreenColumn>
