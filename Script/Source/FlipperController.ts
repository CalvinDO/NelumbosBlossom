
///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export enum FlipperState {
        IS_FOLLOWING_PAWN = 0,
        IS_HUNTING = 1,
        IS_SUCKING = 2,
        IS_CALLED = 3
    }

    export class FlipperController extends CustomComponentUpdatedScript {


        public static readonly iSubclass: number = ƒ.Component.registerSubclass(FlipperController);
        public static instance: FlipperController;

        public acceleration: number = 0;

        public rb: ƒ.ComponentRigidbody;

        public satietyGainPerFish: number = 0;
        public hungerPerSecond: number = 0;
        public suckingHungerFactor: number = 0;

        public satiety: number = 0.5;

        public satietyForHunting: number = 0.5;
        public satietyForFollowingPawn: number = 0.8;

        public dead: boolean = false;

        public satietyBar: HTMLProgressElement;

        public targetSearchIntervalSeconds: number = 0;

        public minPawnFollowDistance: number = 0;

        public arriveDistance: number = 5;

        private currentTarget: ƒ.Node;

        private suckedFish: PufferFishController;


        private mouthPosNode: ƒ.Node;
        private state: FlipperState = FlipperState.IS_FOLLOWING_PAWN;


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

            if (WinTrigger.instance.gameWon) {
                return;
            }

            if (this.dead) {
                return;
            }

            if (!this.rb) {
                this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
            }

            if (!this.mouthPosNode) {
                this.mouthPosNode = this.node.getChildrenByName("FlipperRotational")[0].getChildrenByName("MouthPos")[0];
            }


            this.hunger();
            this.updateBar();
            this.checkDeath();
            this.followTarget();

            this.setSuckingAudioPivot();

            this.checkCollisions();
        }

        private setSuckingAudioPivot(): void {

            try {
                root.getComponents(ƒ.ComponentAudio)[4].mtxPivot.translation = PawnCameraController.instance.node.mtxWorld.getTranslationTo(this.node.mtxWorld).normalize();

            } catch (error) {
                console.warn();
            }
        }

        public recieveCall(): void {

            this.disturbSucking();

            this.state = FlipperState.IS_CALLED;
        }

        private checkDeath(): void {

            if (this.satiety <= 0) {
                this.die();
            }
        }

        private followTarget(): void {

            if (!this.currentTarget) {
                return;
            }

            switch (this.state) {

                case FlipperState.IS_SUCKING:
                    return;
                case FlipperState.IS_CALLED:
                    if (this.node.mtxWorld.translation.getDistance(this.currentTarget.mtxWorld.translation) < this.arriveDistance) {
                        this.arriveAtPawn();
                    }
                case FlipperState.IS_FOLLOWING_PAWN:
                    if (this.node.mtxWorld.translation.getDistance(this.currentTarget.mtxWorld.translation) < this.minPawnFollowDistance) {
                        break;
                    }
                default:
                    this.accelerateTowardsNormalized(this.node.mtxWorld.getTranslationTo(this.currentTarget.mtxWorld));
                    break;
            }
        }
        private arriveAtPawn(): void {

            this.state = FlipperState.IS_FOLLOWING_PAWN;

            root.getComponents(ƒ.ComponentAudio)[3].mtxPivot.translation = PawnCameraController.instance.node.mtxWorld.getTranslationTo(this.node.mtxWorld);
            root.getComponents(ƒ.ComponentAudio)[3].play(true);
        }

        private searchTarget = (_event?: ƒ.EventTimer): void => {

            switch (this.state) {
                case FlipperState.IS_SUCKING:
                    return;
                case FlipperState.IS_CALLED:
                case FlipperState.IS_FOLLOWING_PAWN:
                    this.currentTarget = PawnController.instance.node;
                    break;
                case FlipperState.IS_HUNTING:
                    this.searchHuntTarget();
                    break;
            }
        }

        private searchHuntTarget(): void {

            //todo: study how filter works
            //let arrayWithoutOctopus: ƒ.Node[] = FishSpawner.instance.node.getChildren().filter(fish => { fish.getComponent(FishController) != undefined || fish.getComponent(PufferFishController) != undefined });


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

                if (possibleTarget.getComponent(FishController) || possibleTarget.getComponent(PufferFishController)) {

                    if (ƒ.Physics.raycast(this.node.mtxWorld.translation, this.node.mtxWorld.getTranslationTo(possibleTarget.mtxWorld), 3000).rigidbodyComponent.node == possibleTarget) {
                        this.currentTarget = possibleTarget;
                        return;
                    }
                }
            }
        }

        public accelerateTowardsNormalized(_direction: ƒ.Vector3) {
            _direction.normalize();
            let acceleration: ƒ.Vector3 = _direction.clone.scale(this.acceleration * ƒ.Loop.timeFrameReal * 0.001 * (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G]) ? 10 : 1));
            this.rb.applyForce(acceleration);
        }

        public accelerateTowards(_direction: ƒ.Vector3) {
            let acceleration: ƒ.Vector3 = _direction.clone.scale(ƒ.Loop.timeFrameReal * 0.001);
            this.rb.applyForce(acceleration);
        }



        private updateBar(): void {
            this.satietyBar.value = this.satiety;

            if (this.state == FlipperState.IS_SUCKING) {
                this.satietyBar.style.setProperty('--progress-bar-color', 'red');
            } else {
                this.satietyBar.style.setProperty('--progress-bar-color', 'orange');
            }
        }


        private hunger(): void {

            if (this.state == FlipperState.IS_SUCKING) {

                this.satiety -= this.hungerPerSecond * this.suckingHungerFactor * ƒ.Loop.timeFrameReal * 0.001;

                return;
            }

            this.satiety -= this.hungerPerSecond * ƒ.Loop.timeFrameReal * 0.001;

            if (this.state == FlipperState.IS_CALLED) {
                return;
            }

            if (this.satiety <= this.satietyForHunting) {

                if (this.state == FlipperState.IS_FOLLOWING_PAWN) {
                    this.currentTarget = undefined;
                }

                this.state = FlipperState.IS_HUNTING;

            } else if (this.satiety > this.satietyForFollowingPawn) {

                this.state = FlipperState.IS_FOLLOWING_PAWN;
            }
        }

        private die(): void {

            this.node.getParent().removeChild(this.node);
            this.dead = true;

            //ƒ.Loop.stop();
            window.alert("Flipper died");
        }

        private checkCollisions(): void {

            for (let colIndex: number = 0; colIndex < this.rb.collisions.length; colIndex++) {

                if (this.rb.collisions[colIndex].node.getComponent(PawnController)) {
                    this.disturbSucking();
                }

                if (this.rb.collisions[colIndex].node.getComponent(PufferFishController)) {
                    this.startSuckingFish(this.rb.collisions[colIndex].node.getComponent(PufferFishController));
                    return;
                }

                if (this.rb.collisions[colIndex].node.getComponent(FishController)) {
                    this.eatFish(this.rb.collisions[colIndex].node.getComponent(FishController));
                    return;
                }
            }
        }

        private disturbSucking(): void {

            if (this.state != FlipperState.IS_SUCKING) {
                return;
            }

            this.state = FlipperState.IS_FOLLOWING_PAWN;

            root.getComponents(ƒ.ComponentAudio)[4].play(false);
            root.getComponents(ƒ.ComponentAudio)[4].loop = false;

            try {
                this.mouthPosNode.removeChild(this.suckedFish.node);
                FishSpawner.instance.node.removeChild(this.suckedFish.node);
                root.removeChild(this.suckedFish.node);

                ƒ.Recycler.store(this.suckedFish.node);
                this.suckedFish = undefined;

            } catch (error) {
                console.warn(error);
            }

        }

        private startSuckingFish(_pufferFish: PufferFishController) {

            _pufferFish.immobilize();

            this.suckedFish = _pufferFish;

            this.state = FlipperState.IS_SUCKING;

            this.currentTarget = undefined;

            this.mouthPosNode.addChild(_pufferFish.node);
            _pufferFish.node.mtxLocal.translation = ƒ.Vector3.ZERO();

            root.getComponents(ƒ.ComponentAudio)[4].mtxPivot.translation = PawnCameraController.instance.node.mtxWorld.getTranslationTo(this.node.mtxWorld).normalize();
            root.getComponents(ƒ.ComponentAudio)[4].play(true);
            root.getComponents(ƒ.ComponentAudio)[4].loop = true;

            //_pufferFish.node.mtxLocal.translation = this.mouthPosNode.mtxLocal.translation;
            //_pufferFish.node.mtxLocal.rotation = this.mouthPosNode.mtxLocal.rotation;

        }

        private eatFish(_fish: FishController): void {

            this.satiety += this.satietyGainPerFish;
            this.satiety = this.satiety > 1 ? 1 : this.satiety;

            FishSpawner.instance.node.removeChild(_fish.node);
            ƒ.Recycler.store(_fish.node);

            _fish = undefined;
        }
    }
}