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
    public mouseTorqueFactor: number = 0;

    public rb: ƒ.ComponentRigidbody;

    public satietyGainPerFish: number = 0;
    public hungerPerSecond: number = 0;

    public satiety: number = 0.5;

    public dead: boolean = false;

    public satietyBar: HTMLProgressElement;


    constructor() {
      super();

      this.singleton = true;
      PawnController.instance = this;
    }

    public override start(): void {
      this.satietyBar = <HTMLProgressElement>document.querySelector("#pawn-satiety-bar");
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

      this.handleMovementKeys();
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

        let currentFish: FishController = this.rb.collisions[colIndex].node.getComponent(FishController);

        if (currentFish) {
          this.eatFish(currentFish);
        }
      }
    }

    private eatFish(_fish: FishController): void {

      this.satiety += this.satietyGainPerFish;
      this.satiety = this.satiety > 1 ? 1 : this.satiety;

      FishSpawner.instance.node.removeChild(_fish.node);
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

    private handleMovementKeys() {

      let pawnForward: ƒ.Vector3 = ƒ.Vector3.Z();
      let pawnUp: ƒ.Vector3 = ƒ.Vector3.Y();
      let pawnLeft: ƒ.Vector3 = ƒ.Vector3.X();

      let inputVector: ƒ.Vector3 = new ƒ.Vector3();

      pawnForward.transform(PawnCameraRotatorController.instance.node.mtxWorld, false);
      pawnUp.transform(PawnCameraRotatorController.instance.node.mtxWorld, false);
      pawnLeft.transform(PawnCameraRotatorController.instance.node.mtxWorld, false);

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

    private accelerateTowards(_direction: ƒ.Vector3) {
      _direction.normalize();
      let acceleration: ƒ.Vector3 = _direction.clone.scale(this.acceleration * deltaTime * 10);
      this.rb.applyForce(acceleration);
    }
  }
}