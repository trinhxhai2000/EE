// import './app.css'

import "../style/index.scss";

import App from "./Components/App.svelte";
import "phaser";
type GameConfig = Phaser.Types.Core.GameConfig;


import WebFontLoaderPlugin from "phaser3-rex-plugins/plugins/webfontloader-plugin.js";
import { HtmlUtils } from "./Utils/HtmlUtils";
import { EntryScene } from "./Phaser/Scene/EntryScene";
import { gameSizeManager } from "./Phaser/Services/GameSizeManager";
import { SelectMapScene } from "./Phaser/Scene/SelectMapScene";
import { VowelSoundsGameScene } from "./Phaser/Scene/GameScene/Speaking/VowelSoundsGameScene";
import { GameManager, gameManager } from "./Phaser/Game/GameManager";
import { CloudShootGameScene } from "./Phaser/Scene/GameScene/CloudShootGameScene.ts/CloudShootGameScene";

// import dotnet from "dotenv";
// dotnet.config({ path: __dirname + '/.env' })
// dotnet.config({ path: '../.env' })

console.log("w window.screen.innerHeight", window.innerHeight);
console.log("w window.screen.innerWidth", window.innerWidth);
gameSizeManager.setSize(window.innerHeight, window.innerWidth);


export const GAME_CONFIG: GameConfig = {
    type: Phaser.CANVAS,

    title: "EE Edu",
    // url: "",
    // canvas: gameCanvas,
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        parent: "game-wrapper",
        width: gameSizeManager.width,
        height: gameSizeManager.height,
        autoRound: true,
        resizeInterval: 200,
    },
    scene: [
        EntryScene,
        SelectMapScene,
        // GAME SCENES
        // SPEAKING GAME SCENES
        VowelSoundsGameScene,
        CloudShootGameScene,
    ],
    // resolution: window.devicePixelRatio / 2,

    // fps: fps,
    // dom: {
    //     createContainer: true,
    // },
    disableContextMenu: true,
    render: {
        pixelArt: true,
        roundPixels: true,
        antialias: false,
        transparent: true,
    },
    plugins: {
        global: [
            {
                key: "rexWebFontLoader",
                plugin: WebFontLoaderPlugin, // i did not know what is used for yet !
                start: true,
            },
        ],
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 300 },
        },
    },
    // Instruct systems with 2 GPU to choose the low power one. We don't need that extra power and we want to save battery
    powerPreference: "low-power",
    // callbacks: {
    //     postBoot: (game) => {
    //         // Install rexOutlinePipeline only if the renderer is WebGL.
    //         const renderer = game.renderer;
    //         if (renderer instanceof WebGLRenderer) {
    //             game.plugins.install("rexOutlinePipeline", OutlinePipelinePlugin, true);
    //         }
    //     },
    // },
    // turn of greeting console.log
    banner: false,
};

const game = new Phaser.Game(GAME_CONFIG);
gameManager.setGameInstance(game);

let app: any;

game.events.addListener('ready', () => {
    console.log("game.events READY EVENT");
    app = new App({
        target: HtmlUtils.getElementByIdOrFail("app"),
        props: {
            game: game,
        },
    });
})

export default app;


