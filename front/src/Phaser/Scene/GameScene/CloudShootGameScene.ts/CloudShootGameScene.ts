import { Scene } from "phaser";

export const CloudShootGameSceneName = "CloudShootGameScene";

// import skyBackground from '../../../public/game-objects/sky.png'
import skyBackground from "/game-objects/sky.png";
import background from "/game-objects/background.jpg";
import star from "/game-objects/star.png";
import bomb from "/game-objects/bomb.png";
import ground from "/game-objects/platform.png";
import dude from "/game-characters/dude.png";

import gameUi from "/game-objects/game-ui.png";


import arrow from "/game-objects/arrow.png";
import bullet from "/game-objects/ball.png";
import { Player } from "./Object/Player";
import { PlayerAnimationDirections } from "../../../Player/Animation";
import type { Question } from "../../../../interface/entity/Question";
import { CommonUtils } from "../../../../Utils/CommonUtils";
import type { Choice } from "../../../../interface/entity/Choice";
import { Cloud, CloudAnimationMove } from "./Object/Cloud";

import { currentScore, currentCountDown, currentQuestion, isStartGame } from "../../../../Stores/GameActionStore/CloudShootGameStore";
import { infoModalStore, waitingModalStore } from "../../../../Stores/ModalStore";
import type { QuestionData, StartGameData } from "../../../../interface/api/CloudShootPlayData";
import { cloudShootApi } from "../../../../api/CloudShootApi";


export interface Rectangle {
    leftX: number,
    rightX: number,
    topY: number,
    bottomY: number,
}

export const SCENE_CONFIG = {
    NUMBER_OF_ROUND: 3,
    ROUND_DURATION: 25,
    BREAK_DURATION: 2,
}

export enum CLOUD_SHOOT_EVENT {
    FINISHED_LOAD_QUESTION = 'FINISHED_LOAD_QUESTION',
}

export class CloudShootGameScene extends Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup | null = null; // !!!!
    private cursors: any; // !!!!
    private stars: any;

    private fireRate = 100;
    private lastFired = 0;
    private player: Player | null = null;
    private clouds: Cloud[] = [];

    private markOverLap = new Map<string, boolean>();

    //temporary
    private canvas: HTMLCanvasElement | null = null;

    // question
    private currentQuestionIndex = 0;

    private gameData: StartGameData | undefined;

    // external
    private currentScore = 0;

    private timeOutList: NodeJS.Timeout[] = []



    constructor() {
        super({
            key: CloudShootGameSceneName,
        });


    }

    init(data: any) {
        this.gameData = data as StartGameData;
    }
    // From the very start, let's preload images used in th e ReconnectingScene.
    preload() {
        this.events.on('destroy', () => {
            console.log("ON CLOUDSHOOT SCENE DESTROY")
        })

        this.load.image("sky", skyBackground);
        this.load.image("background", background);
        this.load.image("ground", ground);
        this.load.image("star", star);
        this.load.image("game-ui", gameUi);

        this.load.image("bomb", bomb);
        this.load.spritesheet("dude", dude, {
            frameWidth: 32,
            frameHeight: 48,
        });

        this.load.image("arrow", arrow);
        this.load.image("bullet", bullet);

        (this.load as any).rexWebFont({
            custom: {
                families: ["inter", "Inter", "LilitaOne"],
                testString: "abcdefg",
            },
        });

        this.load.bitmapFont('gothic', 'assets/font/bitmap/gothic.png', 'assets/font/bitmap/gothic.xml');
        this.load.bitmapFont('LilitaOne', 'assets/font/bitmap/LilitaOne.png', 'assets/font/bitmap/LilitaOne.xml');


        this.addLoader();
    }

    addLoader() {
        // this.load.on("progress", (value: number) => {
        //     this.drawProgress();
        // });
        waitingModalStore.set('Loading resources...')
        this.load.on("complete", () => {
            waitingModalStore.set('')
        });
    }

    initUIData() {
        this.restartCountDown();
    }

    restartCountDown() {
        // console.log("restartCountDown")
        currentCountDown.set({
            duration: 20,
            startTime: Date.now()
        })
    }

    onDestroy() {
        console.log("ON CLOUDSHOOT SCENE DESTROY")
    }
    create() {



        this.lastFired = Date.now() - 2000;
        this.input.keyboard.on('keydown-S', () => this.handleShootingKeyPress(), this);

        this.canvas = this.game.canvas;
        if (!this.canvas) {
            throw new Error("Can't get canvas element from phaser games");
        }

        this.add.image(400, 300, "sky");
        const bg = this.add.image(0, 0, "background");
        bg.setOrigin(0, 0);

        this.platforms = this.physics.add.staticGroup();

        // const gameUI = this.add.image(0, 0, "game-ui");
        // const ratio = Math.min(this.canvas.height / gameUI.height, this.canvas.width / gameUI.width)
        // gameUI.setScale(ratio);
        // gameUI.setOrigin(0, 1).setPosition(0, this.canvas.height).setDepth(999);

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

        // const cloudtest = this.physics.add.sprite(100, 100, 'cloudtest', 3);

        // cloudtest.setCollideWorldBounds(true);


        /* #endregion */

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(this, 100, 100);

        // .sprite(400, 300, 'arrow');
        if (arrow === null) {
            throw new Error();
        }

        // this.stars = this.physics.add.group({
        //     key: "star",
        //     repeat: 11,
        //     setXY: { x: 20, y: 0, stepX: 70 },
        // });

        // this.stars.children.iterate(function (child: any) {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // });

        // this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.platforms);

        // this.physics.add.collider(this.stars, this.platforms);

        // this.physics.add.overlap(
        //     this.player,
        //     // this.stars,
        //     this.collectStar,
        //     undefined,
        //     this
        // );

        // const bullets = this.player.getBullets();

        // if (bullets !== null && this.clouds !== null) {
        //     // this.physics.add.collider
        //     this.physics.add.overlap(
        //         bullets,
        //         this.clouds,
        //         this.onBulletsHitClouds,
        //         undefined,
        //         this
        //     );
        // }

        // this.startBackGround();
        this.initUIData();
        this.startTheGame();
    }

    setUpOverlapBallAndCloud() {
        if (this.player) {
            const bullets = this.player.getBullets();

            console.log("setUpOverlapBallAndCloud", { bullets: bullets.getLength(), clouds: this.clouds.length })

            if (bullets !== null && this.clouds !== null) {
                // this.physics.add.collider
                this.physics.add.overlap(
                    bullets,
                    this.clouds,
                    this.onBulletsHitClouds,
                    undefined,
                    this
                );
                // console.log("SUCCESS RESET OVERLAP CLOUD AND BULLET!", { clouds: this.clouds });
            } else {
                throw new Error("FAIL RESET OVERLAP CLOUD AND BULLET!")
            }
        } else {
            throw new Error("FAIL RESET OVERLAP CLOUD AND BULLET!")
        }

    }

    async randomlyPutCould(rect: Rectangle = { leftX: 100, rightX: 1500, topY: 100, bottomY: 350 }) {
        //  adjust rect
        rect.rightX = Math.min(this.game.canvas.width - 50)

        //[todo] : efficiently put cloud in specific rect, for now put it fixed
        let preX = rect.leftX;
        let preY = rect.topY;
        let curMaxHeight = -1;
        let redo = false;
        this.clouds = [];

        let curCloud: Cloud | null = null;

        for (let curIdx = 1; curIdx <= 10;) {

            let gap = 80 + Math.random() * 100;
            // let gap = 0;

            if (curCloud === null) {
                curCloud = new Cloud(this, preX, preY, `cloud${curIdx}`).setVisible(false).addToUpdateList();
                await curCloud.ready();
                // curCloud = this.physics.add.staticImage(preX, preY, `cloud${curIdx}`).setVisible(false).setScale(0.65).setOrigin(0, 0).refreshBody();
                // console.log(`add cloud${curIdx}`);
            }

            if (curCloud === null) {
                throw new Error(`Can't create clouds`)
            }

            const width = curCloud.width;
            const height = curCloud.height;

            curMaxHeight = Math.max(curMaxHeight, height);
            const newX = preX + gap;
            const newY = preY;
            if (newX >= rect.rightX && newY >= rect.bottomY) {
                throw new Error('Run out of space for adding cloud');
                break;
            }

            // console.log("debug", { newX, newY, preX, preY })
            // console.log("debug cloud", { width, height })

            if (newX <= rect.rightX && newY <= rect.bottomY) {
                curCloud.setPosition(newX + width / 2, newY).setVisible(true);
                preX = newX + width;
                preY = newY;
                curIdx += 1;
                this.clouds.push(curCloud);
                curCloud = null;

            } else {
                preX = rect.leftX;
                preY += curMaxHeight + 20;
                curMaxHeight = -1;
                if (redo) {
                    throw new Error('Some things fucked');
                }
                redo = true;
            }
        }

        this.putOptionToClouds();

    }

    putOptionToClouds() {
        const clouds = this.clouds;
        const nClouds = this.clouds.length;

        if (nClouds == 0) {
            throw Error('There is no cloud to put options')
        }
        if (!this.gameData) {
            throw new Error('Game data is undefined')
        }

        const question = this.gameData.questions[this.currentQuestionIndex];
        this.putQuestionDataToUI(question);
        const choices = question.choices;
        let curOptionsIdx = 0;
        for (const cloud of clouds) {
            const opt = choices[curOptionsIdx++];
            cloud.setOptionText(opt);
            // break
        }
        this.currentQuestionIndex++;
    }

    putQuestionDataToUI(question: Question) {
        currentCountDown.set({
            duration: SCENE_CONFIG.ROUND_DURATION,
            startTime: Date.now()
        })
        currentQuestion.set({
            title: this.currentQuestionIndex + 1 + '',
            desc: question.description
        })

    }

    clearOldQuestion() {
        console.log("clear clearOldQuestion")
        for (let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].destroy();
        }
        this.clouds = [];
    }

    // BACKGROUND - INFINITE MOVING MANAGER
    async startTheGame() {

        let numberOfRound = SCENE_CONFIG.NUMBER_OF_ROUND;

        await this.randomlyPutCould();

        this.timeOutList.push(setTimeout(() => {
            this.setUpOverlapBallAndCloud();
        }, 500))

        this.timeOutList.push(
            setTimeout(() => {
                this.clearOldQuestion();
            }, SCENE_CONFIG.ROUND_DURATION * 1000)
        )

        const gameRoundInterval = setInterval(async () => {
            numberOfRound--;

            await this.randomlyPutCould();

            this.timeOutList.push(setTimeout(() => {
                this.setUpOverlapBallAndCloud.bind(this)();
            }, 500))

            this.timeOutList.push(
                setTimeout(() => {
                    this.clearOldQuestion();
                    if (numberOfRound === 0) {
                        clearInterval(gameRoundInterval);
                        this.showGameResult()
                    }
                }, SCENE_CONFIG.ROUND_DURATION * 1000)
            )


        }, SCENE_CONFIG.ROUND_DURATION * 1000 + SCENE_CONFIG.BREAK_DURATION * 1000)
    }
    showGameResult() {
        this.scene.stop();
        const text = `Congratulation!!! You get ${this.currentScore} points!!`
        infoModalStore.showInfoModal(text, () => {
            isStartGame.set(false)
        })
    }

    update(time: number, delta: number): void {

        // this.input.keyboard.on('keydown-S', () => this.handleShootingKeyPress(time), this);
        console.log("time", time)

        const arrow = this.player?.getArrow();
        if (arrow) {
            if (this.cursors.down.isDown) {
                if (arrow) {
                    arrow.rotation += 0.03;
                }
                return
            }
            if (this.cursors.up.isDown) {
                if (arrow) {
                    arrow.rotation -= 0.03;
                }
                return
            }
        } else {

        }


        if (this.cursors.left.isDown) {
            this.player?.getBody().setVelocityX(-160);
            this.player?.playAnimation(PlayerAnimationDirections.Left);
            // this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.getBody().setVelocityX(160);
            this.player?.playAnimation(PlayerAnimationDirections.Right);
            // this.player.anims.play("right", true);
        } else {
            this.player?.getBody().setVelocityX(0);
            // this.player.anims.play("turn");
            this.player?.playAnimation(PlayerAnimationDirections.Turn);
        }

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.player?.getBody().touching.down) {
                this.player?.getBody().setVelocityY(-330);
            }
        }, this);

        // if (this.cursors.up.isDown && this.player.body.touching.down) {
        //     this.player1?.getBody().setVelocityY(-330);
        // }

    }

    handleShootingKeyPress(time: number = 0) {
        const bullets = this.player?.getBullets();
        const arrow = this.player?.getArrow();
        const player = this.player;


        const tnow = Date.now();
        // console.log("shoot",{tnow,pre:this.lastFired, del: tnow-this.lastFired})
        if (tnow - this.lastFired > 1000) {
            this.lastFired = tnow;

            if (bullets && arrow && player) {
                const bullet = bullets.get();

                // this.setUpOverlapBallAndCloud()

                if (bullet && arrow && player) {
                    // for debug: mark position star shooting
                    // this.add.image(player.x, player.y, "star");

                    // bullet.fire(this.arrow.x, this.arrow.y, this.arrow.x + 300, this.arrow.y - 300);
                    // this.lastFired = time;
                    console.log("Do sShooting ", time)
                    console.log("bullet ", bullets.getLength())
                    bullet.fireToAngle(player.x, player.y, arrow.rotation);
                }

            }

        }

    }

    increaseUIScore() {
        this.currentScore += 10;
        currentScore.set(this.currentScore);
    }

    onBulletsHitClouds(cloud: any, bullet: any) {
        // onBulletsHitClouds(cloud: Cloud, bullet: Bullet) {
        // bullet.destroy();
        // cloud.destroy();


        if (this.markOverLap.get(cloud.currentTexture)) {
            return
        }

        this.markOverLap.set(cloud.currentTexture, true);

        cloud.playAnimation(CloudAnimationMove.HIT);

        bullet.body.stop();
        bullet.setGravityY(-300);

        // console.log("cloud", cloud)
        // console.log("bullet", bullet)

        console.log(" onBulletsHitClouds cloud.dataChoice", cloud.dataChoice)
        if (!this.gameData) {
            throw new Error('Game data is undefined')
        }
        cloudShootApi.sendChoice(this.gameData.recordId, cloud.dataChoice.id).then((res) => {
            if (res.success) {
                if (res.data.isAnswer) {
                    bullet.destroy();
                    cloud.playAnimation(CloudAnimationMove.CORRECT);
                    this.increaseUIScore()

                } else {
                    bullet.destroy();
                    cloud.playAnimation(CloudAnimationMove.WRONG);
                    this.markOverLap.set(cloud.currentTexture, false);
                }
            }

            const PLAY_ANIMATION_TIME = 200;
            this.timeOutList.push(setTimeout(() => {
                cloud.destroy();
            }, PLAY_ANIMATION_TIME))

        })

    }


}
