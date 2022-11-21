<script lang="ts">
    import { getContext } from "svelte";
    import { TABS, TabsData } from "./Tabs.svelte";

    const tab = {};
    const { registerTab, selectTab, selectedTab } = getContext<TabsData>(TABS);

    registerTab(tab);
</script>

<div class="tab" class:selected={$selectedTab === tab} on:click={() => selectTab(tab)}>
    <slot />
</div>

<style lang="scss">
    .tab {
        border: 2px solid lightgrey;
        display: block;
        color: #ccc;
        border-radius: 10px 10px 0px 0px;
        transform: translateY(2px);
        padding: 10px;
        font-weight: bolder;
        margin-right: 3px;
        &:hover {
            cursor: pointer;
        }
    }

    .selected {
        border: 2px solid grey;
        border-bottom: 2px solid white;
        transform: translateY(2px);
        background-color: white;
        font-size: larger;
        color: #333;
    }
</style>
