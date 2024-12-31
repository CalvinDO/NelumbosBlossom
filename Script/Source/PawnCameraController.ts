///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class PawnCameraController extends CustomComponentUpdatedScript {

        public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnCameraController);
        public static instance: PawnCameraController;

        private camera: ƒ.ComponentCamera;


        constructor() {
            super();

            this.singleton = true;
            PawnCameraController.instance = this;
        }

        public override start(): void {
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (!this.camera) {
                this.node.getComponent(ƒ.ComponentCamera);
            }

            //Sound
            ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));
            ƒ.AudioManager.default.listenTo(root);

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //root.getComponent(ƒ.ComponentAudio).play(true);
            }
            this.setFOVToPawnSpeed();
        }

        private setFOVToPawnSpeed(): void {
            //not possible Atm
        }
    }
}