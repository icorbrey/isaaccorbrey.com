<script lang="ts">
    export let href: string | undefined = undefined;
</script>

{#if href === undefined}
    <div class="card">
        <slot />
    </div>
{:else}
    <a {href} class="card">
        <slot />
    </a>
{/if}

<style lang="scss">
    a.card {
        transition: box-shadow 0.12s;
        text-decoration: none;
        color: black;

        :global(.underline)::after {
            background: black;
            transition: 0.12s;
            display: block;
            content: '';
            height: 1px;
            width: 0px;
        }

        &:hover {
            box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.45);

            :global(.underline)::after {
                width: 100%;
            }
        }
    }

    .card {
        box-shadow: 0px 3.5px 7px 3.5px rgba(0, 0, 0, 0.25);
        flex-flow: column nowrap;
        background: white;
        border-radius: 7px;
        overflow: hidden;
        display: flex;
    }
</style>
