///<reference path = "FishController.ts"/>
namespace Script {

    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PufferFishController extends FishController {


        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PufferFishController);

        public isImmobilized: boolean;

        constructor() {
            super();
        }



        public override move(): void {

            if (this.isImmobilized) {
                return;
            }

            super.move();
        }

        public immobilize(): void {

            this.isImmobilized = true;
            //this.node.mtxLocal.lookAt(this.node.mtxLocal.getTranslationTo(FlipperController.instance.node.mtxLocal));

            this.rb.activate(false);
            this.node.removeComponent(this.rb);

            this.node.getChild(0).getChild(0).getChild(0).getComponent(ƒ.ComponentAnimator).playmode = ƒ.ANIMATION_PLAYMODE.STOP;
        }
    }
}