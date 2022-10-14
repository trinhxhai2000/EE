<script lang="ts">
</script>

<div class="main-container">
    <div class="top-left" />
    <div class="bottom-right" />
    mainLayout - game layout
</div>

<style lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
    }
    .top-left {
        border: 6px solid pink;
        height: 100px;
        width: 100px;
        top: 0;
        left: 0;
    }

    .bottom-right {
        border: 6px solid green;
        height: 100px;
        width: 100px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
