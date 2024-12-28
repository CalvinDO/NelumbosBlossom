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
        maxTargetDistance: number;
        speed: number;
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private preventSurfacePenetration;
        move(): void;
        diceNewTarget: (_event?: ƒ.EventTimer) => Promise<void>;
        private calculateNewTarget;
    }
}
declare namespace Script {
    class FishSpawner extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        elapseSeconds: number;
        fishPrefabId: string;
        minSpawnRadius: number;
        maxSpawnRadius: number;
        maxFishAmount: number;
        private get amountFishInRange();
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private spawn;
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
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private decelerate;
        private handleMovementKeys;
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
