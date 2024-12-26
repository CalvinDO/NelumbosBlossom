///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PawnRotationalController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnRotationalController);
        public static instance: PawnRotationalController;

        constructor() {
            super();

            this.singleton = true;
            PawnRotationalController.instance = this;
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {
            this.node.mtxLocal.lookAt(PawnController.instance.rb.getVelocity(), ƒ.Vector3.Y());
        }

    }
}