///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishSpawner extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishSpawner);

        public elapseSeconds: number = 0;
        public fishPrefabId: string = "";
        public minSpawnRadius: number = 0;
        public maxSpawnRadius: number = 0;
        public maxFishAmount: number = 0;

        public static instance: FishSpawner;

        private get amountFishInRange(): number {
            let amount: number = 0;

            this.node.getChildren().forEach(fish => {
                let distance: number = PawnController.instance.node.mtxWorld.translation.getDistance(fish.mtxWorld.translation);
                if (distance < this.maxSpawnRadius) {
                    amount++;
                } else {
                    if (distance > (this.maxSpawnRadius + this.minSpawnRadius)) {
                        this.node.removeChild(fish);
                        root.removeChild(fish);
                        fish = undefined;
                    }
                }
            });

            return amount;
        }

        constructor() {
            super();

            this.singleton = true;
            FishSpawner.instance = this;
        }


        public override start(): void {

            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.elapseSeconds * 1000, 0, this.spawn);

            /*
                        for (let i: number = 0; i < this.maxFishAmount; i++) {
                            try {
                                this.spawn();
                            } catch (error) {
                                console.warn(error);
                            }
                        }
             */
        }


        // Update function 
        public override update = (_event: Event): void => {

        }


        private spawn = async (_event?: ƒ.EventTimer): Promise<void> => {

            if (this.amountFishInRange > this.maxFishAmount) {
                return;
            }

            let newFish: ƒ.GraphInstance;

            try {
                newFish = await ƒ.Project.createGraphInstance(<ƒ.Graph>ƒ.Project.resources[this.fishPrefabId]);
            } catch (error) {
                console.warn(error);
                return;
            }

            let randomVector: ƒ.Vector3 = getRandomVector();
            let minDirectionVector: ƒ.Vector3 = ƒ.Vector3.SCALE(randomVector, this.minSpawnRadius);

            newFish.mtxLocal.translation = ƒ.Vector3.SUM(PawnController.instance.node.mtxWorld.translation, ƒ.Vector3.SCALE(randomVector, this.maxSpawnRadius - this.minSpawnRadius), minDirectionVector);

            if (newFish.mtxLocal.translation.y > -1) {
                return;
            }

            //let ray: ƒ.Ray = new ƒ.Ray(ƒ.Vector3.Y().scale(-1), newFish.mtxLocal.translation, 1000);
            

            newFish.mtxLocal.rotation = getRandomVector().scale(108);


            this.node.addChild(newFish);
        }
    }
}