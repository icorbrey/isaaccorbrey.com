<script>
	import ScreenColumn from '../lib/components/ScreenColumn.svelte';
	import SiteHeader from '../lib/components/SiteHeader.svelte';
	import '../reset.scss';
</script>

<SiteHeader />
<ScreenColumn>
	<slot />
</ScreenColumn>
