///<reference path = "CustomComponentUpdatedScript.ts"/>
namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class PawnController extends CustomComponentUpdatedScript {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(PawnController);
    public static instance: PawnController;

    public acceleration: number = 0;
    public dragCoefficient: number = 0;
    public dragExponent: number = 0;

    private rb: ƒ.ComponentRigidbody;

    constructor() {
      super();

      this.singleton = true;
      PawnController.instance = this;
    }

    public override start(): void {

    }

    // Update function 
    public override update = (_event: Event): void => {

      if (!this.rb) {
        this.rb = this.node.getComponent(ƒ.ComponentRigidbody);
      }

      //TODO:
      //Mouse move rotates Pawn

      this.handleMovementKeys();
    }

    private decelerate() {
      let velo: ƒ.Vector3 = this.rb.getVelocity();

      let ms: number = velo.magnitudeSquared;
      let drag: number = ms * -this.dragCoefficient * deltaTime;

      if (velo.magnitude > 0){
        velo.normalize(drag);
      }

      this.rb.addVelocity(velo);
    }

    private handleMovementKeys() {

      let pawnForward: ƒ.Vector3 = ƒ.Vector3.Z();
      let pawnUp: ƒ.Vector3 = ƒ.Vector3.Y();
      let pawnLeft: ƒ.Vector3 = ƒ.Vector3.X();

      let inputVector: ƒ.Vector3 = new ƒ.Vector3();

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
        let acceleration: ƒ.Vector3 = inputVector.clone.scale(this.acceleration * deltaTime);
        this.rb.applyForce(acceleration);
      }

      console.log(this.rb.getVelocity().magnitude);
    }
  }
}