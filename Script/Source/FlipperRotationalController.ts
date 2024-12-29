
///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FlipperRotationalController extends CustomComponentUpdatedScript {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FlipperRotationalController);
        public static instance: FlipperRotationalController;

        constructor() {
            super();

            this.singleton = true;
            FlipperRotationalController.instance = this;
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (FlipperController.instance.rb) {

                if (FlipperController.instance.rb.getVelocity().magnitude > 0) {
                    this.node.mtxLocal.lookAt(FlipperController.instance.rb.getVelocity(), ƒ.Vector3.Y());
                }
            }
        }

    }
}
