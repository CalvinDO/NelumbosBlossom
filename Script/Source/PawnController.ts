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
    public callBar: HTMLProgressElement;

    public callSatietyCost: number = 0.2;
    public callRefillSpeedPerSecond: number = 0.025;

    private callPreparedness: number = 1;


    constructor() {
      super();

      this.singleton = true;
      PawnController.instance = this;
    }

    public override start(): void {

      this.satietyBar = <HTMLProgressElement>document.querySelector("#pawn-satiety-bar");
      this.callBar = <HTMLProgressElement>document.querySelector("#pawn-call-bar");


      let timer: ƒ.Timer = new ƒ.Timer(new ƒ.Time(), 5 * 1000, 0, this.dumpRecycler);

    }
    private dumpRecycler = async (_event?: ƒ.EventTimer): Promise<void> => {

      console.log("Recycler dumpAll");

      ƒ.Recycler.dumpAll();
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

      this.checkCollisions();

      this.hunger();
      this.updateBars();

      this.handleMovementKeys();

      this.handleCall();
    }

    private handleCall(): void {

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
    private callFlipper(): void {

      FlipperController.instance.recieveCall();

      this.satiety -= this.callSatietyCost;
      this.callPreparedness = 0;

      root.getComponents(ƒ.ComponentAudio)[2].play(true);
    }

    private updateBars(): void {

      this.satietyBar.value = this.satiety;

      this.callBar.value = this.callPreparedness;
      this.callBar.style.setProperty('--progress-bar-color', 'green');
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

      ƒ.Loop.stop();
      window.alert("You died");
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
      ƒ.Recycler.store(_fish.node);

      _fish = undefined;

      root.getComponents(ƒ.ComponentAudio)[1].play(true);
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

    public accelerateTowardsNormalized(_direction: ƒ.Vector3) {
      _direction.normalize();
      let acceleration: ƒ.Vector3 = _direction.clone.scale(this.acceleration * ƒ.Loop.timeFrameReal * 0.001 * (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.B]) ? 10 : 1));
      this.rb.applyForce(acceleration);
    }

    public accelerateTowards(_direction: ƒ.Vector3) {
      let acceleration: ƒ.Vector3 = _direction.clone.scale(ƒ.Loop.timeFrameReal * 0.001);
      this.rb.applyForce(acceleration);
    }
  }
}