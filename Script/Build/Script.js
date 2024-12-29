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
        //private rb: ƒ.ComponentRigidbody;
        //private currentTargetPos: ƒ.Vector3;
        constructor() {
            super();
            this.diceTargetElapseSeconds = 0;
            this.maxTargetDistance = 0;
            this.speed = 0;
            // Update function 
            this.update = (_event) => {
                this.preventSurfacePenetration();
                this.move();
            };
            this.diceNewTarget = async (_event) => {
                if ((Math.random()) > 0.5) {
                    this.calculateNewTarget();
                }
            };
        }
        start() {
            //this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
            let timer = new ƒ.Timer(new ƒ.Time(), this.diceTargetElapseSeconds * 1000, 0, this.diceNewTarget);
        }
        preventSurfacePenetration() {
            if (this.node.mtxWorld.translation.y > -1) {
                this.node.mtxLocal.lookAt(ƒ.Vector3.Y(-1));
            }
        }
        move() {
            this.node.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameReal * 0.001, true);
        }
        calculateNewTarget() {
            let currentDirection = ƒ.Vector3.SUM(this.node.mtxLocal.translation, Script.getRandomVector());
            this.node.mtxLocal.lookAt(currentDirection);
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
                let distance = Script.PawnController.instance.node.mtxWorld.translation.getDistance(fish.mtxLocal.translation);
                if (distance < this.maxSpawnRadius) {
                    amount++;
                }
                else {
                    if (distance > (this.maxSpawnRadius + this.minSpawnRadius)) {
                        this.node.removeChild(fish);
                        Script.root.removeChild(fish);
                        fish = undefined;
                    }
                }
            });
            return amount;
        }
        constructor() {
            super();
            this.elapseSeconds = 0;
            this.fishPrefabId = "";
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
                let newFish;
                try {
                    newFish = await ƒ.Project.createGraphInstance(ƒ.Project.resources[this.fishPrefabId]);
                }
                catch (error) {
                    console.warn(error);
                    return;
                }
                let randomVector = Script.getRandomVector();
                let minDirectionVector = ƒ.Vector3.SCALE(randomVector, this.minSpawnRadius);
                newFish.mtxLocal.translation = ƒ.Vector3.SUM(Script.PawnController.instance.node.mtxWorld.translation, ƒ.Vector3.SCALE(randomVector, this.maxSpawnRadius - this.minSpawnRadius), minDirectionVector);
                if (newFish.mtxLocal.translation.y > -1) {
                    return;
                }
                newFish.mtxLocal.rotation = Script.getRandomVector().scale(108);
                this.node.addChild(newFish);
            };
            this.singleton = true;
            FishSpawner.instance = this;
        }
        start() {
            let timer = new ƒ.Timer(new ƒ.Time(), this.elapseSeconds * 1000, 0, this.spawn);
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
    }
    Script.FishSpawner = FishSpawner;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let rootGraphId = "Graph|2024-12-23T15:59:29.558Z|27668";
    window.addEventListener("load", start);
    async function start() {
        await ƒ.Project.loadResourcesFromHTML();
        setIngameCameraAndViewport();
        let canvas = document.querySelector("canvas");
        // @ts-ignore 
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function (_event) { if (_event.button == 1) {
            document.exitPointerLock();
        } });
        ƒ.Physics.settings.sleepingAngularVelocityThreshold = 0.0001;
        ƒ.Physics.settings.sleepingVelocityThreshold = 0.0001;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function setIngameCameraAndViewport() {
        Script.root = ƒ.Project.resources[rootGraphId];
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", Script.root, Script.PawnCameraController.instance.node.getComponent(ƒ.ComponentCamera), document.querySelector("canvas"));
    }
    function update(_event) {
        Script.deltaTime = ƒ.Loop.timeFrameReal * 0.001;
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function getRandomVector() {
        let random = new ƒ.Random();
        let randomVector = random.getVector3(new ƒ.Vector3(-1, -1, -1), new ƒ.Vector3(1, 1, 1));
        return randomVector;
    }
    Script.getRandomVector = getRandomVector;
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
            };
            this.singleton = true;
            PawnCameraController.instance = this;
        }
        start() {
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
            // Update function 
            this.update = (_event) => {
                if (this.dead) {
                    return;
                }
                if (!this.rb) {
                    this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                }
                this.checkCollisions();
                this.hunger();
                this.updateBar();
                this.handleMovementKeys();
            };
            this.singleton = true;
            PawnController.instance = this;
        }
        start() {
            this.satietyBar = document.querySelector("#pawn-satiety-bar");
        }
        updateBar() {
            this.satietyBar.value = this.satiety;
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
            _fish = undefined;
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
                this.accelerateTowards(inputVector);
            }
            //console.log(this.rb.getVelocity().magnitude);
        }
        accelerateTowards(_direction) {
            _direction.normalize();
            let acceleration = _direction.clone.scale(this.acceleration * Script.deltaTime);
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
//# sourceMappingURL=Script.js.map