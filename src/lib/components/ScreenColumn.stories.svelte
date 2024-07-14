<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import ScreenColumn from './ScreenColumn.svelte';
</script>

<Meta
	title="Components/Screen column"
	component={ScreenColumn}
	parameters={{
		layout: 'fullscreen',
	}}
/>

<Story name="Max width">
	<ScreenColumn>
		<div class="test" />
	</ScreenColumn>
</Story>

<style>
	.test {
		width: 100%;
		height: 20px;
		background: var(--fg-1);
	}
</style>
