///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishSpawner extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishSpawner);

        public elapseSeconds: number = 0;

        public fishPrefabId: string = "";
        public pufferFishPrefabId: string = "";
        private octopusId: string = "Graph|2024-12-31T12:41:56.762Z|96905";

        public maxPufferFishChance: number = 0;
        public maxOctopusChance: number = 0.15;
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

                    if (distance > (this.maxSpawnRadius)) {

                        let pufferFish: PufferFishController = fish.getComponent(PufferFishController);

                        if (!pufferFish || !pufferFish.isImmobilized) {
                            this.node.removeChild(fish);
                            root.removeChild(fish);
                            //fish = undefined;
                            ƒ.Recycler.store(fish);
                        }

                    }
                }
            });

            //console.log(amount);

            return amount;
        }

        constructor() {
            super();

            this.singleton = true;
            FishSpawner.instance = this;
        }


        public override start(): void {

            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.elapseSeconds * 1000, 0, this.spawn);
        }


        // Update function 
        public override update = (_event: Event): void => {

        }


        private spawn = async (_event?: ƒ.EventTimer): Promise<void> => {


            if (this.amountFishInRange > this.maxFishAmount) {
                return;
            }

            let randomVector: ƒ.Vector3 = getRandomVector();

            console.log(PawnController.instance.node.mtxWorld.translation);

            let pawnDepthFactor: number = (PawnController.instance.node.mtxWorld.translation.y / -885);
            pawnDepthFactor = 1 / pawnDepthFactor;
            pawnDepthFactor + 0.5;
            pawnDepthFactor = pawnDepthFactor > 1 ? 1 : pawnDepthFactor;

            let depthScaledMinSpawnRadius: number = this.minSpawnRadius * pawnDepthFactor;
            let depthScaledMaxSpawnRadius: number = this.maxSpawnRadius * pawnDepthFactor;

            console.log(depthScaledMinSpawnRadius);
            let minDirectionVector: ƒ.Vector3 = ƒ.Vector3.SCALE(randomVector, depthScaledMinSpawnRadius);

            let newFishTranslation: ƒ.Vector3 = ƒ.Vector3.SUM(PawnController.instance.node.mtxWorld.translation, ƒ.Vector3.SCALE(randomVector, depthScaledMaxSpawnRadius - depthScaledMinSpawnRadius), minDirectionVector);

            // newFishTranslation = new ƒ.Vector3(-810, -200, -890);
            let rayHitInfo: ƒ.RayHitInfo = ƒ.Physics.raycast(newFishTranslation, ƒ.Vector3.Y(), 200000);

            if (rayHitInfo.hit == false) {
                return;
            }

            //return when ray doesn't hit surface, therefore origin is under floor collider
            if (!rayHitInfo.rigidbodyComponent.node.getComponent(SurfaceCollider)) {
                return;
            }

            if (rayHitInfo.hitDistance < 2) {
                return;
            }

            if (newFishTranslation.y > -1) {
                return;
            }

            await this.spawnFish(newFishTranslation);
        }

        public async spawnFish(_translation: ƒ.Vector3): Promise<void> {

            console.log("call spawnFish");

            let newFish: ƒ.GraphInstance;

            let depthFactor: number = (_translation.y / -885);
            let currentPufferfishChance: number = depthFactor * this.maxPufferFishChance;

            try {

                let ran: number = Math.random();
                let ran2: number = Math.random();

                //console.log(currentPufferfishChance.toFixed(4), ran, ran2);

                if (ran < currentPufferfishChance) {
                    //console.log("spawnPufferfish");
                    newFish = await ƒ.Project.createGraphInstance(<ƒ.Graph>ƒ.Project.resources[this.pufferFishPrefabId]);
                } else {

                    if (ran2 < this.maxOctopusChance) {

                        newFish = await ƒ.Project.createGraphInstance(<ƒ.Graph>ƒ.Project.resources[this.octopusId]);
                        //console.log("spawnOctopus");
                    } else {

                        newFish = await ƒ.Project.createGraphInstance(<ƒ.Graph>ƒ.Project.resources[this.fishPrefabId]);
                        //console.log("spawnFish");
                    }
                }
            } catch (error) {
                console.warn(error);
                return;
            }

            newFish.mtxLocal.translation = _translation;
            //newFish.mtxLocal.rotation = getRandomVector().scale(108);

            this.node.addChild(newFish);
        }
    }
}