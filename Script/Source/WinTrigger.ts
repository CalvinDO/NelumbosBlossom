///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class WinTrigger extends CustomComponentUpdatedScript {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(WinTrigger);
        public static instance: WinTrigger;

        constructor() {
            super();

            this.singleton = true;
            WinTrigger.instance = this;
        }


        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {

            let y: number = this.node.mtxWorld.translation.y

            if (PawnController.instance.node.mtxWorld.translation.y < y && FlipperController.instance.node.mtxWorld.translation.y < y) {
                this.winGame();
            }
        }

        private winGame(): void {
            window.alert("game Won");
            console.log("game won");

            ƒ.Loop.stop();
        }
    }
}