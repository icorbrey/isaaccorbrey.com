<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import LanguageIcon from '$lib/components/decorations/LanguageIcon.svelte';
	import LanguageLine from '$lib/components/decorations/LanguageLine.svelte';
	import PlatformIcon from '$lib/components/decorations/PlatformIcon.svelte';
	import Heading from '$lib/components/text/Heading.svelte';
	import Paragraph from '$lib/components/text/Paragraph.svelte';
	import type { Language } from '$lib/utilities/language';
	import * as plat from '$lib/utilities/platform';

	export let description: string;
	export let repository: string;
	export let language: Language;
	export let platform: plat.Platform;
	export let title: string;

	const href = plat.getRepo(platform, repository);
</script>

<Card {href}>
	<div class="content">
		<Heading level={3}>{title}</Heading>
		<Paragraph>{description}</Paragraph>
		<PlatformIcon {platform} />
		<span class="underline">{repository}</span>
		<LanguageIcon {language} />
	</div>
	<LanguageLine {language} />
</Card>

<style lang="scss">
	.content {
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-columns: auto 1fr auto;
		grid-template-areas:
			'title title title'
			'description description description'
			'platform repository language';
		padding: 14px 14px 7px;
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
			font-family: 'Roboto Mono', monospace;
			justify-self: first baseline;
			align-self: last baseline;
			grid-area: repository;
			line-height: 14px;
			margin-left: 7px;
			font-size: 14px;
		}

		> :global(:nth-child(5)) {
			align-self: last baseline;
			grid-area: language;
			font-size: 17.5px;
		}
	}
</style>
