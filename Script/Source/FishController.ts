///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishController extends CustomComponentUpdatedScript {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishController);

        public diceTargetElapseSeconds: number = 0;
        public acceleration: number = 0;

        public rb: ƒ.ComponentRigidbody;
        //private currentTargetPos: ƒ.Vector3;

        public currentDirection: ƒ.Vector3 = getRandomVector();


        constructor() {
            super();
        }


        public override start(): void {

            this.rb = this.node.getComponent(ƒ.ComponentRigidbody);

            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.diceTargetElapseSeconds * 1000, 0, this.diceNewTarget);
            this.currentDirection = getRandomVector();
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (!this.rb) {
                this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
            }

            //this.preventSurfacePenetration();

            this.move();

            this.checkCollisions();

            this.lookAtSpeed();
        }

        private lookAtSpeed(): void {

            if (this.rb.getVelocity().magnitude > 0.001) {
                this.node.getChild(0).mtxLocal.lookAt(this.rb.getVelocity()), ƒ.Vector3.Y();
            }
        }

        private checkCollisions() {

            if (ƒ.Physics.raycast(this.rb.getPosition(), this.rb.getVelocity(), 2).hit) {
                this.onCourseOfCollision();
            }
        }

        public onCourseOfCollision() {
            this.dodge();
        }


        public move(): void {

            if (this.rb) {

                this.rb.applyForce(ƒ.Vector3.SCALE(this.currentDirection, this.acceleration * ƒ.Loop.timeFrameReal * 0.001));
            }

            //this.node.mtxLocal.translate(ƒ.Vector3.SCALE(ƒ.Vector3.SUM(this.rb.getPosition(), this.currentDirection), this.acceleration * ƒ.Loop.timeFrameReal * 0.001));
        }

        public diceNewTarget = async (_event?: ƒ.EventTimer): Promise<void> => {

            if ((Math.random()) > 0.5) {
                this.calculateNewDirection();
            }
        }

        private calculateNewDirection(): void {

            this.currentDirection = getRandomVector();
            this.currentDirection.normalize();
        }

        private dodge(): void {
            this.calculateNewDirection();
            //this.currentDirection = ƒ.Vector3.SCALE(this.currentDirection, -1);
        }
    }
}