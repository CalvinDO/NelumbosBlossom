///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class AnimatorTest extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(AnimatorTest);

        constructor() {
            super();
        }


        public override update = (_event: Event): void => {

            console.log(this.node.getComponent(ƒ.ComponentAnimator).time);
            console.log(this.node.mtxWorld.translation);
        }

    }
}