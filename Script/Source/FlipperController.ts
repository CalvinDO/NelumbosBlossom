
///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class FlipperController extends CustomComponentUpdatedScript {


        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FlipperController);
        public static instance: FlipperController;

        public acceleration: number = 0;

        public rb: ƒ.ComponentRigidbody;

        public satietyGainPerFish: number = 0;
        public hungerPerSecond: number = 0;

        public satiety: number = 0.5;

        public dead: boolean = false;

        public satietyBar: HTMLProgressElement;

        public targetSearchIntervalSeconds: number = 0;
        public targetDetectionRadius: number = 0;

        private currentTarget: ƒ.Node;



        constructor() {
            super();

            this.singleton = true;
            FlipperController.instance = this;
        }

        public override start(): void {

            this.satietyBar = <HTMLProgressElement>document.querySelector("#flipper-satiety-bar");

            let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), this.targetSearchIntervalSeconds * 1000, 0, this.searchTarget);
        }

        // Update function 
        public override update = (_event: Event): void => {

            if (this.dead) {
                return;
            }

            if (!this.rb) {
                this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
            }

            this.checkCollisions();

            this.hunger();
            this.updateBar();

            this.followTarget();
        }

        private followTarget(): void {

            if (!this.currentTarget) {
                return;
            }

            this.accelerateTowards(this.node.mtxWorld.getTranslationTo(this.currentTarget.mtxWorld));
        }

        private searchTarget = (_event?: ƒ.EventTimer): void => {

            let sortedArray: ƒ.Node[] = FishSpawner.instance.node.getChildren().sort((fish1, fish2) => {

                let distance1: number = this.node.mtxWorld.translation.getDistance(fish1.mtxWorld.translation);
                let distance2: number = this.node.mtxWorld.translation.getDistance(fish2.mtxWorld.translation);


                if (distance1 > distance2) {
                    return 1;
                }

                if (distance1 < distance2) {
                    return -1;
                }

                return 0;
            });

            for (let sortedArrayIndex: number = 0; sortedArrayIndex < sortedArray.length; sortedArrayIndex++) {

                let possibleTarget: ƒ.Node = sortedArray[sortedArrayIndex];

                if (ƒ.Physics.raycast(this.node.mtxWorld.translation, this.node.mtxWorld.getTranslationTo(possibleTarget.mtxWorld), 1000).rigidbodyComponent.node == possibleTarget) {
                    console.log("ray node " + ƒ.Physics.raycast(this.node.mtxWorld.translation, this.node.mtxWorld.getTranslationTo(possibleTarget.mtxWorld), 1000).rigidbodyComponent.node);
                    this.currentTarget = possibleTarget;
                    return;
                }
            }
        }

        private accelerateTowards(_direction: ƒ.Vector3) {
            _direction.normalize();
            let acceleration: ƒ.Vector3 = _direction.clone.scale(this.acceleration * deltaTime);
            this.rb.applyForce(acceleration);
        }


        private updateBar(): void {
            this.satietyBar.value = this.satiety;
        }


        private hunger(): void {

            this.satiety -= this.hungerPerSecond * ƒ.Loop.timeFrameReal * 0.001;

            if (this.satiety <= 0) {
                this.die();
            }
        }

        private die(): void {

            this.node.getParent().removeChild(this.node);
            this.dead = true;
        }

        private checkCollisions(): void {

            for (let colIndex: number = 0; colIndex < this.rb.collisions.length; colIndex++) {

                if (this.rb.collisions[colIndex].node.getComponent(PufferFishController)) {
                    this.suckFish(this.rb.collisions[colIndex].node.getComponent(PufferFishController));
                    return;
                }

                if (this.rb.collisions[colIndex].node.getComponent(FishController)) {
                    this.eatFish(this.rb.collisions[colIndex].node.getComponent(FishController));
                    return;
                }
            }
        }
        private suckFish(_pufferFish: PufferFishController) {
            throw new Error("Method not implemented.");
        }

        private eatFish(_fish: FishController): void {

            this.satiety += this.satietyGainPerFish;
            this.satiety = this.satiety > 1 ? 1 : this.satiety;

            FishSpawner.instance.node.removeChild(_fish.node);
            _fish = undefined;
        }
    }
}