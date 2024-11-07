<script lang="ts">
	import ButtonLink from '../../controls/ButtonLink.svelte';
	import Row from '../../controls/Row.svelte';
	import NoteList from '../notes/NoteList.svelte';
	import type { Note } from '../notes/store';
	import TagHeader from './TagHeader.svelte';

	export let description: string | undefined;
	export let notes: Note[] = [];
	export let tag: string;
</script>

<TagHeader {tag} {description} />

<Row>
	<h2>Notes</h2>
	<ButtonLink href="/notes">All notes</ButtonLink>
</Row>
<NoteList highlightNew {notes} />
