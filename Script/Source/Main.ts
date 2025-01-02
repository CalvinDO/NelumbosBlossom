namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let root: ƒ.Graph;
  let rootGraphId: string = "Graph|2024-12-23T15:59:29.558Z|27668";

  window.addEventListener("load", start);

  export let deltaTime: number;

  let displayHintsAndSettings: boolean = true;
  let hintsAndSettingsDiv: HTMLDivElement;

  export let isXAxisInverted: boolean;
  export let isYAxisInverted: boolean;

  async function start(): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();

    setIngameCameraAndViewport();
    setAudio();
    let canvas = document.querySelector("canvas");


    // @ts-ignore 
    canvas.addEventListener("mousedown", canvas.requestPointerLock);
    canvas.addEventListener("mouseup", function (_event: MouseEvent) { if (_event.button == 1) { document.exitPointerLock(); } });


    hintsAndSettingsDiv = document.querySelector("#hints-and-settings");
    /*
        let hideMeCheckbox: HTMLInputElement = <HTMLInputElement>document.querySelector("#checkbox-hide");
        hideMeCheckbox.onchange = function () { hintsAndSettingsDiv.style.display = 'none' };
    */

    let xAxisInvertCheckbox: HTMLInputElement = <HTMLInputElement>document.querySelector("#checkbox-invertX-axis");
    xAxisInvertCheckbox.onchange = function () { isXAxisInverted = xAxisInvertCheckbox.checked };

    let yAxisInvertCheckbox: HTMLInputElement = <HTMLInputElement>document.querySelector("#checkbox-invertY-axis");
    yAxisInvertCheckbox.onchange = function () { isYAxisInverted = yAxisInvertCheckbox.checked };

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

    /*
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.H])) {

      displayHintsAndSettings = displayHintsAndSettings ? false : true;
      console.log(document.querySelector("#hints-and-settings"));
      document.querySelector("#hints-and-settings").setAttribute("display", displayHintsAndSettings ? "block" : "none");
    }
*/
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.T])) {
      root.getComponents(ƒ.ComponentAudio)[0].play(true);
    }

    ƒ.AudioManager.default.update();
  }

  export function getRandomVector(): ƒ.Vector3 {

    let random: ƒ.Random = new ƒ.Random();
    let randomVector: ƒ.Vector3 = random.getVector3(new ƒ.Vector3(-1, -1, -1), new ƒ.Vector3(1, 1, 1));

    return randomVector;
  }
  function setAudio() {
    // ƒ.AudioManager.default.listenWith(root.getComponent(ƒ.ComponentAudioListener));
    //ƒ.AudioManager.default.listenTo(root);
  }

  function onkeyup(_event: KeyboardEvent): void {

    if (_event.code == "KeyH") {
      displayHintsAndSettings = displayHintsAndSettings ? false : true;

      hintsAndSettingsDiv.style.display = displayHintsAndSettings ? "block" : "none";
      //console.log(hintsAndSettingsDiv);

    }
  }

  window.addEventListener('keyup', onkeyup);
}

