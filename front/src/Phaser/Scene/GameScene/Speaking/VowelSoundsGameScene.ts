import { Scene } from "phaser";

export const VowelSoundsGameSceneName = "VowelSoundsGameScene";

// import skyBackground from '../../../public/game-objects/sky.png'
import skyBackground from "/game-objects/sky.png";
import background from "/game-objects/background.jpg";
import star from "/game-objects/star.png";
import bomb from "/game-objects/bomb.png";
import ground from "/game-objects/platform.png";
import dude from "/game-characters/dude.png";

export class VowelSoundsGameScene extends Scene {
    private platforms: any; // !!!!
    private player: any; // !!!!
    private cursors: any; // !!!!
    private stars: any;

    constructor() {
        super({
            key: VowelSoundsGameSceneName,
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
    }

    create() {
        this.add.image(400, 300, "sky");
        const bg = this.add.image(400, 300, "background");
        bg.setOrigin(0, 0);

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

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

        this.cursors = this.input.keyboard.createCursorKeys();

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
        this.startBackGround();
    }

    // BACKGROUND - INFINITE MOVING MANAGER

    startBackGround() {
        this.stars = this.add.image(400, 300, "star");
        // this.stars.setCollideWorldBounds(true);
    }

    update(time: number, delta: number): void {
        this.stars.y += 10;
        if (this.stars.y >= this.game.canvas.height) {
            this.stars.y = 0;
        }
        // if()

        let cursors = this.input.keyboard.createCursorKeys();
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
    }
    collectStar(player: any, star: any) {
        star.disableBody(true, true);

        // score += 10;
        // scoreText.setText("Score: " + score);
    }
}
