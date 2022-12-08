<script lang="ts">
    let successFlashText = "";
    let failFlashText = "";
    let isShowSuccessFlash = false;
    let isShowFailFlash = false;
    import { successFlash, errorFlash } from "../../Stores/FlashStore";
</script>

<div class="flash-container">
    {#if $successFlash !== ""}
        <div class="flash success-flash">
            {$successFlash}
        </div>
    {/if}

    {#if $errorFlash !== ""}
        <div class="flash fail-flash">
            {$errorFlash}
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";

    .flash-container {
        top: 30px;
        position: absolute;
        z-index: 9999;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        top: $header-height + 10px;
    }
    .flash {
        width: 95%;
        text-align: center;
        height: 40px;
        padding: 5px;
        border-radius: 10px;
        transition: 0.2s;
        margin-bottom: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .success-flash {
        background-color: rgba($color: #8eff77, $alpha: 0.8);
        background-color: #8eff77;
        /* opacity: 0.8; */
    }
    .fail-flash {
        background-color: #ff7668;
    }
</style>
