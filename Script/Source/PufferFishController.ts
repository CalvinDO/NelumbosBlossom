///<reference path = "FishController.ts"/>
namespace Script {

    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PufferFishController extends FishController {


        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PufferFishController);

        private isImmobilized: boolean;

        constructor() {
            super();
        }

        /*
                public override onCollision(): void {
        
                    if (this.rb.collisions.find(collidingRb => collidingRb.node.getComponent(FlipperController))) {
        
                    }
        
                    super.onCollision();
                }
        */

        public override move(): void {
            if (this.isImmobilized) {
                return;
            }
        }

        public immobilize(): void {

            this.isImmobilized = true;
            //this.node.mtxLocal.lookAt(this.node.mtxLocal.getTranslationTo(FlipperController.instance.node.mtxLocal));

            this.rb.activate(false);
            this.node.removeComponent(this.rb);

            this.node.getChild(0).getChild(0).getComponent(ƒ.ComponentAnimator).playmode = ƒ.ANIMATION_PLAYMODE.STOP;
        }
    }
}