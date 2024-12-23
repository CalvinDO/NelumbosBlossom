///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class PawnController extends CustomComponentUpdatedScript {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnController);
    public static instance: PawnController;

    constructor() {
      super();

      this.singleton = true;
      PawnController.instance = this;
    }

    public override start(): void {
      console.log("PawnController start");
    }
    // Update function 
    public override update = (_event: Event): void => {
      console.log("Pawncontrl updates in overridden function");

      this.handleMovementKeys();
    }

    private handleMovementKeys() {

      let playerForward: ƒ.Vector3 = ƒ.Vector3.Z();
      let playerLeft: ƒ.Vector3 = ƒ.Vector3.X();

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
}