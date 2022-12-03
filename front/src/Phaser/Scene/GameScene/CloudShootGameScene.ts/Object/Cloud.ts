interface AnimationData {
    key: string;
    frameRate: number;
    repeat?: number;
    frameModel: string; //todo use an enum
    frames: number[];
}

export enum CloudAnimationMove {
    NORMAL = "normal",
    WRONG = "wrong",
    CORRECT = "correct",
    HIT = "hit",
}



interface Position {
    x: number,
    y: number,
}

import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import LoaderPlugin = Phaser.Loader.LoaderPlugin;

import { v4 as uuidv4 } from 'uuid';

import type CancelablePromise from "cancelable-promise";

import { CLOUD_RESOURCES, type BodyResourceDescriptionInterface } from "../../../../Entity/PlayerTextures";
import { lazyLoadPlayerCharacterTextures } from "../../../../Entity/PlayerTexturesLoadingManager";
import { PlayerAnimationDirections } from "../../../../Player/Animation";
import { GAME_CONFIG } from "../../../../../main";
import type { Option } from "../../../../../interface/entity/Option";

export class Cloud extends Container {
    public id: string;
    public objectSprites: Map<string, Sprite>;
    public currentTexture: string = "";
    public dataOption: Option | null = null;
    currentSprite: Sprite | null = null;
    public isReady = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y);
        this.id = uuidv4();
        console.log("this.id", this.id)
        console.log("Cloud class constructor")
        this.scene = scene;
        this.currentTexture = texture;

        this.objectSprites = new Map<string, Sprite>();

        const LIST_CLOUD_TEXTURE: string[] = []

        for (const key in CLOUD_RESOURCES) {
            LIST_CLOUD_TEXTURE.push(CLOUD_RESOURCES[key].name);
        }

        const objectTexturePromise = lazyLoadPlayerCharacterTextures(scene.load, LIST_CLOUD_TEXTURE);

        //textures are inside a Promise in case they need to be lazyloaded before use.
        objectTexturePromise
            .then((textures) => {
                this.addTextures(textures);

                this.isReady = true;

                const CLOUD_SIZE = {
                    width: CLOUD_RESOURCES[texture].frameConfig?.frameWidth,
                    height: CLOUD_RESOURCES[texture].frameConfig?.frameHeight,
                };
                if (!CLOUD_SIZE.width || !CLOUD_SIZE.height) {
                    throw new Error(`Cant get size from ${texture}`);
                }

                this.scene = scene;

                scene.add.existing(this);

                this.scene.physics.world.enableBody(this);
                // this.getBody().setImmovable(true);

                const body = this.getBody();

                // body.setImmovable(true);
                body.setCollideWorldBounds(true);
                this.setSize(CLOUD_SIZE.width, CLOUD_SIZE.height);
                body.setSize(CLOUD_SIZE.width, CLOUD_SIZE.height); //edit the hitbox to better match the character model
                // this.getBody().setOffset(0, 35);


                // disable gravity of clouds
                const gY = GAME_CONFIG.physics?.arcade?.gravity?.y;
                if (gY) {
                    body.setGravityY(-gY);
                }
                this.emit(this.readyEvent);
            })
            .catch(() => {
                console.warn("Can't load the expected textures, loaded the default textures !")
                // return lazyLoadPlayerCharacterTextures(scene.load, ['dude']).then((textures) => {
                //     console.warn("Can't load the expected textures, loaded the default textures !")
                //     this.addTextures(textures);
                // });
            })
            .finally(() => {

            });




    }

    get readyEvent() {
        return 'ready' + this.id;

    }

    public async ready(): Promise<true> {
        return new Promise((resolve, reject) => {
            this.on(this.readyEvent, () => {
                resolve(true);
            })
            // [todo]: refactor ready timeout
            setTimeout(() => {
                reject(new Error('Cloud ready timeout'))
            }, 5000)
        })
    }

    public addTextures(textures: string[], frame?: string | number): void {
        if (textures.length < 1) {
            throw new Error("no texture given");
        }

        // this.currentSkinLayers = textures;

        for (const texture of textures) {
            if (this.scene && !this.scene.textures.exists(texture)) {
                throw new Error("texture not found texture: " + texture);
            }
            const sprite = new Sprite(this.scene, 0, 0, texture);
            if (texture !== this.currentTexture) {
                continue
            }
            this.currentSprite = sprite;

            console.log("DOOOOO")

            this.add(sprite);


            this.getPlayerAnimations(texture).forEach((d) => {
                console.log("define: ", d.key);

                this.scene.anims.create({
                    key: d.key,
                    frames: this.scene.anims.generateFrameNumbers(d.frameModel, { frames: d.frames }),
                    frameRate: d.frameRate,
                    repeat: d.repeat,
                });
            });



            sprite.on('animationcomplete', (anim: any, frame: any) => this.onAnimationComplete(anim.key as string), sprite);
            // Needed, otherwise, animations are not handled correctly.
            if (this.scene) {
                this.scene.sys.updateList.add(sprite);
            }
            this.objectSprites.set(texture, sprite);
        }
    }

    public onAnimationComplete(key: string) {
        if (key == this.currentTexture + CloudAnimationMove.NORMAL) {
            this.playAnimation(CloudAnimationMove.NORMAL)
        }
    }

    public setOptionText(option: Option) {
        this.dataOption = option;
        console.log("setOptionText", option)

        // const containerWidth = this.width;
        // const containerPaddingHor = 10;

        let text = option.description;
        const fontSize = 20;

        const content = this.scene.add.bitmapText(0, 0, 'LilitaOne', text, fontSize)
            .setInteractive()
            .setOrigin(0.5)
            .setCenterAlign();

        this.add(content);
        // this.moveUp(content);
        this.addToUpdateList();
    }

    private getPlayerAnimations(name: string): AnimationData[] {
        return [
            {
                key: `${name}-${CloudAnimationMove.NORMAL}`,
                frameModel: name,
                frames: [0],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${CloudAnimationMove.WRONG}`,
                frameModel: name,
                frames: [0, 2, 0],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${CloudAnimationMove.CORRECT}`,
                frameModel: name,
                frames: [0, 1, 0],
                frameRate: 10,
                repeat: -1,
            },
            {
                key: `${name}-${CloudAnimationMove.HIT}`,
                frameModel: name,
                frames: [0, 4, 0],
                frameRate: 10,
                repeat: 1,
            },


        ];
    }

    public playAnimation(move: CloudAnimationMove): void {
        // if (this.invisible) return;
        for (const [texture, sprite] of this.objectSprites.entries()) {
            if (!sprite.anims) {
                console.error("ANIMS IS NOT DEFINED!!!");
                return;
            }
            console.log("play: ", texture + "-" + move);
            sprite.anims.play(texture + "-" + move, true);
        }
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