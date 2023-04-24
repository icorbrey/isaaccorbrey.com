<script lang="ts">
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import * as plat from '$lib/utilities/platform';
	import Model from './Model.svelte';
</script>

<Meta
	title="Components/Cards/Model"
	component={Model}
	parameters={{
		layout: 'centered',
	}}
/>

<Story name="Printables Model">
	<Model
		title="My 3D Model"
		description="This is my cool 3D model! You should print it."
		src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcMGuOzi8xiMxTHT0Oj1UQygOfwvkENepvfov3kZ45RQ&s"
		platform={plat.Platform.Printables}
		alt="This is some alt text."
		href="#"
	/>
</Story>
