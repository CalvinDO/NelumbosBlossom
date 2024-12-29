///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishController);

        public diceTargetElapseSeconds: number = 0;
        public speed: number = 0;

        public rb: ƒ.ComponentRigidbody;
        //private currentTargetPos: ƒ.Vector3;

        public currentDirection: ƒ.Vector3 = getRandomVector();


        constructor() {
            super();
        }


        public override start(): void {

            this.rb = this.node.getComponent(ƒ.ComponentRigidbody);

            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.diceTargetElapseSeconds * 1000, 0, this.diceNewTarget);
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (!this.rb) {
                this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
            }

            //this.preventSurfacePenetration();

            this.move();

            this.checkCollisions();
        }

        private checkCollisions() {

            if (this.rb.collisions.length > 0) {
                this.onCollision();
            }
        }

        public onCollision() {
            this.calculateNewTarget();
        }

        private preventSurfacePenetration() {
            if (this.node.mtxWorld.translation.y > -1) {
                this.node.mtxLocal.lookAt(ƒ.Vector3.Y(-1));
            }
        }

        public move(): void {
            if (this.rb)
                this.rb.applyForce(ƒ.Vector3.SCALE(this.currentDirection, this.speed * ƒ.Loop.timeFrameReal * 0.001));

            //this.node.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameReal * 0.001, true);
        }

        public diceNewTarget = async (_event?: ƒ.EventTimer): Promise<void> => {

            if ((Math.random()) > 0.5) {

                this.calculateNewTarget();
            }
        }

        private calculateNewTarget() {

            this.currentDirection = ƒ.Vector3.SUM(this.node.mtxLocal.translation, getRandomVector());
            this.currentDirection.normalize();

            this.node.getChild(0).mtxLocal.lookAt(this.currentDirection);
        }
    }
}