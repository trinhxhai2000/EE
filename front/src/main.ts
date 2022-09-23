// import './app.css'

import App from './Components/App.svelte';
import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;

import WebFontLoaderPlugin from "phaser3-rex-plugins/plugins/webfontloader-plugin.js";

const config: GameConfig = {
  type: Phaser.CANVAS, // do not change this
  title: "Doge Solar SubPhaser",
  url: "https://dogesolar.net",
  scale: {
    // width: 200,
    // height: 200,
    autoRound: true,
    resizeInterval: 999999999999,
  },
  scene: [
  ],
  //resolution: window.devicePixelRatio / 2,
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
      debug: false,
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

const game = new Game(config);

const app = new App({
  target: document.getElementById('app'),
  props: {
    game: game,
  },
})

export default app
