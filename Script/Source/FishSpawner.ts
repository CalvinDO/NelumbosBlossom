///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishSpawner extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishSpawner);

        public elapse: number = 0;


        constructor() {
            super();
        }


        public override start(): void {
            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.elapse, 0, this.spawn);
            //timer.active = true;
        }

        // Update function 
        public override update = (_event: Event): void => {

        }


        public spawn = (_event: ƒ.EventTimer): void => {
            console.log("spawn");
        }

    }
}