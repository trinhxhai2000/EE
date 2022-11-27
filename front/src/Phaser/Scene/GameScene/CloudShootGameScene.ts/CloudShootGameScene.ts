import { Scene } from "phaser";

export const CloudShootGameSceneName = "CloudShootGameScene";

// import skyBackground from '../../../public/game-objects/sky.png'
import skyBackground from "/game-objects/sky.png";
import background from "/game-objects/background.jpg";
import star from "/game-objects/star.png";
import bomb from "/game-objects/bomb.png";
import ground from "/game-objects/platform.png";
import dude from "/game-characters/dude.png";


import arrow from "/game-objects/arrow.png";
import bullet from "/game-objects/ball.png";
import { Bullet } from "./Object/Bullet";

export interface Rectangle {
    leftX: number,
    rightX: number,
    topY: number,
    bottomY: number,
}

export class CloudShootGameScene extends Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup | null = null; // !!!!
    private player: any; // !!!!
    private cursors: any; // !!!!
    private stars: any;

    private arrow: Phaser.GameObjects.Sprite | null = null; // !!!!
    private bullets: Phaser.Physics.Arcade.Group | null = null;

    private fireRate = 100;
    private lastFired = 0;
    private clouds: Phaser.Physics.Arcade.StaticGroup | null = null;


    //temporary
    private canvas: HTMLCanvasElement | null = null;



    constructor() {
        super({
            key: CloudShootGameSceneName,
        });

    }

    // From the very start, let's preload images used in th e ReconnectingScene.
    preload() {
        console.log("preload function", skyBackground);
        this.load.image("sky", skyBackground);
        this.load.image("background", background);
        this.load.image("ground", ground);
        this.load.image("star", star);

        for (let i = 1; i <= 10; i++) {
            let href = `/game-objects/cloud${i}.png`;
            this.load.image(`cloud${i}`, href);
            console.log(`load cloud${i}`);
        }

        this.load.image("star", star);
        this.load.image("bomb", bomb);
        this.load.spritesheet("dude", dude, {
            frameWidth: 32,
            frameHeight: 48,
        });

        this.load.image("arrow", arrow);
        this.load.image("bullet", bullet);

    }

    create() {
        this.canvas = this.game.canvas;
        if (!this.canvas) {
            throw new Error("Can't get canvas element from phaser games");
        }

        this.add.image(400, 300, "sky");
        const bg = this.add.image(0, 0, "background");
        bg.setOrigin(0, 0);

        this.platforms = this.physics.add.staticGroup();

        /* #region create ground  */

        const groundSize = {
            w: 400,
            h: 32
        };


        this.platforms.create(0, this.canvas.height - groundSize.h * 2, "ground").setScale(2).setOrigin(0, 0).refreshBody();
        this.platforms.create(groundSize.w, this.canvas.height - 32 * 2, "ground").setScale(2).setOrigin(0, 0).refreshBody();
        this.platforms.create(groundSize.w * 2, this.canvas.height - 32 * 2, "ground").setScale(2).setOrigin(0, 0).refreshBody();
        this.platforms.create(groundSize.w * 3, this.canvas.height - 32 * 2, "ground").setScale(2).setOrigin(0, 0).refreshBody();

        // this.platforms.create(600, 400, "ground");
        // this.platforms.create(50, 250, "ground");
        // this.platforms.create(750, 220, "ground");

        /* #endregion */

        /* #region create player */
        this.player = this.physics.add.sprite(100, 450, "dude");

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        /* #endregion */
        this.cursors = this.input.keyboard.createCursorKeys();

        this.randomlyPutCould()


        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 10000,
            runChildUpdate: true
        });




        this.arrow = this.physics.add.staticSprite(500, 800, 'arrow');
        // .sprite(400, 300, 'arrow');
        if (arrow === null) {
            throw new Error();
        }
        // this.arrow.anchor.set(0.5);
        // this.arrow.body.allowRotation = false;


        // this.stars = this.physics.add.group({
        //     key: "star",
        //     repeat: 11,
        //     setXY: { x: 20, y: 0, stepX: 70 },
        // });

        // this.stars.children.iterate(function (child: any) {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // });

        // this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.collider(this.stars, this.platforms);

        // this.physics.add.overlap(
        //     this.player,
        //     // this.stars,
        //     this.collectStar,
        //     undefined,
        //     this
        // );

        if (this.bullets !== null && this.clouds !== null) {
            this.physics.add.overlap(
                this.bullets,
                this.clouds,
                this.onBulletsHitClouds,
                undefined,
                this
            );
        }


        this.startBackGround();
    }

    randomlyPutCould(rect: Rectangle = { leftX: 100, rightX: 1500, topY: 100, bottomY: 300 }) {
        //[todo] : efficiently put cloud in specific rect, for now put it fixed

        let preX = rect.leftX;
        let preY = rect.topY;
        let curMaxHeight = -1;

        this.clouds = this.physics.add.staticGroup();

        let curCloud: Phaser.Types.Physics.Arcade.ImageWithStaticBody | null = null;

        for (let curIdx = 1; curIdx <= 10;) {

            let gap = 80 + Math.random() * 100;
            // let gap = 0;

            if (curCloud === null) {
                curCloud = this.clouds.create(preX, preY, `cloud${curIdx}`).setVisible(false).setScale(0.65).setOrigin(0, 0).refreshBody();
                // curCloud = this.physics.add.staticImage(preX, preY, `cloud${curIdx}`).setVisible(false).setScale(0.65).setOrigin(0, 0).refreshBody();
                console.log(`add cloud${curIdx}`);
            }
            if (curCloud === null) {
                throw new Error(`Can't create clouds`)
            }


            curMaxHeight = Math.max(curMaxHeight, curCloud.height);
            const newX = preX + gap;
            const newY = preY;
            if (newX >= rect.rightX && newY >= rect.bottomY) {
                throw new Error('Run out of space for adding cloud');
                break;
            }

            if (newX <= rect.rightX && newY <= rect.bottomY) {
                curCloud.setPosition(newX, newY).setVisible(true).refreshBody();
                preX = newX + curCloud.width * 0.65;
                preY = newY;
                curIdx += 1;
                curCloud = null;
            } else {
                preX = rect.leftX;
                preY += curMaxHeight;
                curMaxHeight = -1;
            }

        }


        // this.add.image(rect.topX, rect.bottomY, 'cloud2').setScale(0.5).setOrigin(0, 0);
        // this.add.image(rect.bottomX, rect.topY, 'cloud3').setScale(0.5).setOrigin(0, 0);
        // this.add.image(rect.bottomX, rect.bottomY, 'cloud4').setScale(0.5).setOrigin(0, 0);

    }

    // BACKGROUND - INFINITE MOVING MANAGER

    startBackGround() {
        this.stars = this.add.image(400, 300, "star");
        // this.stars.setCollideWorldBounds(true);
    }

    update(time: number, delta: number): void {

        // let x = this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // x.on('isdown', () => {

        // })

        const spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        if (Phaser.Input.Keyboard.JustDown(spacebar) && time > this.lastFired) {
            console.log("fuck ?")


            if (this.bullets !== null) {
                var bullet = this.bullets.get();



                if (bullet && this.arrow) {


                    this.add.image(this.arrow.x + 300, this.arrow.y - 300, "star");
                    this.add.image(this.arrow.x, this.arrow.y, "star");


                    // this.physics.add.image
                    // bullet.fire(this.arrow.x, this.arrow.y, this.arrow.x + 300, this.arrow.y - 300);
                    bullet.fireToAngle(this.arrow.x, this.arrow.y, this.arrow.rotation);
                    this.lastFired = time + 50;
                }
            }

        }


        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.down.isDown) {
            if (this.arrow) {
                this.arrow.rotation += 0.03;
                console.log("this.arrow.rotation", this.arrow.rotation)
            }
            return
        }
        if (cursors.up.isDown) {
            if (this.arrow) {
                this.arrow.rotation -= 0.03;
                console.log("this.arrow.rotation", this.arrow.rotation)
            }
            return
        }


        console.log("update function");
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }
        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }


        /* #region  shooting */
        // this.arrow.rotation = this.physics.angleToPointer(arrow);

        // if (game.input.activePointer.isDown) {
        //     fire();
        // }
        /* #endregion */
    }


    onBulletsHitClouds(bullet: any, cloud: any) {
        bullet.disableBody(true, true);
        cloud.disableBody(true, true);

    }
}
