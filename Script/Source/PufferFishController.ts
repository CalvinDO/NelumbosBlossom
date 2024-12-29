///<reference path = "FishController.ts"/>
namespace Script {

    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PufferFishController extends FishController {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PufferFishController);

        constructor() {
            super();
        }


        public override onCollision(): void {

            if (this.rb.collisions.find(collidingRb => collidingRb.node.getComponent(FlipperController))) {
                
            }
            
            super.onCollision();
        }
    }
}