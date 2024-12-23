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
    class PawnController extends CustomComponentUpdatedScript {
        static readonly iSubclass: number;
        static instance: PawnController;
        constructor();
        start(): void;
        update: (_event: Event) => void;
        private handleMovementKeys;
    }
}
