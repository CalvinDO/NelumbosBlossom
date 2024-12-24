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
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let root;
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
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function setIngameCameraAndViewport() {
        root = ƒ.Project.resources[rootGraphId];
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", root, Script.PawnCameraController.instance.node.getComponent(ƒ.ComponentCamera), document.querySelector("canvas"));
    }
    function update(_event) {
        Script.deltaTime = ƒ.Loop.timeFrameReal * 0.001;
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
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
    class PawnController extends Script.CustomComponentUpdatedScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(PawnController); }
        constructor() {
            super();
            this.acceleration = 0;
            this.dragCoefficient = 0;
            this.dragExponent = 0;
            this.mouseTorqueFactor = 0;
            // Update function 
            this.update = (_event) => {
                if (!this.rb) {
                    this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
                }
                //TODO:
                //Mouse move rotates Pawn
                this.handleMovementKeys();
            };
            this.singleton = true;
            PawnController.instance = this;
        }
        start() {
            window.addEventListener("mousemove", this.onMouseMove);
        }
        onMouseMove(_event) {
            console.log(-_event.movementX);
            PawnController.instance.rb.applyTorque(ƒ.Vector3.Y(-_event.movementX * PawnController.instance.mouseTorqueFactor));
            ƒ.Physics.settings.sleepingAngularVelocityThreshold = 0.0001;
            console.log(PawnController.instance.node.mtxWorld.rotation);
            console.log(PawnController.instance.node.mtxLocal.rotation);
            /*
                  let XIncrement: number = _event.movementY * Main.rotationSpeed;
                  let currentX: number = Main.cmpCamera.mtxPivot.rotation.x;
                  let nextFrameX: number = XIncrement + currentX;
            
                  if (nextFrameX > Main.maxXRotation) {
                      XIncrement = Main.maxXRotation - currentX;
                  }
            
                  if (nextFrameX < -Main.maxXRotation) {
                      XIncrement = -Main.maxXRotation - currentX;
                  }
            
                  Main.cmpCamera.mtxPivot.rotateX(XIncrement);
                  */
        }
        decelerate() {
            let velo = this.rb.getVelocity();
            let ms = velo.magnitudeSquared;
            let drag = ms * -this.dragCoefficient * Script.deltaTime;
            if (velo.magnitude > 0) {
                velo.normalize(drag);
            }
            this.rb.addVelocity(velo);
        }
        handleMovementKeys() {
            let pawnForward = ƒ.Vector3.Z();
            let pawnUp = ƒ.Vector3.Y();
            let pawnLeft = ƒ.Vector3.X();
            let inputVector = new ƒ.Vector3();
            pawnForward.transform(this.node.mtxWorld, false);
            pawnUp.transform(this.node.mtxWorld, false);
            pawnLeft.transform(this.node.mtxWorld, false);
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
                inputVector.normalize();
                let acceleration = inputVector.clone.scale(this.acceleration * Script.deltaTime);
                this.rb.applyForce(acceleration);
            }
            console.log(this.rb.getVelocity().magnitude);
        }
    }
    Script.PawnController = PawnController;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map