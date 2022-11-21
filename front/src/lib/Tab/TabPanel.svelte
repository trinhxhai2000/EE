<script lang="ts">
    import { getContext } from "svelte";
    import { TABS, TabsData } from "./Tabs.svelte";

    const panel = {};
    const { registerPanel, selectedPanel } = getContext<TabsData>(TABS);

    registerPanel(panel);
</script>

{#if $selectedPanel === panel}
    <div class="tab-panel">
        <slot />
    </div>
{/if}

<style lang="scss">
    .tab-panel {
        border: 2px solid lightgrey;
        padding: 10px;
    }
</style>
