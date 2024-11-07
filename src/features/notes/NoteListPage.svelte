<script lang="ts">
	import Hero from '../../controls/Hero.svelte';
	import NoteList from './NoteList.svelte';
	import type { Note } from './store';

	export let notesByYear: { title: string; notes: Note[] }[] = [];
</script>

<Hero title="Notes">
	<p>
		I write whatever I want here. Prepare for opinions, rants, passions, and
		whatever else happens to pour out of my brain.
	</p>
</Hero>

{#if notesByYear.length === 0}
	<h2>Looks like there's nothing here yet.</h2>
	<p>Come back later to see what I've been cooking up!</p>
{:else}
	{#each notesByYear as { title, notes }}
		<h2>{title}</h2>
		<NoteList highlightNew {notes} />
	{/each}
{/if}
