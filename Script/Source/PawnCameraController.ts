///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PawnCameraController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnCameraController);
        public static instance: PawnCameraController;

        constructor() {
            super();

            this.singleton = true;
            PawnCameraController.instance = this;
        }

        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {
        }
    }
}