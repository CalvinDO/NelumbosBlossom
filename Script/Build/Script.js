"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentUpdatedScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(CustomComponentUpdatedScript); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentUpdatedScript added to ";
            this.useRenderEvent = false;
            // Update function 
            this.update = (_event) => {
            };
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        if (this.useRenderEvent) {
                            this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.hndEvent);
                        }
                        else {
                            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                        }
                        this.start();
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                    case "renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */:
                        this.update(_event);
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        start() {
        }
    }
    Script.CustomComponentUpdatedScript = CustomComponentUpdatedScript;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class FishController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(FishController); }
        constructor() {
            super();
            this.diceTargetElapseSeconds = 0;
            this.acceleration = 0;
            //private currentTargetPos: ƒ.Vector3;
            this.currentDirection = Script.getRandomVector();
            // Update function 
            this.update = (_event) => {
                if (!this.rb) {
                    this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                }
                //this.preventSurfacePenetration();
                this.move();
                this.checkCollisions();
                this.lookAtSpeed();
            };
            this.diceNewTarget = async (_event) => {
                if ((Math.random()) > 0.5) {
                    this.calculateNewDirection();
                }
            };
        }
        start() {
            this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
            let timer = new ƒ.Timer(new ƒ.Time(), this.diceTargetElapseSeconds * 1000, 0, this.diceNewTarget);
            this.currentDirection = Script.getRandomVector();
        }
        lookAtSpeed() {
            if (this.rb.getVelocity().magnitude > 0.001) {
                this.node.getChild(0).mtxLocal.lookAt(this.rb.getVelocity()), ƒ.Vector3.Y();
            }
        }
        checkCollisions() {
            if (ƒ.Physics.raycast(this.rb.getPosition(), this.rb.getVelocity(), 2).hit) {
                this.onCourseOfCollision();
            }
        }
        onCourseOfCollision() {
            this.dodge();
        }
        move() {
            if (this.rb) {
                this.rb.applyForce(ƒ.Vector3.SCALE(this.currentDirection, this.acceleration * ƒ.Loop.timeFrameReal * 0.001));
            }
            //this.node.mtxLocal.translate(ƒ.Vector3.SCALE(ƒ.Vector3.SUM(this.rb.getPosition(), this.currentDirection), this.acceleration * ƒ.Loop.timeFrameReal * 0.001));
        }
        calculateNewDirection() {
            this.currentDirection = Script.getRandomVector();
            this.currentDirection.normalize();
        }
        dodge() {
            this.calculateNewDirection();
            //this.currentDirection = ƒ.Vector3.SCALE(this.currentDirection, -1);
        }
    }
    Script.FishController = FishController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class FishSpawner extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(FishSpawner); }
        get amountFishInRange() {
            let amount = 0;
            this.node.getChildren().forEach(fish => {
                let distance = Script.PawnController.instance.node.mtxWorld.translation.getDistance(fish.mtxWorld.translation);
                if (distance < this.maxSpawnRadius) {
                    amount++;
                }
                else {
                    if (distance > (this.maxSpawnRadius)) {
                        let pufferFish = fish.getComponent(Script.PufferFishController);
                        if (!pufferFish || !pufferFish.isImmobilized) {
                            this.node.removeChild(fish);
                            Script.root.removeChild(fish);
                            //fish = undefined;
                            ƒ.Recycler.store(fish);
                        }
                    }
                }
            });
            return amount;
        }
        constructor() {
            super();
            this.elapseSeconds = 0;
            this.fishPrefabId = "";
            this.pufferFishPrefabId = "";
            this.octopusId = "Graph|2024-12-31T12:41:56.762Z|96905";
            this.maxPufferFishChance = 0;
            this.maxOctopusChance = 0.15;
            this.minSpawnRadius = 0;
            this.maxSpawnRadius = 0;
            this.maxFishAmount = 0;
            // Update function 
            this.update = (_event) => {
            };
            this.spawn = async (_event) => {
                if (this.amountFishInRange > this.maxFishAmount) {
                    return;
                }
                let randomVector = Script.getRandomVector();
                let minDirectionVector = ƒ.Vector3.SCALE(randomVector, this.minSpawnRadius);
                let newFishTranslation = ƒ.Vector3.SUM(Script.PawnController.instance.node.mtxWorld.translation, ƒ.Vector3.SCALE(randomVector, this.maxSpawnRadius - this.minSpawnRadius), minDirectionVector);
                // newFishTranslation = new ƒ.Vector3(-810, -200, -890);
                let rayHitInfo = ƒ.Physics.raycast(newFishTranslation, ƒ.Vector3.Y(), 200000);
                if (rayHitInfo.hit == false) {
                    return;
                }
                //return when ray doesn't hit surface, therefore origin is under floor collider
                if (!rayHitInfo.rigidbodyComponent.node.getComponent(Script.SurfaceCollider)) {
                    return;
                }
                if (rayHitInfo.hitDistance < 2) {
                    return;
                }
                if (newFishTranslation.y > -1) {
                    return;
                }
                await this.spawnFish(newFishTranslation);
            };
            this.singleton = true;
            FishSpawner.instance = this;
        }
        start() {
            let timer = new ƒ.Timer(new ƒ.Time(), this.elapseSeconds * 1000, 0, this.spawn);
        }
        async spawnFish(_translation) {
            let newFish;
            let currentPufferfishChance = (_translation.y / -885) * this.maxPufferFishChance;
            try {
                let ran = Math.random();
                let ran2 = Math.random();
                console.log(currentPufferfishChance.toFixed(4), ran, ran2);
                if (ran < currentPufferfishChance) {
                    console.log("spawnPufferfish");
                    newFish = await ƒ.Project.createGraphInstance(ƒ.Project.resources[this.pufferFishPrefabId]);
                }
                else {
                    if (ran2 < this.maxOctopusChance) {
                        newFish = await ƒ.Project.createGraphInstance(ƒ.Project.resources[this.octopusId]);
                        console.log("spawnOctopus");
                    }
                    else {
                        newFish = await ƒ.Project.createGraphInstance(ƒ.Project.resources[this.fishPrefabId]);
                        console.log("spawnFish");
                    }
                }
            }
            catch (error) {
                console.warn(error);
                return;
            }
            newFish.mtxLocal.translation = _translation;
            //newFish.mtxLocal.rotation = getRandomVector().scale(108);
            this.node.addChild(newFish);
        }
    }
    Script.FishSpawner = FishSpawner;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class FlipperCameraController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(FlipperCameraController); }
        constructor() {
            super();
            this.singleton = true;
            FlipperCameraController.instance = this;
        }
    }
    Script.FlipperCameraController = FlipperCameraController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let FlipperState;
    (function (FlipperState) {
        FlipperState[FlipperState["IS_FOLLOWING_PAWN"] = 0] = "IS_FOLLOWING_PAWN";
        FlipperState[FlipperState["IS_HUNTING"] = 1] = "IS_HUNTING";
        FlipperState[FlipperState["IS_SUCKING"] = 2] = "IS_SUCKING";
        FlipperState[FlipperState["IS_CALLED"] = 3] = "IS_CALLED";
    })(FlipperState = Script.FlipperState || (Script.FlipperState = {}));
    class FlipperController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(FlipperController); }
        constructor() {
            super();
            this.acceleration = 0;
            this.satietyGainPerFish = 0;
            this.hungerPerSecond = 0;
            this.suckingHungerFactor = 0;
            this.satiety = 0.5;
            this.satietyForHunting = 0.5;
            this.satietyForFollowingPawn = 0.8;
            this.dead = false;
            this.targetSearchIntervalSeconds = 0;
            this.minPawnFollowDistance = 0;
            this.arriveDistance = 5;
            this.state = FlipperState.IS_FOLLOWING_PAWN;
            // Update function 
            this.update = (_event) => {
                if (Script.WinTrigger.instance.gameWon) {
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
            };
            this.searchTarget = (_event) => {
                switch (this.state) {
                    case FlipperState.IS_SUCKING:
                        return;
                    case FlipperState.IS_CALLED:
                    case FlipperState.IS_FOLLOWING_PAWN:
                        this.currentTarget = Script.PawnController.instance.node;
                        break;
                    case FlipperState.IS_HUNTING:
                        this.searchHuntTarget();
                        break;
                }
            };
            this.singleton = true;
            FlipperController.instance = this;
        }
        start() {
            this.satietyBar = document.querySelector("#flipper-satiety-bar");
            let timer = new ƒ.Timer(new ƒ.Time(), this.targetSearchIntervalSeconds * 1000, 0, this.searchTarget);
        }
        setSuckingAudioPivot() {
            try {
                Script.root.getComponents(ƒ.ComponentAudio)[4].mtxPivot.translation = Script.PawnCameraController.instance.node.mtxWorld.getTranslationTo(this.node.mtxWorld).normalize();
            }
            catch (error) {
                console.warn();
            }
        }
        recieveCall() {
            this.disturbSucking();
            this.state = FlipperState.IS_CALLED;
        }
        checkDeath() {
            if (this.satiety <= 0) {
                this.die();
            }
        }
        followTarget() {
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
        arriveAtPawn() {
            this.state = FlipperState.IS_FOLLOWING_PAWN;
            Script.root.getComponents(ƒ.ComponentAudio)[3].mtxPivot.translation = Script.PawnCameraController.instance.node.mtxWorld.getTranslationTo(this.node.mtxWorld);
            Script.root.getComponents(ƒ.ComponentAudio)[3].play(true);
        }
        searchHuntTarget() {
            //todo: study how filter works
            //let arrayWithoutOctopus: ƒ.Node[] = FishSpawner.instance.node.getChildren().filter(fish => { fish.getComponent(FishController) != undefined || fish.getComponent(PufferFishController) != undefined });
            let sortedArray = Script.FishSpawner.instance.node.getChildren().sort((fish1, fish2) => {
                let distance1 = this.node.mtxWorld.translation.getDistance(fish1.mtxWorld.translation);
                let distance2 = this.node.mtxWorld.translation.getDistance(fish2.mtxWorld.translation);
                if (distance1 > distance2) {
                    return 1;
                }
                if (distance1 < distance2) {
                    return -1;
                }
                return 0;
            });
            for (let sortedArrayIndex = 0; sortedArrayIndex < sortedArray.length; sortedArrayIndex++) {
                let possibleTarget = sortedArray[sortedArrayIndex];
                if (possibleTarget.getComponent(Script.FishController) || possibleTarget.getComponent(Script.PufferFishController)) {
                    if (ƒ.Physics.raycast(this.node.mtxWorld.translation, this.node.mtxWorld.getTranslationTo(possibleTarget.mtxWorld), 3000).rigidbodyComponent.node == possibleTarget) {
                        this.currentTarget = possibleTarget;
                        return;
                    }
                }
            }
        }
        accelerateTowardsNormalized(_direction) {
            _direction.normalize();
            let acceleration = _direction.clone.scale(this.acceleration * ƒ.Loop.timeFrameReal * 0.001 * (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G]) ? 10 : 1));
            this.rb.applyForce(acceleration);
        }
        accelerateTowards(_direction) {
            let acceleration = _direction.clone.scale(ƒ.Loop.timeFrameReal * 0.001);
            this.rb.applyForce(acceleration);
        }
        updateBar() {
            this.satietyBar.value = this.satiety;
            if (this.state == FlipperState.IS_SUCKING) {
                this.satietyBar.style.setProperty('--progress-bar-color', 'red');
            }
            else {
                this.satietyBar.style.setProperty('--progress-bar-color', 'orange');
            }
        }
        hunger() {
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
            }
            else if (this.satiety > this.satietyForFollowingPawn) {
                this.state = FlipperState.IS_FOLLOWING_PAWN;
            }
        }
        die() {
            this.node.getParent().removeChild(this.node);
            this.dead = true;
            //ƒ.Loop.stop();
            window.alert("Flipper died");
        }
        checkCollisions() {
            for (let colIndex = 0; colIndex < this.rb.collisions.length; colIndex++) {
                if (this.rb.collisions[colIndex].node.getComponent(Script.PawnController)) {
                    this.disturbSucking();
                }
                if (this.rb.collisions[colIndex].node.getComponent(Script.PufferFishController)) {
                    this.startSuckingFish(this.rb.collisions[colIndex].node.getComponent(Script.PufferFishController));
                    return;
                }
                if (this.rb.collisions[colIndex].node.getComponent(Script.FishController)) {
                    this.eatFish(this.rb.collisions[colIndex].node.getComponent(Script.FishController));
                    return;
                }
            }
        }
        disturbSucking() {
            if (this.state != FlipperState.IS_SUCKING) {
                return;
            }
            this.state = FlipperState.IS_FOLLOWING_PAWN;
            Script.root.getComponents(ƒ.ComponentAudio)[4].play(false);
            Script.root.getComponents(ƒ.ComponentAudio)[4].loop = false;
            try {
                this.mouthPosNode.removeChild(this.suckedFish.node);
                this.suckedFish = undefined;
            }
            catch (error) {
                console.warn(error);
            }
        }
        startSuckingFish(_pufferFish) {
            _pufferFish.immobilize();
            this.suckedFish = _pufferFish;
            this.state = FlipperState.IS_SUCKING;
            this.currentTarget = undefined;
            this.mouthPosNode.addChild(_pufferFish.node);
            _pufferFish.node.mtxLocal.translation = ƒ.Vector3.ZERO();
            Script.root.getComponents(ƒ.ComponentAudio)[4].mtxPivot.translation = Script.PawnCameraController.instance.node.mtxWorld.getTranslationTo(this.node.mtxWorld).normalize();
            Script.root.getComponents(ƒ.ComponentAudio)[4].play(true);
            Script.root.getComponents(ƒ.ComponentAudio)[4].loop = true;
            //_pufferFish.node.mtxLocal.translation = this.mouthPosNode.mtxLocal.translation;
            //_pufferFish.node.mtxLocal.rotation = this.mouthPosNode.mtxLocal.rotation;
        }
        eatFish(_fish) {
            this.satiety += this.satietyGainPerFish;
            this.satiety = this.satiety > 1 ? 1 : this.satiety;
            Script.FishSpawner.instance.node.removeChild(_fish.node);
            ƒ.Recycler.store(_fish.node);
            _fish = undefined;
        }
    }
    Script.FlipperController = FlipperController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class FlipperRotationalController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(FlipperRotationalController); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
                if (Script.FlipperController.instance.rb) {
                    if (Script.FlipperController.instance.rb.getVelocity().magnitude > 0) {
                        this.node.mtxLocal.lookAt(Script.FlipperController.instance.rb.getVelocity(), ƒ.Vector3.Y());
                    }
                }
            };
            this.singleton = true;
            FlipperRotationalController.instance = this;
        }
        start() {
        }
    }
    Script.FlipperRotationalController = FlipperRotationalController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class FloorColliderController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(FloorColliderController); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
            };
            this.singleton = true;
            FloorColliderController.instance = this;
        }
        start() {
            this.node.getChildren().forEach(child => {
                if (!child.getComponent(ƒ.ComponentRigidbody)) {
                    let rb = new ƒ.ComponentRigidbody();
                    rb.typeBody = ƒ.BODY_TYPE.STATIC;
                    child.addComponent(rb);
                    child.removeComponent(child.getComponent(ƒ.ComponentMaterial));
                    child.removeComponent(child.getComponent(ƒ.ComponentMesh));
                }
            });
        }
    }
    Script.FloorColliderController = FloorColliderController;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let rootGraphId = "Graph|2024-12-23T15:59:29.558Z|27668";
    window.addEventListener("load", start);
    async function start() {
        await ƒ.Project.loadResourcesFromHTML();
        setIngameCameraAndViewport();
        setAudio();
        let canvas = document.querySelector("canvas");
        // @ts-ignore 
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function (_event) { if (_event.button == 1) {
            document.exitPointerLock();
        } });
        ƒ.Physics.settings.sleepingAngularVelocityThreshold = 0.0005;
        ƒ.Physics.settings.sleepingVelocityThreshold = 0.0005;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function setIngameCameraAndViewport() {
        Script.root = ƒ.Project.resources[rootGraphId];
        Script.viewport = new ƒ.Viewport();
        Script.viewport.initialize("Viewport", Script.root, Script.PawnCameraController.instance.node.getComponent(ƒ.ComponentCamera), document.querySelector("canvas"));
    }
    function update(_event) {
        Script.deltaTime = ƒ.Loop.timeFrameReal * 0.001;
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.T])) {
            Script.root.getComponents(ƒ.ComponentAudio)[0].play(true);
        }
        ƒ.AudioManager.default.update();
    }
    function getRandomVector() {
        let random = new ƒ.Random();
        let randomVector = random.getVector3(new ƒ.Vector3(-1, -1, -1), new ƒ.Vector3(1, 1, 1));
        return randomVector;
    }
    Script.getRandomVector = getRandomVector;
    function setAudio() {
        // ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));
        //ƒ.AudioManager.default.listenTo(root);
    }
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PawnCameraController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(PawnCameraController); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
                if (!this.camera) {
                    this.node.getComponent(ƒ.ComponentCamera);
                }
                //Sound
                ƒ.AudioManager.default.listenWith(Script.root.getComponent(ƒ.ComponentAudioListener));
                ƒ.AudioManager.default.listenTo(Script.root);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                    //root.getComponent(ƒ.ComponentAudio).play(true);
                }
                this.setFOVToPawnSpeed();
            };
            this.singleton = true;
            PawnCameraController.instance = this;
        }
        start() {
        }
        setFOVToPawnSpeed() {
            //not possible Atm
        }
    }
    Script.PawnCameraController = PawnCameraController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PawnCameraRotatorController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(PawnCameraRotatorController); }
        constructor() {
            super();
            this.mouseTorqueFactor = 0;
            this.maxXRotation = 0;
            // Update function 
            this.update = (_event) => {
            };
            this.singleton = true;
            PawnCameraRotatorController.instance = this;
        }
        start() {
            window.addEventListener("mousemove", this.onMouseMove);
        }
        onMouseMove(_event) {
            let yRotation = PawnCameraRotatorController.instance.node.mtxWorld.rotation.y + -_event.movementX * PawnCameraRotatorController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal;
            //PawnCameraRotatorController.instance.node.mtxLocal.rotateY(-_event.movementX * PawnCameraRotatorController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal);
            //PawnController.instance.rb.applyTorque(ƒ.Vector3.Y(-_event.movementX * PawnController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal));
            let xIncrement = _event.movementY * Script.PawnController.instance.mouseTorqueFactor * ƒ.Loop.timeFrameReal;
            let currentX = PawnCameraRotatorController.instance.node.mtxWorld.rotation.x;
            let nextFrameX = xIncrement + currentX;
            if (nextFrameX > PawnCameraRotatorController.instance.maxXRotation) {
                xIncrement = PawnCameraRotatorController.instance.maxXRotation - currentX;
            }
            if (nextFrameX < -PawnCameraRotatorController.instance.maxXRotation) {
                xIncrement = -PawnCameraRotatorController.instance.maxXRotation - currentX;
            }
            //PawnCameraRotatorController.instance.node.mtxLocal.rotateZ(XIncrement);
            let xRotation = PawnCameraRotatorController.instance.node.mtxWorld.rotation.x + xIncrement;
            PawnCameraRotatorController.instance.node.mtxLocal.rotation = new ƒ.Vector3(xRotation, yRotation, 0);
            //PawnCameraRotatorController.instance.node.mtxLocal.rotation.z = 0;
        }
    }
    Script.PawnCameraRotatorController = PawnCameraRotatorController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PawnController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(PawnController); }
        constructor() {
            super();
            this.acceleration = 0;
            this.dragCoefficient = 0;
            this.dragExponent = 0;
            this.mouseTorqueFactor = 0;
            this.satietyGainPerFish = 0;
            this.hungerPerSecond = 0;
            this.satiety = 0.5;
            this.dead = false;
            this.callSatietyCost = 0.2;
            this.callRefillSpeedPerSecond = 0.025;
            this.callPreparedness = 1;
            this.dumpRecycler = async (_event) => {
                console.log("Recycler dumpAll");
                ƒ.Recycler.dumpAll();
            };
            // Update function 
            this.update = (_event) => {
                if (Script.WinTrigger.instance.gameWon) {
                    return;
                }
                if (this.dead) {
                    return;
                }
                if (!this.rb) {
                    this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                }
                this.checkCollisions();
                this.hunger();
                this.updateBars();
                this.handleMovementKeys();
                this.handleCall();
            };
            this.singleton = true;
            PawnController.instance = this;
        }
        start() {
            this.satietyBar = document.querySelector("#pawn-satiety-bar");
            this.callBar = document.querySelector("#pawn-call-bar");
            let timer = new ƒ.Timer(new ƒ.Time(), 5 * 1000, 0, this.dumpRecycler);
        }
        handleCall() {
            this.callPreparedness += ƒ.Loop.timeFrameReal * 0.001 * this.callRefillSpeedPerSecond;
            this.callPreparedness = this.callPreparedness > 1 ? 1 : this.callPreparedness;
            if (this.callPreparedness < 1) {
                return;
            }
            if (this.satiety - this.callSatietyCost <= 0) {
                return;
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
                this.callFlipper();
            }
        }
        callFlipper() {
            Script.FlipperController.instance.recieveCall();
            this.satiety -= this.callSatietyCost;
            this.callPreparedness = 0;
            Script.root.getComponents(ƒ.ComponentAudio)[2].play(true);
        }
        updateBars() {
            this.satietyBar.value = this.satiety;
            this.callBar.value = this.callPreparedness;
            this.callBar.style.setProperty('--progress-bar-color', 'green');
        }
        hunger() {
            this.satiety -= this.hungerPerSecond * ƒ.Loop.timeFrameReal * 0.001;
            if (this.satiety <= 0) {
                this.die();
            }
        }
        die() {
            this.node.getParent().removeChild(this.node);
            this.dead = true;
            ƒ.Loop.stop();
            window.alert("You died");
        }
        checkCollisions() {
            for (let colIndex = 0; colIndex < this.rb.collisions.length; colIndex++) {
                let currentFish = this.rb.collisions[colIndex].node.getComponent(Script.FishController);
                if (currentFish) {
                    this.eatFish(currentFish);
                }
            }
        }
        eatFish(_fish) {
            this.satiety += this.satietyGainPerFish;
            this.satiety = this.satiety > 1 ? 1 : this.satiety;
            Script.FishSpawner.instance.node.removeChild(_fish.node);
            ƒ.Recycler.store(_fish.node);
            _fish = undefined;
            Script.root.getComponents(ƒ.ComponentAudio)[1].play(true);
        }
        /*
            private decelerate() {
              let velo: ƒ.Vector3 = this.rb.getVelocity();
        
              let ms: number = velo.magnitudeSquared;
              let drag: number = ms * -this.dragCoefficient * deltaTime;
        
              if (velo.magnitude > 0) {
                velo.normalize(drag);
              }
        
              this.rb.addVelocity(velo);
            }
        */
        handleMovementKeys() {
            let pawnForward = ƒ.Vector3.Z();
            let pawnUp = ƒ.Vector3.Y();
            let pawnLeft = ƒ.Vector3.X();
            let inputVector = new ƒ.Vector3();
            pawnForward.transform(Script.PawnCameraRotatorController.instance.node.mtxWorld, false);
            pawnUp.transform(Script.PawnCameraRotatorController.instance.node.mtxWorld, false);
            pawnLeft.transform(Script.PawnCameraRotatorController.instance.node.mtxWorld, false);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //ƒ.AudioManager.default.resume();
                inputVector.add(pawnForward);
                /*  pawnForward.scale(this.movementAcceleration);
                 this.rb.addVelocity(pawnForward); */
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                inputVector.add(pawnForward.clone.scale(-1));
                /* pawnForward.scale(-this.movementAcceleration);
                this.rb.addVelocity(pawnForward); */
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                inputVector.add(pawnLeft);
                /* pawnLeft.scale(this.movementAcceleration);
                this.rb.addVelocity(pawnLeft); */
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                inputVector.add(pawnLeft.clone.scale(-1));
                /* pawnLeft.scale(-this.movementAcceleration);
                this.rb.addVelocity(pawnLeft); */
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
                inputVector.add(pawnUp);
                /*  pawnUp.scale(this.movementAcceleration);
                 this.rb.addVelocity(pawnUp); */
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
                inputVector.add(pawnUp.clone.scale(-1));
                /* pawnUp.scale(-this.movementAcceleration);
                this.rb.addVelocity(pawnUp); */
            }
            if (inputVector.magnitude > 0) {
                this.accelerateTowardsNormalized(inputVector);
            }
            //console.log(this.rb.getVelocity().magnitude);
        }
        accelerateTowardsNormalized(_direction) {
            _direction.normalize();
            let acceleration = _direction.clone.scale(this.acceleration * ƒ.Loop.timeFrameReal * 0.001 * (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.B]) ? 10 : 1));
            this.rb.applyForce(acceleration);
        }
        accelerateTowards(_direction) {
            let acceleration = _direction.clone.scale(ƒ.Loop.timeFrameReal * 0.001);
            this.rb.applyForce(acceleration);
        }
    }
    Script.PawnController = PawnController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PawnPointLightController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(PawnPointLightController); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
                this.node.mtxLocal.translation = new ƒ.Vector3(Script.PawnController.instance.node.mtxWorld.translation.x, -0.5, Script.PawnController.instance.node.mtxWorld.translation.z);
            };
            this.singleton = true;
            PawnPointLightController.instance = this;
        }
        start() {
        }
    }
    Script.PawnPointLightController = PawnPointLightController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PawnRotationalController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(PawnRotationalController); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
                if (Script.PawnController.instance.rb) {
                    if (Script.PawnController.instance.rb.getVelocity().magnitude > 0) {
                        this.node.mtxLocal.lookAt(Script.PawnController.instance.rb.getVelocity(), ƒ.Vector3.Y());
                    }
                }
            };
            this.singleton = true;
            PawnRotationalController.instance = this;
        }
        start() {
        }
    }
    Script.PawnRotationalController = PawnRotationalController;
})(Script || (Script = {}));
///<reference path = "FishController.ts"/>
var Script;
///<reference path = "FishController.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class PufferFishController extends Script.FishController {
        static { this.iSubclass = ƒ.Component.registerSubclass(PufferFishController); }
        constructor() {
            super();
        }
        move() {
            if (this.isImmobilized) {
                return;
            }
            super.move();
        }
        immobilize() {
            this.isImmobilized = true;
            //this.node.mtxLocal.lookAt(this.node.mtxLocal.getTranslationTo(FlipperController.instance.node.mtxLocal));
            this.rb.activate(false);
            this.node.removeComponent(this.rb);
            this.node.getChild(0).getChild(0).getChild(0).getComponent(ƒ.ComponentAnimator).playmode = ƒ.ANIMATION_PLAYMODE.STOP;
        }
    }
    Script.PufferFishController = PufferFishController;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SurfaceCollider extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(SurfaceCollider); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
            };
            this.singleton = true;
            SurfaceCollider.instance = this;
        }
        start() {
        }
    }
    Script.SurfaceCollider = SurfaceCollider;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class TriggerWin extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(TriggerWin); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
                if (!this.rb) {
                    this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.rb.collisionMask = 108;
                }
            };
        }
        start() {
        }
    }
    Script.TriggerWin = TriggerWin;
})(Script || (Script = {}));
///<reference path = "CustomComponentUpdatedScript.ts"/>
var Script;
///<reference path = "CustomComponentUpdatedScript.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class WinTrigger extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(WinTrigger); }
        constructor() {
            super();
            // Update function 
            this.update = (_event) => {
                if (this.gameWon) {
                    this.riseUp();
                    return;
                }
                let y = this.node.mtxWorld.translation.y;
                if (Script.PawnController.instance.node.mtxWorld.translation.y < y && Script.FlipperController.instance.node.mtxWorld.translation.y < y) {
                    this.winGame();
                }
            };
            this.singleton = true;
            WinTrigger.instance = this;
        }
        start() {
        }
        riseUp() {
            this.node.mtxLocal.translateY(0.5 * ƒ.Loop.timeFrameReal * 0.001);
            this.node.mtxLocal.rotateY(120 * ƒ.Loop.timeFrameReal * 0.001);
            Script.SurfaceCollider.instance.node.activate(false);
            try {
                Script.PawnController.instance.accelerateTowards(Script.PawnController.instance.node.mtxWorld.getTranslationTo(this.pawnGoal.mtxWorld).scale(1000));
                Script.FlipperController.instance.accelerateTowards(Script.FlipperController.instance.node.mtxWorld.getTranslationTo(this.flipperGoal.mtxWorld).scale(1000));
            }
            catch (error) {
                console.warn(error);
            }
        }
        winGame() {
            this.gameWon = true;
            console.log("game won");
            this.pawnGoal = this.node.getChild(0);
            this.flipperGoal = this.node.getChild(1);
            //this.pawnGoal.mtxLocal.translation.copy(PawnController.instance.node.mtxWorld.translation);
            //this.flipperGoal.mtxLocal.translation.copy(new ƒ.Vector3(-this.pawnGoal.mtxLocal.translation.x, this.pawnGoal.mtxLocal.translation.y, -this.pawnGoal.mtxLocal.translation.z));
            Script.PawnController.instance.rb.isTrigger = true;
            Script.FlipperController.instance.rb.isTrigger = true;
            Script.root.getComponents(ƒ.ComponentAudio)[5].play(true);
            //this.node.mtxLocal.translateY(0);
            /*
            ƒ.Loop.stop();
            window.alert("game Won");
            console.log("game won");
            */
        }
    }
    Script.WinTrigger = WinTrigger;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map