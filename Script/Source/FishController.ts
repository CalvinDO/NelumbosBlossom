///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishController);

        public diceTargetElapseSeconds: number = 0;
        public maxTargetDistance: number = 0;
        public speed: number = 0;

        //private currentTargetPos: ƒ.Vector3;

        constructor() {
            super();
        }


        public override start(): void {

            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.diceTargetElapseSeconds * 1000, 0, this.diceNewTarget);
        }

        // Update function 
        public override update = (_event: Event): void => {

            this.preventSurfacePenetration();

            this.move();
        }


        private preventSurfacePenetration() {
            if (this.node.mtxWorld.translation.y > -1) {
                this.node.mtxLocal.lookAt(ƒ.Vector3.Y(-1));
            }
        }

        public move(): void {
            this.node.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameReal * 0.001, true);
        }

        public diceNewTarget = async (_event?: ƒ.EventTimer): Promise<void> => {

            if ((Math.random()) > 0.5) {

                this.calculateNewTarget();
            }
        }

        private calculateNewTarget() {

            let currentDirection: ƒ.Vector3 = ƒ.Vector3.SUM(this.node.mtxLocal.translation, getRandomVector());
            this.node.mtxLocal.lookAt(currentDirection);
        }

    }
}