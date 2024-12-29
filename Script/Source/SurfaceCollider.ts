///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class SurfaceCollider extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(SurfaceCollider);
        public static instance: SurfaceCollider;

        constructor() {
            super();

            this.singleton = true;
            SurfaceCollider.instance = this;
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {
        }
    }
}