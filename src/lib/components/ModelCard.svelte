<script lang="ts">
	import { faCube } from '@fortawesome/free-solid-svg-icons';
	import * as plat from '$lib/utilities/platform';
	import FontAwesome from 'svelte-fa';

	export let description: string;
	export let platform: plat.Platform;
	export let title: string;
	export let href: string;
	export let alt: string;
	export let src: string;
</script>

<a class="project" {href}>
	<img {src} {alt} />
	<div class="content">
		<h3 class="title">{title}</h3>
		<p class="description">{description}</p>
		<div class="subrow">
			<span class="icon"><FontAwesome icon={faCube} /></span>
			<span class="subtext">{plat.getText(platform)}</span>
		</div>
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
		background: white;
		display: flex;
		color: black;

		img {
			border-top-right-radius: 7px;
			border-top-left-radius: 7px;
			aspect-ratio: 4 / 3;
			object-fit: cover;
		}

		&:hover {
			box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.45);

			.content .subrow .subtext::after {
				width: 100%;
			}
		}

		.content {
			flex-flow: column nowrap;
			padding: 10px 14px;
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
				grid-template-columns: auto auto 1fr;
				align-items: center;
				display: grid;

				.subtext {
					line-height: 14px;
					margin-left: 7px;
					font-size: 14px;
				}

				.subtext::after {
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
	}
</style>
