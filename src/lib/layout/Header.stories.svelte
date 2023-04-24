<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';
</script>

<Meta
	title="Layout/Header"
	component={Header}
	parameters={{
		layout: 'fullscreen',
	}}
/>

<Story name="Header">
	<Header />
</Story>
