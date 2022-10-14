<script lang="ts">
    import { Game } from "phaser";
    import {
        SelectMapSceneName,
        type MapType,
    } from "../../Phaser/Game/GameManager";
    import { EntryScene, EntrySceneName } from "../../Phaser/Scene/EntryScene";
    import { SelectMapScene } from "../../Phaser/Scene/SelectMapScene";
    import { loginVisibilityStore } from "../../Stores/LoginVisibilityStore";

    function login() {
        loginVisibilityStore.set(false);
        startTheGame();
    }

    export let game: Phaser.Game;

    function startTheGame() {
        const entryScene = game.scene.getScene(EntrySceneName) as EntryScene;
        if (entryScene) {
            entryScene.startTheGame();
        } else {
            console.error("CAN'T NOT GET THE ENTRY SCENE");
        }
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
