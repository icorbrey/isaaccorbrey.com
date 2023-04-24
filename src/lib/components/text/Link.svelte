<script lang="ts">
    export let to: string;
</script>

<a href={to}>
    <slot />
</a>

<style lang="scss">
    a {
        font-family: 'Nunito Sans', sans-serif;
        text-decoration: none;
        line-height: 14px;
        transition: 0.12s;
        font-size: 14px;

        &:hover {
            text-decoration: underline;
        }
    }
</style>
