
interface AnimationData {
    key: string;
    frameRate: number;
    repeat: number;
    frameModel: string; //todo use an enum
    frames: number[];
}

interface Position {
    x: number,
    y: number,
}

import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import LoaderPlugin = Phaser.Loader.LoaderPlugin;



import dude from "/game-characters/dude.png";


export class Player extends Phaser.GameObjects.Container {
    public playerName: string = "";
    // public sprites: Map<string, Sprite>;
    private character: any; // !!!!
    private bullets: Phaser.Physics.Arcade.Group | null = null;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        // this.sprites = new Map<string, Sprite>();
        // this,ad

    }
    preload() {
        console.log("preload")
        this.scene.load.spritesheet("dude", dude, {
            frameWidth: 32,
            frameHeight: 48,
        });
    }




}