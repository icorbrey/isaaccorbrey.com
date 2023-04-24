<script>
    import ScreenColumn from '$lib/layout/ScreenColumn.svelte';
    import FooterList from '$lib/layout/FooterList.svelte';
    import LinkList from '$lib/layout/LinkList.svelte';
</script>

<footer>
    <ScreenColumn>
        <FooterList>
            <LinkList
                title="Social"
                links={[
                    {
                        to: 'https://www.linkedin.com/in/icorbrey/',
                        label: 'LinkedIn',
                    },
                    {
                        to: 'https://twitter.com/icorbrey',
                        label: 'Twitter',
                    },
                ]}
            />
            <LinkList
                title="My Work"
                links={[
                    {
                        to: 'https://github.com/icorbrey',
                        label: 'GitHub',
                    },
                    {
                        to: 'https://www.printables.com/@IsaacCorbrey',
                        label: 'Printables',
                    },
                ]}
            />
            <LinkList
                title="Support Me"
                links={[
                    {
                        to: 'https://github.com/sponsors/icorbrey',
                        label: 'GitHub Sponsors',
                    },
                    {
                        to: 'https://ko-fi.com/icorbrey',
                        label: 'Ko-Fi',
                    },
                ]}
            />
        </FooterList>
    </ScreenColumn>
</footer>

<style lang="scss">
    footer {
        box-shadow: 0px -7px 7px 0px rgba(0, 0, 0, 0.3);
        padding-bottom: 28px;
        padding-top: 14px;
        margin-top: 42px;
    }
</style>
