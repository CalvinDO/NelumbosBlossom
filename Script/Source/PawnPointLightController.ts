///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PawnPointLightController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnPointLightController);
        public static instance: PawnPointLightController;

        constructor() {
            super();

            this.singleton = true;
            PawnPointLightController.instance = this;
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {

            this.node.mtxLocal.translation = new ƒ.Vector3(PawnController.instance.node.mtxWorld.translation.x, -0.5, PawnController.instance.node.mtxWorld.translation.z);
        }
    }
}