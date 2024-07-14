<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';
</script>

<Meta title="Components/Header" component={Header} />

<Story name="Header with links">
	<Header>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#">Link 1</a>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#">Link 2</a>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#">Link 3</a>
	</Header>
</Story>
