///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class WinTrigger extends CustomComponentUpdatedScript {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(WinTrigger);
        public static instance: WinTrigger;

        public gameWon: boolean;

        private pawnGoal: ƒ.Node;
        private flipperGoal: ƒ.Node;

        constructor() {
            super();

            this.singleton = true;
            WinTrigger.instance = this;
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (this.gameWon) {
                this.riseUp();
                return;
            }

            let y: number = this.node.mtxWorld.translation.y

            if (PawnController.instance.node.mtxWorld.translation.y < y && FlipperController.instance.node.mtxWorld.translation.y < y) {
                this.winGame();
            }
        }

        private riseUp(): void {

            this.node.mtxLocal.translateY(20 * ƒ.Loop.timeFrameReal * 0.001);
            this.node.mtxLocal.rotateY(90 * ƒ.Loop.timeFrameReal * 0.001);

            SurfaceCollider.instance.node.activate(false);

            try {


                PawnController.instance.accelerateTowards(PawnController.instance.node.mtxWorld.getTranslationTo(this.pawnGoal.mtxWorld).normalize().scale(100 * ƒ.Loop.timeFrameReal * 0.001));
                FlipperController.instance.accelerateTowards(FlipperController.instance.node.mtxWorld.getTranslationTo(this.flipperGoal.mtxWorld).normalize().scale(100 * ƒ.Loop.timeFrameReal * 0.001));

            } catch (error) {
                console.warn(error);
            }
        }


        private winGame(): void {

            this.gameWon = true;
            console.log("game wonm");

            this.pawnGoal = this.node.getChild(0);
            this.flipperGoal = this.node.getChild(1);

            this.pawnGoal.mtxLocal.translation =  PawnController.instance.node.mtxWorld.translation;
            this.flipperGoal.mtxLocal.translation = new ƒ.Vector3(-this.pawnGoal.mtxLocal.translation.x, this.pawnGoal.mtxLocal.translation.y, -this.pawnGoal.mtxLocal.translation.z);

            this.node.mtxLocal.translateY(20);
            /*
            ƒ.Loop.stop();
            window.alert("game Won");
            console.log("game won");
            */
        }
    }
}