///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PawnCameraRotatorController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnCameraRotatorController);
        public static instance: PawnCameraRotatorController;

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

            PawnCameraRotatorController.instance.node.mtxLocal.rotateY(-_event.movementX * PawnController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal);

            //PawnController.instance.rb.applyTorque(ƒ.Vector3.Y(-_event.movementX * PawnController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal));

            /*
                  let XIncrement: number = _event.movementY * Main.rotationSpeed;
                  let currentX: number = Main.cmpCamera.mtxPivot.rotation.x;
                  let nextFrameX: number = XIncrement + currentX;
            
                  if (nextFrameX > Main.maxXRotation) {
                      XIncrement = Main.maxXRotation - currentX;
                  }
            
                  if (nextFrameX < -Main.maxXRotation) {
                      XIncrement = -Main.maxXRotation - currentX;
                  }
            
                  Main.cmpCamera.mtxPivot.rotateX(XIncrement);
                  */
        }



    }
}
