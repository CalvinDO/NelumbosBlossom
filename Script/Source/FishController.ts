///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishController);

        constructor() {
            super();
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {
            this.node.mtxLocal.translateZ(0.1 * ƒ.Loop.timeFrameReal * 0.001);
        }

    }
}