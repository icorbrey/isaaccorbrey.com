<script lang="ts">
	import { Language, getLanguageIcon } from '$lib/utilities/language';
	import { Platform, getPlatformIcon } from '$lib/utilities/platform';
	import FontAwesome from 'svelte-fa';

	export let description: string;
	export let repository: string;
	export let language: Language;
	export let platform: Platform;
	export let title: string;
	export let href: string;
</script>

<a class="project" {href}>
	<h3 class="title">{title}</h3>
	<p class="description">{description}</p>
	<div class="subrow">
		<span class="icon">
			<FontAwesome icon={getPlatformIcon(platform)} />
		</span>
		<span class="repository">{repository}</span>
		&nbsp;
		<span class="icon">
			<FontAwesome icon={getLanguageIcon(language)} />
		</span>
	</div>
</a>

<style lang="scss">
	.project {
		box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.25);
		font-family: 'Nunito Sans', sans-serif;
		transition: box-shadow 0.12s;
		flex-flow: column nowrap;
		text-decoration: none;
		border-radius: 7px;
		padding: 10px 14px;
		background: white;
		display: flex;
		color: black;

		&:hover {
			box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.45);

			.subrow .repository::after {
				width: 100%;
			}
		}

		.title {
			margin-top: 0;
			margin-bottom: 7px;
			flex: 0 0 auto;
		}

		.description {
			margin-top: 0;
			margin-bottom: 7px;
			flex: 1 1 auto;
		}

		.subrow {
			grid-template-columns: auto auto 1fr auto;
			align-items: center;
			display: grid;

			.repository {
				font-family: 'Roboto Mono', monospace;
				line-height: 14px;
				margin-left: 7px;
				font-size: 14px;
			}

			.repository::after {
				content: '';
				width: 0px;
				height: 1px;
				display: block;
				background: black;
				transition: 0.12s;
			}

			.icon {
				font-size: 16px;
			}
		}
	}
</style>
