namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let root: ƒ.Graph;
  let rootGraphId: string = "Graph|2024-12-23T15:59:29.558Z|27668";

  window.addEventListener("load", start);

  export let deltaTime: number;

  async function start(): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();

    setIngameCameraAndViewport();

    let canvas = document.querySelector("canvas");


    // @ts-ignore 
    canvas.addEventListener("mousedown", canvas.requestPointerLock);
    canvas.addEventListener("mouseup", function (_event: MouseEvent) { if (_event.button == 1) { document.exitPointerLock(); } });

   

    ƒ.Physics.settings.sleepingAngularVelocityThreshold = 0.0005;
    ƒ.Physics.settings.sleepingVelocityThreshold = 0.0005;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  

  function setIngameCameraAndViewport() {

    root = <ƒ.Graph>ƒ.Project.resources[rootGraphId];

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, PawnCameraController.instance.node.getComponent(ƒ.ComponentCamera), document.querySelector("canvas"));
  }

  function update(_event: Event): void {

    deltaTime = ƒ.Loop.timeFrameReal * 0.001;

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();


    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Q])) {
      ƒ.Recycler.dumpAll();
    }

    ƒ.AudioManager.default.update();

  }

  export function getRandomVector(): ƒ.Vector3 {

    let random: ƒ.Random = new ƒ.Random();
    let randomVector: ƒ.Vector3 = random.getVector3(new ƒ.Vector3(-1, -1, -1), new ƒ.Vector3(1, 1, 1));

    return randomVector;
  }
}