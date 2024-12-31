declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentUpdatedScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        useRenderEvent: boolean;
        constructor();
        update: (_event: Event) => void;
        start(): void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class FishController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        diceTargetElapseSeconds: number;
        acceleration: number;
        rb: ƒ.ComponentRigidbody;
        currentDirection: ƒ.Vector3;
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private lookAtSpeed;
        private checkCollisions;
        onCourseOfCollision(): void;
        move(): void;
        diceNewTarget: (_event?: ƒ.EventTimer) => Promise<void>;
        private calculateNewDirection;
        private dodge;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class FishSpawner extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        elapseSeconds: number;
        fishPrefabId: string;
        pufferFishPrefabId: string;
        maxPufferFishChance: number;
        minSpawnRadius: number;
        maxSpawnRadius: number;
        maxFishAmount: number;
        static instance: FishSpawner;
        private get amountFishInRange();
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private spawn;
        spawnFish(_translation: ƒ.Vector3): Promise<void>;
    }
}
declare namespace Script {
    class FlipperCameraController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: FlipperCameraController;
        private viewport;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    enum FlipperState {
        IS_FOLLOWING_PAWN = 0,
        IS_HUNTING = 1,
        IS_SUCKING = 2,
        IS_CALLED = 3
    }
    class FlipperController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: FlipperController;
        acceleration: number;
        rb: ƒ.ComponentRigidbody;
        satietyGainPerFish: number;
        hungerPerSecond: number;
        suckingHungerFactor: number;
        satiety: number;
        satietyForHunting: number;
        satietyForFollowingPawn: number;
        dead: boolean;
        satietyBar: HTMLProgressElement;
        targetSearchIntervalSeconds: number;
        minPawnFollowDistance: number;
        arriveDistance: number;
        private currentTarget;
        private suckedFish;
        private mouthPosNode;
        private state;
        constructor();
        start(): void;
        update: (_event: Event) => void;
        recieveCall(): void;
        private checkDeath;
        private followTarget;
        private searchTarget;
        private searchHuntTarget;
        accelerateTowardsNormalized(_direction: ƒ.Vector3): void;
        accelerateTowards(_direction: ƒ.Vector3): void;
        private updateBar;
        private hunger;
        private die;
        private checkCollisions;
        private disturbSucking;
        private startSuckingFish;
        private eatFish;
    }
}
declare namespace Script {
    class FlipperRotationalController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: FlipperRotationalController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    class FloorColliderController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: FloorColliderController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let root: ƒ.Graph;
    let deltaTime: number;
    function getRandomVector(): ƒ.Vector3;
}
declare namespace Script {
    class PawnCameraController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnCameraController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    class PawnCameraRotatorController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnCameraRotatorController;
        private mouseTorqueFactor;
        private maxXRotation;
        constructor();
        start(): void;
        update: (_event: Event) => void;
        onMouseMove(_event: MouseEvent): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class PawnController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnController;
        acceleration: number;
        dragCoefficient: number;
        dragExponent: number;
        mouseTorqueFactor: number;
        rb: ƒ.ComponentRigidbody;
        satietyGainPerFish: number;
        hungerPerSecond: number;
        satiety: number;
        dead: boolean;
        satietyBar: HTMLProgressElement;
        callBar: HTMLProgressElement;
        callSatietyCost: number;
        callRefillSpeedPerSecond: number;
        private callPreparedness;
        constructor();
        start(): void;
        private dumpRecycler;
        update: (_event: Event) => void;
        private handleCall;
        private callFlipper;
        private updateBars;
        private hunger;
        private die;
        private checkCollisions;
        private eatFish;
        private handleMovementKeys;
        accelerateTowardsNormalized(_direction: ƒ.Vector3): void;
        accelerateTowards(_direction: ƒ.Vector3): void;
    }
}
declare namespace Script {
    class PawnPointLightController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnPointLightController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    class PawnRotationalController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnRotationalController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    class PufferFishController extends FishController {
        static readonly iSubclass: number;
        isImmobilized: boolean;
        constructor();
        move(): void;
        immobilize(): void;
    }
}
declare namespace Script {
    class SurfaceCollider extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: SurfaceCollider;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    class TriggerWin extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        private rb;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    class WinTrigger extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: WinTrigger;
        gameWon: boolean;
        private pawnGoal;
        private flipperGoal;
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private riseUp;
        private winGame;
    }
}
