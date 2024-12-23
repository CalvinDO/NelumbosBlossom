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
        // ƒ.Physics.simulate();  // if physics is included and used
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
                console.log("pawncam updates in overridden function");
            };
            this.singleton = true;
            PawnCameraController.instance = this;
        }
        start() {
            console.log("pawncam start");
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
            // Update function 
            this.update = (_event) => {
                console.log("Pawncontrl updates in overridden function");
                this.handleMovementKeys();
            };
            this.singleton = true;
            PawnController.instance = this;
        }
        start() {
            console.log("PawnController start");
        }
        handleMovementKeys() {
            let playerForward = ƒ.Vector3.Z();
            let playerLeft = ƒ.Vector3.X();
            playerForward.transform(this.node.mtxWorld, false);
            playerLeft.transform(this.node.mtxWorld, false);
            /*
                  playerForward.scale(deltaTime);
                  playerLeft.scale(deltaTime);
            
                  if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                      playerForward.scale(movementAcceleration);
                      avatarRb.addVelocity(playerForward);
                  }
            
                  if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                      playerForward.scale(-movementAcceleration);
                      avatarRb.addVelocity(playerForward);
                  }
            
                  if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                      playerLeft.scale(movementAcceleration);
                      avatarRb.addVelocity(playerLeft);
                  }
            
                  if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                      playerLeft.scale(-movementAcceleration);
                      avatarRb.addVelocity(playerLeft);
                  }
            
                  let velo: ƒ.Vector3 = avatarRb.getVelocity();
                  let xZVelo: ƒ.Vector2 = new ƒ.Vector2(velo.x, velo.z);
            
                  if (xZVelo.magnitude >= 0) {
                      xZVelo.scale(1 - movementDrag);
                      let newVelo: ƒ.Vector3 = new ƒ.Vector3(xZVelo.x, velo.y, xZVelo.y);
                      avatarRb.setVelocity(newVelo);
                  }
            
                  if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
                      if (isGrounded) {
                          avatarRb.applyLinearImpulse(new ƒ.Vector3(0, jumpForce * deltaTime, 0));
                      }
                  }
                      */
        }
    }
    Script.PawnController = PawnController;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map