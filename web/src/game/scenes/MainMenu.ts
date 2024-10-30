import { GameObjects, Scene } from "phaser";
import { PerspectiveCard } from "phaser3-rex-plugins/plugins/perspectiveimage.js";
import { Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { EventBus } from "../EventBus";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    rexUI: RexUIPlugin; 
    logo: PerspectiveCard;
    logo2: PerspectiveCard;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "background");

        const sizer = this.rexUI.add.sizer({
            x: 400, y:300, orientation: 'x',
            height: 100,
            width: 200
        })

        this.logo = new PerspectiveCard(this, {
            x: 512,
            y: 384,
            back: {
                key: "card_back",
            },
            front: {
                key: "card_001",
            },
        });

        console.log(this.logo)
        this.logo.setScale(0.7)

        sizer.add(this.logo).layout()

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
        this.logo.flip?.flip();
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
                scale: {value: 1, duration: 1500, ease: "Sine.easeOut" },
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

