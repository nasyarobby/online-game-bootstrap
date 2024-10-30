import { GameObjects, Scene } from "phaser";
import { PerspectiveCard } from "phaser3-rex-plugins/plugins/perspectiveimage.js";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: PerspectiveCard;
    logo2: PerspectiveCard;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "background");

        this.logo2 = new PerspectiveCard(this, {
            x: 200,
            y: 384,
            height: 0.5,
            width: 0.5,
            back: {
                key: "card_001",
            },
            front: {
                key: "card_001",
            },
        });

        this.logo2.angleX = 0;
        this.logo2.angleY = 0;
        this.logo2.angleZ = 0;

        this.logo = new PerspectiveCard(this, {
            x: 512,
            y: 384,
            back: {
                key: "card_001",
            },
            front: {
                key: "card_001",
            },
        });

        this.logo.angleX = -20;
        this.logo.angleY = 0;
        this.logo.angleZ = 0;

        this.title = this.add
            .text(0, 0, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }

    moveLogo(vueCallback: ({ x, y }: { x: number; y: number }) => void) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback) {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

