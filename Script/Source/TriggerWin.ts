///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class TriggerWin extends CustomComponentUpdatedScript {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(TriggerWin);

        private rb: ƒ.ComponentRigidbody;

        constructor() {
            super();
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (!this.rb) {
                this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                this.rb.collisionMask = 108;
            }

            console.log(this.rb.getPosition());
            console.log(this.node.mtxWorld.translation);

        }
    }
}