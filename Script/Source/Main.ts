namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let root: ƒ.Graph;
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
    
    ƒ.AudioManager.default.update();

  }
}