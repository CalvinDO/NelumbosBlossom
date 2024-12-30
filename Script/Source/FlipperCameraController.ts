///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FlipperCameraController extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FlipperCameraController);
        public static instance: FlipperCameraController;

        private viewport: ƒ.Viewport;

        constructor() {
            super();

            this.singleton = true;
            FlipperCameraController.instance = this;
        }
        /*
                public override start(): void {
        
                    this.viewport = new ƒ.Viewport();
                    this.viewport.initialize("SuckViewport", root, this.node.getComponent(ƒ.ComponentCamera), document.querySelector("#suck-cam"));
                }
        
                // Update function 
                public override update = (_event: Event): void => {
                    this.viewport.draw();
                }
        */
    }
}