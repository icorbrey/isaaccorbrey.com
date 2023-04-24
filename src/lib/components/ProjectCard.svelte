<script lang="ts">
	import * as lang from '$lib/utilities/language';
	import * as plat from '$lib/utilities/platform';
	import FontAwesome from 'svelte-fa';

	export let description: string;
	export let repository: string;
	export let language: lang.Language;
	export let platform: plat.Platform;
	export let title: string;
</script>

<a class="project" href={plat.getRepo(platform, repository)}>
	<div class="content">
		<h3 class="title">{title}</h3>
		<p class="description">{description}</p>
		<div class="subrow">
			<span class="icon">
				<FontAwesome icon={plat.getIcon(platform)} />
			</span>
			<span class="repository">{repository}</span>
			&nbsp;
			<span class="icon">
				<FontAwesome icon={lang.getIcon(language)} />
			</span>
		</div>
	</div>
	<div
		class="language-line"
		style={`background-color: ${lang.getColor(language)}`}
	/>
</a>

<style lang="scss">
	.project {
		box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.25);
		font-family: 'Nunito Sans', sans-serif;
		transition: box-shadow 0.12s;
		flex-flow: column nowrap;
		text-decoration: none;
		border-radius: 7px;
		background: white;
		display: flex;
		color: black;

		&:hover {
			box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.45);

			.content .subrow .repository::after {
				width: 100%;
			}
		}

		.content {
			flex-flow: column nowrap;
			padding: 10px 14px 3.5px;
			flex: 1 1 auto;
			display: flex;

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
					font-size: 17.5px;
				}
			}
		}

		.language-line {
			border-bottom-right-radius: 7px;
			border-bottom-left-radius: 7px;
			flex: 0 0 auto;
			height: 8.5px;
		}
	}
</style>
