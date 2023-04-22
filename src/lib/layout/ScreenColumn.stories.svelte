<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import ScreenColumn from './ScreenColumn.svelte';
</script>

<Meta
	title="Layout/Screen Column"
	component={ScreenColumn}
	parameters={{
		layout: 'fullscreen',
	}}
/>

<Story name="Screen Column Demo">
	<ScreenColumn>
		<button>This is a test</button>
	</ScreenColumn>
</Story>
