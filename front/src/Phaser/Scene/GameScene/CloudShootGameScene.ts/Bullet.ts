export class Bullet extends Phaser.Physics.Arcade.Image {
    private speed = 0;
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'bullet');
        this.speed = Phaser.Math.GetSpeed(600, 1);
    }

    fire(fromX: number, fromY: number, toX: number, toY: number) {
        this.setActive(true);
        this.setVisible(true);
        this.setGravityY(0);
        this.setGravityX(0);
        this.refreshBody();


        console.log("pos From", {
            fromX, fromY
        })
        console.log("pos TO", {
            toX, toY
        })


        this.setPosition(fromX, fromY);

        // why work?
        this.scene.physics.moveTo(this, toX, toY, undefined, 120);

        // why not work?
        // this.scene.physics.moveTo(this, toX, toY, Phaser.Math.GetSpeed(10000, 1));

        // not working
        // this.scene.physics.accelerateTo(this, toX, toY, Phaser.Math.GetSpeed(300, 1));
    }

    fireToAngle(fromX: number, fromY: number, rotation: number) {
        // rotation += 100;

        console.log("pos From", {
            fromX, fromY
        })

        // rotation = -Math.PI / 4;
        const alpha = Math.abs(rotation);
        const r = 100;

        let dx = 0;
        let dy = 0;


        dy = r * Math.sin(alpha);
        dx = r * Math.cos(alpha);

        console.log("fire prop", { rotation, alpha, dx, dy })

        if (rotation < 0) {
            this.fire(fromX, fromY, fromX + dx, fromY - dy)
        } else {
            this.fire(fromX, fromY, fromX + dx, fromY + dy)
        }


        // this.fire(fromX, fromY, fromX + 500, fromY)

        // console.log("fire to angle", rotation)
        // this.setActive(true);
        // this.setVisible(true);
        // this.setGravityY(0);
        // this.setGravityX(0);
        // this.refreshBody();


        // this.setPosition(fromX, fromY);

        // // why work?
        // this.scene.physics.moveTo(this, toX, toY, Phaser.Math.GetSpeed(600, 1), 800);

        // why not work?
        // this.scene.physics.moveTo(this, toX, toY, Phaser.Math.GetSpeed(10000, 1));

        // not working
        // this.scene.physics.accelerateTo(this, toX, toY, Phaser.Math.GetSpeed(300, 1));
    }

    update(time: number, delta: number) {
        // this.y -= this.speed * delta;

        // if (this.y < -50) {
        //     this.setActive(false);
        //     this.setVisible(false);
        // }
    }
}