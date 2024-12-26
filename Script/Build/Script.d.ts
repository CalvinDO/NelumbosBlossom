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
    let deltaTime: number;
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
    class PawnRotationalController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnRotationalController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
    }
}
