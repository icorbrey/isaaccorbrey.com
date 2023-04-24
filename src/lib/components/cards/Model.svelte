<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import PlatformIcon from '$lib/components/decorations/PlatformIcon.svelte';
	import Heading from '$lib/components/text/Heading.svelte';
	import Paragraph from '$lib/components/text/Paragraph.svelte';
	import * as plat from '$lib/utilities/platform';

	export let description: string;
	export let platform: plat.Platform;
	export let title: string;
	export let href: string;
	export let alt: string;
	export let src: string;
</script>

<Card {href}>
	<img {src} {alt} />
	<div class="content">
		<Heading level={3}>{title}</Heading>
		<Paragraph>{description}</Paragraph>
		<PlatformIcon {platform} />
		<span class="underline">{plat.getText(platform)}</span>
	</div>
</Card>

<style lang="scss">
	img {
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.content {
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-columns: auto 1fr;
		grid-template-areas:
			'title title'
			'description description'
			'platform subtext';
		padding: 14px 14px 10px;
		flex: 1 1 auto;

		> :global(:nth-child(1)) {
			grid-area: title;
		}

		> :global(:nth-child(2)) {
			grid-area: description;
			margin-bottom: 14px;
		}

		> :global(:nth-child(3)) {
			align-self: last baseline;
			grid-area: platform;
			font-size: 17.5px;
		}

		> :global(:nth-child(4)) {
			font-family: 'Nunito Sans', sans-serif;
			justify-self: first baseline;
			align-self: last baseline;
			grid-area: subtext;
			line-height: 14px;
			margin-left: 7px;
			font-size: 14px;
		}
	}
</style>
