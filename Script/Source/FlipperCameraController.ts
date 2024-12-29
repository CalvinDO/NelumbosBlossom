///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FlipperCameraController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FlipperCameraController);
        public static instance: FlipperCameraController;

        constructor() {
            super();

            this.singleton = true;
            FlipperCameraController.instance = this;
        }

        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {
        }
    }
}