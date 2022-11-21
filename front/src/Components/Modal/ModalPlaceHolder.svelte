<script lang="ts">
</script>

<div class="modal-place-holder">
    <div class="modal-wrapper">
        <!--MapType-->
        <!-- {$currentComponentModalStore} -->
        <!-- {#if $currentComponentModalStore == ComponentModalType.ADD_MAP_TYPE}
            <AddMapTypeModal />
        {/if} -->
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
