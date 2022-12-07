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
import { Player } from "./Object/Player";
import { lazyLoadPlayerCharacterTextures } from "../../../Entity/PlayerTexturesLoadingManager";
import { PlayerAnimationDirections } from "../../../Player/Animation";
import type { Question } from "../../../../interface/entity/Question";
import { CommonUtils } from "../../../../Utils/CommonUtils";
import type { Option } from "../../../../interface/entity/Option";
import { Cloud, CloudAnimationMove } from "./Object/Cloud";
import { CLOUD_RESOURCES } from "../../../Entity/PlayerTextures";

import { currentScore, currentCountDown, currentQuestion, isStartGame } from "../../../../Stores/GameActionStore/CloudShootGameStore";
import { GAME_CONFIG } from "../../../../main";
import { infoModalStore } from "../../../../Stores/ModalStore";
import { adminPageVisibilityStore } from "../../../../Stores/LoginVisibilityStore";

export interface Rectangle {
    leftX: number,
    rightX: number,
    topY: number,
    bottomY: number,
}

export const SCENE_CONFIG = {
    NUMBER_OF_ROUND: 2,
    ROUND_DURATION: 20,
    BREAK_DURATION: 2,
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


    // external
    private currentScore = 0;


    constructor() {
        super({
            key: CloudShootGameSceneName,
        });

    }

    // From the very start, let's preload images used in th e ReconnectingScene.
    preload() {
        this.load.image("sky", skyBackground);
        this.load.image("background", background);
        this.load.image("ground", ground);
        this.load.image("star", star);


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
    }


    initUIData() {
        this.restartCountDown();
    }
    restartCountDown() {
        console.log("restartCountDown")
        currentCountDown.set({
            duration: 20,
            startTime: Date.now()
        })
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



        const bullets = this.player.getBullets();

        if (bullets !== null && this.clouds !== null) {
            // this.physics.add.collider
            this.physics.add.overlap(
                bullets,
                this.clouds,
                this.onBulletsHitClouds,
                undefined,
                this
            );
        }

        // this.startBackGround();
        this.initUIData();
        this.startTheGame();
    }

    setUpOverlapBallAndCloud() {
        if (this.player) {
            const bullets = this.player.getBullets();

            if (bullets !== null && this.clouds !== null) {
                // this.physics.add.collider
                this.physics.add.overlap(
                    bullets,
                    this.clouds,
                    this.onBulletsHitClouds,
                    undefined,
                    this
                );
            }
        }

    }

    async randomlyPutCould(rect: Rectangle = { leftX: 100, rightX: 1500, topY: 100, bottomY: 350 }) {
        // const test = new Cloud(this, 500, 500, `cloud1`);
        // // test.playAnimation(CloudAnimationMove.WRONG)
        // setTimeout(() => {
        //     test.playAnimation(CloudAnimationMove.WRONG)
        // }, 100)
        // return

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

        this.setUpOverlapBallAndCloud();

        this.putOptionToClouds();
    }

    putOptionToClouds() {
        const clouds = this.clouds;
        const nClouds = this.clouds.length;

        if (nClouds == 0) {
            throw Error('There is no cloud to put options')
        }

        const question = LIST_QUEST[this.currentQuestionIndex];
        this.putQuestionDataToUI(question);
        const options = question.options;
        console.log("QUESSSTION", question)
        let curOptionsIdx = 0;
        for (const cloud of clouds) {
            const opt = options[curOptionsIdx++];
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
        setTimeout(() => {
            this.clearOldQuestion();
        }, SCENE_CONFIG.ROUND_DURATION * 1000)

        const gameRoundInterval = setInterval(async () => {
            numberOfRound--;

            await this.randomlyPutCould();

            setTimeout(() => {
                this.clearOldQuestion();
                if (numberOfRound === 0) {
                    clearInterval(gameRoundInterval);
                    this.showGameResult()
                }
            }, SCENE_CONFIG.ROUND_DURATION * 1000)

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

        this.input.keyboard.on('keydown-S', () => this.handleShootingKeyPress(time), this);


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

    handleShootingKeyPress(time: number) {
        const bullets = this.player?.getBullets();
        const arrow = this.player?.getArrow();
        const player = this.player;

        if (time - this.lastFired > 1000) {


            if (bullets && arrow && player) {
                const bullet = bullets.get();

                if (bullet && arrow && player) {
                    // for debug: mark position star shooting
                    // this.add.image(player.x, player.y, "star");

                    // bullet.fire(this.arrow.x, this.arrow.y, this.arrow.x + 300, this.arrow.y - 300);
                    this.lastFired = time;
                    console.log("Do sShooting ", time)
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
        // console.log("cloud", cloud)

        if (this.markOverLap.get(cloud.currentTexture)) {
            return
        }

        this.markOverLap.set(cloud.currentTexture, true);

        cloud.playAnimation(CloudAnimationMove.HIT);

        console.log("onBulletsHitClouds")
        bullet.body.stop();
        bullet.setGravityY(-300);


        isCorrectOption(1).then((isAnswer) => {

            const rand = Math.floor(Math.random() * 3);
            console.log("Rand", rand)
            if (rand === 0) {
                bullet.destroy();
                cloud.playAnimation(CloudAnimationMove.CORRECT);
                this.increaseUIScore()


            } else {
                bullet.destroy();
                cloud.playAnimation(CloudAnimationMove.WRONG);
                this.markOverLap.set(cloud.currentTexture, false);
            }
            setTimeout(() => {
                cloud.destroy();
            }, 200)
        })

        // cloud.getBody().stop();

        //not thing happen
        // bullet.setActive(false);
        // cloud.setActive(false);

        // bullet.disableBody(true, true);
        // cloud.

    }
}


// OTHER BUSSINESS
let mapAnswer = new Map<number, boolean>();
const LIST_QUEST: Question[] = ListQuestionGenerator();


function ListQuestionGenerator(): Question[] {
    let result: Question[] = [];

    let currentOptionId = 1;
    const charList = ['A'];
    for (let i = 1; i < 26; i++) {
        var chr = String.fromCharCode(65 + i)
        charList.push(chr);
    }

    const numberOfAnswer = 6;

    for (let i = 0; i < 20; i++) {
        const question: Question = {
            id: i + 1,
            description: '',
            options: []
        }
        // just make a copy
        const cloneCharList = charList.slice();
        CommonUtils.shuffle<string>(cloneCharList);


        question.description = `Choose ${cloneCharList.slice(0, numberOfAnswer).join(', ')} !!`;


        for (let j = 0; j < numberOfAnswer; j++) {
            mapAnswer.set(currentOptionId, true);
            const option: Option = {
                id: currentOptionId++,
                description: `${cloneCharList[j]}. 1234`,
            }
            question.options.push(option);
        }

        for (let j = numberOfAnswer; j < cloneCharList.length; j++) {
            mapAnswer.set(currentOptionId, false);
            const option: Option = {
                id: currentOptionId++,
                description: `${cloneCharList[j]}. 1234`,
            }
            question.options.push(option);
        }

        result.push(question);
    }

    result = CommonUtils.shuffle(result);
    console.log("gen question result:", result)

    // !!!!!
    return result;
}


async function isCorrectOption(optionId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if (mapAnswer.get(optionId)) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, 2000);
    });
}