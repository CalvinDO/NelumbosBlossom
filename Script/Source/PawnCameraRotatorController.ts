///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PawnCameraRotatorController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnCameraRotatorController);
        public static instance: PawnCameraRotatorController;
        private mouseTorqueFactor: number = 0;
        private maxXRotation: number = 0;

        constructor() {
            super();

            this.singleton = true;
            PawnCameraRotatorController.instance = this;
        }

        public override start(): void {
            window.addEventListener("mousemove", this.onMouseMove);
        }

        // Update function 
        public override update = (_event: Event): void => {
        }


        public onMouseMove(_event: MouseEvent) {

            let yRotation: number = PawnCameraRotatorController.instance.node.mtxWorld.rotation.y + -_event.movementX * PawnCameraRotatorController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal;
            //PawnCameraRotatorController.instance.node.mtxLocal.rotateY(-_event.movementX * PawnCameraRotatorController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal);

            //PawnController.instance.rb.applyTorque(ƒ.Vector3.Y(-_event.movementX * PawnController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal));


            let xIncrement: number = _event.movementY * PawnController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal;
            let currentX: number = PawnCameraRotatorController.instance.node.mtxWorld.rotation.x;
            let nextFrameX: number = xIncrement + currentX;

            if (nextFrameX > PawnCameraRotatorController.instance.maxXRotation) {
                xIncrement = PawnCameraRotatorController.instance.maxXRotation - currentX;
            }

            if (nextFrameX < -PawnCameraRotatorController.instance.maxXRotation) {
                xIncrement = -PawnCameraRotatorController.instance.maxXRotation - currentX;
            }

            //PawnCameraRotatorController.instance.node.mtxLocal.rotateZ(XIncrement);
            let xRotation: number = PawnCameraRotatorController.instance.node.mtxWorld.rotation.x + xIncrement;
            console.log(xRotation, yRotation);
            PawnCameraRotatorController.instance.node.mtxLocal.rotation = new ƒ.Vector3(xRotation, yRotation, 0);

            //PawnCameraRotatorController.instance.node.mtxLocal.rotation.z = 0;
        }
    }
}
