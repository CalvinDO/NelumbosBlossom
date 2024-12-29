///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FloorColliderController extends CustomComponentUpdatedScript {
        
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FloorColliderController);
        public static instance: FloorColliderController;

        constructor() {
            super();

            this.singleton = true;
            FloorColliderController.instance = this;
        }


        public override start(): void {

            this.node.getChildren().forEach(child => {

                if (!child.getComponent(ƒ.ComponentRigidbody)) {

                    let rb: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody();
                    rb.typeBody = ƒ.BODY_TYPE.STATIC;

                    child.addComponent(rb);

                    child.removeComponent(child.getComponent(ƒ.ComponentMaterial));
                    child.removeComponent(child.getComponent(ƒ.ComponentMesh));

                }
            });
        }

        // Update function 
        public override update = (_event: Event): void => {
        }
    }
}