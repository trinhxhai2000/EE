<script lang="ts">
    import { waitingModalStore } from "../../Stores/modalStore";

    function onKeyDown(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
    }
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="container-main">
    <div class="waiting-modal">
        <div class="modal-loader" />
        <section class="title">
            <span style="padding: 0 20px;">{$waitingModalStore}</span>
        </section>
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";

    .container-main {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 99999;
        pointer-events: auto;
        div.waiting-modal {
            z-index: 99999;
            background-color: rgba(255, 255, 255, 1);
            background-size: cover;
            color: rgb(169, 169, 188);
            position: absolute;
            max-width: 480px;
            height: auto !important;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;

            section.title {
                margin-bottom: 20px;
                display: flex;
                justify-content: center;
                font-size: 18px;
            }
        }
    }

    @include media-breakpoint-up(md) {
        div.waiting-modal {
            width: 90vw;
            font-size: 0.75em;
        }
    }
</style>
