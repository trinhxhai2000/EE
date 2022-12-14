<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import {
        ComponentModalType,
        currentComponentModalStore,
    } from "../../Stores/ComponentModal";
    import AddChoiceModal from "../Admin/Question/Choice/AddChoiceModal.svelte";
    import EditChoiceModal from "../Admin/Question/Choice/EditChoiceModal.svelte";

    let app: HTMLElement | null = null;

    onMount(() => {
        app = document.getElementById("app");
        if (app) {
            app.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
        window.addEventListener("scroll", disableScroll, true);
    });

    onDestroy(() => {
        window.removeEventListener("scroll", disableScroll, true);
    });

    function disableScroll(e: Event) {
        if (app) {
            app.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    }
</script>

<div class="modal-place-holder">
    <div class="modal-wrapper">
        <!--MapType-->
        <!-- {$currentComponentModalStore} -->
        {#if $currentComponentModalStore === ComponentModalType.ADD_CHOICE}
            <AddChoiceModal />
        {/if}

        {#if $currentComponentModalStore === ComponentModalType.EDIT_CHOICE}
            <EditChoiceModal />
        {/if}
    </div>
</div>

<style lang="scss">
    .modal-place-holder {
        z-index: 9999;
        // border: 10px solid pink;
        position: absolute;
        position: absolute !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.6);
    }
    .modal-wrapper {
        // border: 2px solid cyan;
        z-index: 99999;
        background-color: rgba(255, 255, 255, 1);
        position: absolute;
        height: auto !important;
        width: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
