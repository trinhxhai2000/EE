<script lang="ts" context="module">
    export const TABS = {};
    // from https://svelte.dev/repl/8e68120858e5322272dc9136c4bb79cc?version=3.5.1
    export interface TabsData {
        registerTab: (tab: any) => void;
        registerPanel: (panel: any) => void;
        selectTab: (tab: any) => void;
        selectedTab: any;
        selectedPanel: any;
    }
</script>

<script lang="ts">
    import { setContext, onDestroy } from "svelte";
    import { writable } from "svelte/store";

    type Comp = any;

    const tabs: Comp[] = [];
    const panels: Comp[] = [];
    const selectedTab = writable<Comp | null>(null);
    const selectedPanel = writable<Comp | null>(null);

    setContext(TABS, {
        registerTab: (tab: Comp) => {
            tabs.push(tab);
            selectedTab.update((current) => current || tab);

            onDestroy(() => {
                const i = tabs.indexOf(tab);
                tabs.splice(i, 1);
                selectedTab.update((current) => (current === tab ? tabs[i] || tabs[tabs.length - 1] : current));
            });
        },

        registerPanel: (panel: Comp) => {
            panels.push(panel);
            selectedPanel.update((current) => current || panel);

            onDestroy(() => {
                const i = panels.indexOf(panel);
                panels.splice(i, 1);
                selectedPanel.update((current) =>
                    current === panel ? panels[i] || panels[panels.length - 1] : current
                );
            });
        },

        selectTab: (tab: Comp) => {
            const i = tabs.indexOf(tab);
            selectedTab.set(tab);
            selectedPanel.set(panels[i]);
        },

        selectedTab,
        selectedPanel,
    });
</script>

<div class="tab-container">
    <slot />
</div>

<style>
    .tab-container {
        width: 100%;
        height: 100%;
        /* border:5px solid purple; */
    }
</style>
