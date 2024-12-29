///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FishSpawner extends CustomComponentUpdatedScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FishSpawner);

        public elapseSeconds: number = 0;

        public fishPrefabId: string = "";
        public pufferFishPrefabId: string = "";
        public maxPufferFishChance: number = 0;

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
        }


        // Update function 
        public override update = (_event: Event): void => {

        }


        private spawn = async (_event?: ƒ.EventTimer): Promise<void> => {

            if (this.amountFishInRange > this.maxFishAmount) {
                return;
            }

            let randomVector: ƒ.Vector3 = getRandomVector();
            let minDirectionVector: ƒ.Vector3 = ƒ.Vector3.SCALE(randomVector, this.minSpawnRadius);
            let newFishTranslation: ƒ.Vector3 = ƒ.Vector3.SUM(PawnController.instance.node.mtxWorld.translation, ƒ.Vector3.SCALE(randomVector, this.maxSpawnRadius - this.minSpawnRadius), minDirectionVector);

            // newFishTranslation = new ƒ.Vector3(-810, -200, -890);

            let rayHitInfo: ƒ.RayHitInfo = ƒ.Physics.raycast(newFishTranslation, ƒ.Vector3.Y().scale(1), 2000);

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

            let newFish: ƒ.GraphInstance;

            let currentPufferfishChance: number = (PawnController.instance.node.mtxWorld.translation.y / -885) * this.maxPufferFishChance;

            try {
                if (Math.random() < currentPufferfishChance) {

                    newFish = await ƒ.Project.createGraphInstance(<ƒ.Graph>ƒ.Project.resources[this.pufferFishPrefabId]);
                } else {

                    newFish = await ƒ.Project.createGraphInstance(<ƒ.Graph>ƒ.Project.resources[this.fishPrefabId]);
                }
            } catch (error) {
                console.warn(error);
                return;
            }

            newFish.mtxLocal.translation = _translation;
            newFish.mtxLocal.rotation = getRandomVector().scale(108);

            this.node.addChild(newFish);
        }
    }
}