<script lang="ts">
    import type { Unsubscriber } from "svelte/store";
    import { onDestroy, onMount } from "svelte";
    import { infoModalStore, showInfoModal } from "../../Stores/ModalStore";

    function closeModal() {
        infoModalStore.confirm();
    }

    function onKeyDown(e: KeyboardEvent) {
        if ($showInfoModal) {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === "Escape" || e.key === "Enter") {
                closeModal();
                return;
            }
        }
    }

    let scrollTop: any = null;
    let scrollLeft: any = null;

    function disableScroll() {
        window.scrollTo(0, 0);
        scrollTop =
            window.pageYOffset || window.document.documentElement.scrollTop;
        (scrollLeft =
            window.pageXOffset || window.document.documentElement.scrollLeft),
            (window.onscroll = function () {
                window.scrollTo(scrollLeft, scrollTop);
            });
    }

    function enableScroll() {
        window.onscroll = function () {};
    }

    let showInfoUnsubscriber: Unsubscriber;

    onMount(() => {
        showInfoUnsubscriber = showInfoModal.subscribe((show) => {
            if (show) {
                disableScroll();
            } else enableScroll();
        });
    });

    onDestroy(() => {
        if (showInfoUnsubscriber) showInfoUnsubscriber();
    });
</script>

<!-- svelte-ignore missing-declaration -->
<svelte:window on:keydown={onKeyDown} />
{#if $showInfoModal}
    <div class="container-main">
        <div class="information-modal">
            <section class="information-modal-title">
                <h2>{@html infoModalStore.getTitle()}</h2>
            </section>
            <section class="information-modal-action">
                <button on:click|preventDefault={closeModal}>OK</button>
            </section>
        </div>
    </div>
{/if}

<style lang="scss">
    @import "../../../style/breakpoints.scss";

    h2 {
        font-size: 18px;
    }

    $base-font-size: 15px;
    $border-rad: 28px;
    $input-border-rad: 5px;

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        // height: $input-height;
        border-radius: $input-border-rad;
        border: 1px solid rgba(0, 0, 0, 0.05);
        font-size: calc($base-font-size * 0.9);
        padding: 3px 15px;
        line-height: calc($base-font-size * 1.8);
        &:hover {
            cursor: pointer;
        }
    }
    .container-main {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 99999;
        pointer-events: auto;
        div.information-modal {
            pointer-events: auto;
            background-color: #fff;
            background-size: cover;
            color: black;
            position: absolute;
            max-width: 480px;
            height: auto !important;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2078;
            padding: 20px;
            border-radius: 16px;

            section.information-modal-title {
                margin-bottom: 20px;
                display: flex;
                justify-content: center;
            }

            section.information-modal-action {
                display: flex;
                justify-content: center;
                gap: 20px;
            }
        }
        .btn-md {
            color: whitesmoke;
            font-weight: bold;
            padding: 8px 0 2px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 81px;
            height: 42px;
            border: none;
            background: none;
            background-size: contain;
            background-position: center !important;
            background-repeat: no-repeat;
            background-image: url("../images/gameui/button/button-md.png");
            font-size: 18px;
            padding-bottom: 8px;
        }
    }

    @include media-breakpoint-up(md) {
        .interact-status {
            width: 90vw;
            top: 78vh;
            font-size: 0.75em;
        }

        div.information-modal {
            max-height: 21vh;
            width: 90vw;
            font-size: 0.75em;
        }
    }
</style>
