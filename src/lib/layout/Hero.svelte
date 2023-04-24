<script lang="ts">
    import Card from '$lib/components/cards/Card.svelte';

    export let src: string;
    export let alt: string;
</script>

<Card>
    <div class="hero">
        <img {src} {alt} />
        <div class="content"><slot /></div>
    </div>
</Card>

<style lang="scss">
    .hero {
        display: grid;

        @media screen and (max-width: 799px) {
            grid-template-rows: auto auto;
        }

        @media screen and (min-width: 800px) {
            grid-template-columns: auto 1fr;
        }

        img {
            @media screen and (max-width: 799px) {
                width: 100%;
            }
        }

        .content {
            flex-flow: column nowrap;
            padding: 21px;
            display: flex;
        }
    }
</style>
