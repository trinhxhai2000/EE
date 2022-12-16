
interface AnimationData {
    key: string;
    frameRate: number;
    repeat?: number;
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

import type CancelablePromise from "cancelable-promise";



import dude from "/game-characters/dude.png";
import arrow from "/game-objects/arrow.png";
import type { BodyResourceDescriptionInterface } from "../../../../Entity/PlayerTextures";
import { lazyLoadPlayerCharacterTextures } from "../../../../Entity/PlayerTexturesLoadingManager";
import { PlayerAnimationDirections } from "../../../../Player/Animation";
import { Bullet } from "./Bullet";

export class Player extends Container {
    public playerName: string = "";
    public playerSprites: Map<string, Sprite>;
    public objectSprites: Map<string, Sprite>;
    public character: Sprite | null = null; // !!!!

    private bullets: Phaser.Physics.Arcade.Group | null = null;

    private arrow: Sprite | null = null; // !!!!
    private lastFired = 0;

    private playerTexturePromise: CancelablePromise<string[] | void> | undefined;
    private objectTexturePromise: CancelablePromise<string[] | void> | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);


        // init obvious things
        this.playerSprites = new Map<string, Sprite>();
        this.objectSprites = new Map<string, Sprite>();
        // this.sprites = new Map<string, Sprite>();
        // this,ad


        this.scene.load.spritesheet("dude", dude, {
            frameWidth: 32,
            frameHeight: 48,
        });


        const objectTexturesPromise = lazyLoadPlayerCharacterTextures(scene.load, ['arrow']);

        objectTexturesPromise
            .then((textures) => {
                // const loadedTextures = [...textures, ...scene.textures.getTextureKeys()];
                // // for (const texture of playerCharacterLayers) {
                // //     if (!loadedTextures.includes(texture)) {
                // //         throw Error("The textures return by lazyLoadPlayerTextures & scene loaded textures not includes the playerCharacterLayers");
                // //     }
                // // }

                this.addObject(textures);
                // this.invisible = false;
                // this.playAnimation(direction, actionStatus);


                // return this.getSnapshot().then((htmlImageElementSrc) => {
                //     this._pictureStore.set(htmlImageElementSrc);
                // });
            })
            .catch(() => {

                return lazyLoadPlayerCharacterTextures(scene.load, ['dude']).then((textures) => {
                    console.warn("Can't load the expected textures, loaded the default textures !")
                    this.addObject(textures);
                    // this.invisible = false;
                    // this.playAnimation(direction, actionStatus);
                });
            })
            .finally(() => {
                this.playerTexturePromise = undefined;
            });




        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            quantity: 500,
            maxSize: 500,
            active: true,
            max: 0,
            runChildUpdate: true
        });

        // for (let i = 0; i < 200; i++) {
        //     this.bullets.get();
        // }

        // lay
        const playerTexturePromise = lazyLoadPlayerCharacterTextures(scene.load, ['dude']);

        //textures are inside a Promise in case they need to be lazyloaded before use.
        playerTexturePromise
            .then((textures) => {
                // const loadedTextures = [...textures, ...scene.textures.getTextureKeys()];
                // // for (const texture of playerCharacterLayers) {
                // //     if (!loadedTextures.includes(texture)) {
                // //         throw Error("The textures return by lazyLoadPlayerTextures & scene loaded textures not includes the playerCharacterLayers");
                // //     }
                // // }

                this.addPlayerTextures(textures);
                // this.invisible = false;
                // this.playAnimation(direction, actionStatus);


                // return this.getSnapshot().then((htmlImageElementSrc) => {
                //     this._pictureStore.set(htmlImageElementSrc);
                // });
            })
            .catch(() => {

                // return lazyLoadPlayerCharacterTextures(scene.load, ['dude']).then((textures) => {
                //     console.warn("Can't load the expected textures, loaded the default textures !")
                //     this.addPlayerTextures(textures);
                //     // this.invisible = false;
                //     // this.playAnimation(direction, actionStatus);
                // });
            })
            .finally(() => {
                this.playerTexturePromise = undefined;
            });

        const DUDE_SIZE = {
            height: 48,
            width: 32,
        }

        this.scene = scene;
        scene.add.existing(this);

        this.scene.physics.world.enableBody(this);

        const body = this.getBody();
        // this.getBody().setImmovable(true);
        body.setCollideWorldBounds(true);
        this.setSize(DUDE_SIZE.width, DUDE_SIZE.height);
        body.setSize(DUDE_SIZE.width, DUDE_SIZE.height); //edit the hitbox to better match the character model
        // this.getBody().setOffset(0, 35);
        this.setDepth(0);

        // this.player = this.physics.add.sprite(100, 450, "dude");
        // this.player.setBounce(0.2);
        // this.player.setCollideWorldBounds(true);

        // for testing remove lines below
        body.setGravity(0, 0);
        body.setGravityX(0);
        body.setGravityY(0);
        body.setAcceleration(0, 0);

    }

    public addPlayerTextures(textures: string[], frame?: string | number): void {
        if (textures.length < 1) {
            throw new Error("no texture given");
        }

        // this.currentSkinLayers = textures;

        for (const texture of textures) {
            if (this.scene && !this.scene.textures.exists(texture)) {
                throw new Error("texture not found texture: " + texture);
            }
            const sprite = new Sprite(this.scene, 0, 0, texture, frame);
            // sprite.setDepth(200);
            this.add(sprite);

            this.getPlayerAnimations(texture).forEach((d) => {
                this.scene.anims.create({
                    key: d.key,
                    frames: this.scene.anims.generateFrameNumbers(d.frameModel, { frames: d.frames }),
                    frameRate: d.frameRate,
                    repeat: d.repeat,
                });
            });

            // sprite.on('animationcomplete', (anim: any, frame: any) => this.onAnimationComplete(anim.key as string), sprite);
            // Needed, otherwise, animations are not handled correctly.
            if (this.scene) {
                this.scene.sys.updateList.add(sprite);
            }
            this.playerSprites.set(texture, sprite);
        }
    }

    public addObject(textures: string[], frame?: string | number): void {
        if (textures.length < 1) {
            throw new Error("no texture given");
        }

        // this.currentSkinLayers = textures;

        for (const texture of textures) {
            if (this.scene && !this.scene.textures.exists(texture)) {
                throw new Error("texture not found texture: " + texture);
            }
            const sprite = new Sprite(this.scene, 0, 0, texture, frame);
            sprite.setDepth(1);

            if (texture == 'arrow') {
                this.arrow = sprite;
                this.arrow.setScale(0.8);
            }
            this.add(sprite);

            // this.getPlayerAnimations(texture).forEach((d) => {
            //     this.scene.anims.create({
            //         key: d.key,
            //         frames: this.scene.anims.generateFrameNumbers(d.frameModel, { frames: d.frames }),
            //         frameRate: d.frameRate,
            //         repeat: d.repeat,
            //     });
            // });

            // sprite.on('animationcomplete', (anim: any, frame: any) => this.onAnimationComplete(anim.key as string), sprite);
            // Needed, otherwise, animations are not handled correctly.
            if (this.scene) {
                this.scene.sys.updateList.add(sprite);
            }
            this.objectSprites.set(texture, sprite);
        }
    }


    private getPlayerAnimations(name: string): AnimationData[] {

        // [todo] temporary, just copy paste, fix later
        return [
            {
                key: `${name}-${PlayerAnimationDirections.Down}`,
                frameModel: name,
                frames: [0, 1, 2, 1],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${PlayerAnimationDirections.Left}`,
                frameModel: name,
                frames: [0, 1, 2, 3],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${PlayerAnimationDirections.Right}`,
                frameModel: name,
                frames: [5, 6, 7, 8],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${PlayerAnimationDirections.Up}`,
                frameModel: name,
                frames: [9, 10, 11, 10],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${PlayerAnimationDirections.Turn}`,
                frameModel: name,
                frames: [4],
                frameRate: 20,
                repeat: 1,
            }

        ];
    }

    public playAnimation(direction: PlayerAnimationDirections): void {
        // console.log("Player play animtion", direction)
        // if (this.invisible) return;
        for (const [texture, sprite] of this.playerSprites.entries()) {
            if (!sprite.anims) {
                console.error("ANIMS IS NOT DEFINED!!!");
                return;
            }
            sprite.anims.play(texture + "-" + direction, true);
        }
    }

    public getCharacter() {
        if (this.character === null) {
            throw new Error('Character in Player is null')
        }
        return this.character;
    }

    public getArrow() {
        if (this.arrow === null) {
            throw new Error('The arrow in Player.ts is null');
        }
        return this.arrow
    }


    public getBullets() {
        if (this.bullets === null) {
            throw new Error('Bullets in Player is null')
        }
        return this.bullets;
    }

    public getBody(): Phaser.Physics.Arcade.Body {
        const body = this.body;
        if (!(body instanceof Phaser.Physics.Arcade.Body)) {
            throw new Error("Container does not have arcade body");
        }
        return body;
    }

    public move(x: number, y: number) {
        const body = this.getBody();
        body.setVelocity(x, y);
    }
}