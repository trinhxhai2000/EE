<script lang="ts">
    import { gameManager } from "../../Phaser/Game/GameManager";
    import { VowelSoundsGameSceneName } from "../../Phaser/Scene/GameScene/Speaking/VowelSoundsGameScene";
    import { loginVisibilityStore } from "../../Stores/LoginVisibilityStore";

    function login() {
        loginVisibilityStore.set(false);
        startTheGame();
    }

    export let game: Phaser.Game;

    function startTheGame() {
        gameManager.startScene(VowelSoundsGameSceneName);
    }
</script>

<div class="login-main">
    <div class="login-container">
        <div class="text">Login Scene</div>
        <div class="btn" on:click={login}>
            <span>Login</span>
        </div>
    </div>
</div>

<style lang="scss">
    #login-btn {
    }
    .login-main {
        border: 3px solid red;
    }
    .login-container {
        border: 3px solid cyan;
    }
</style>
