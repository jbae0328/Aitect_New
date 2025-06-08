window.ViewerInitializer = {
    init: function () {
        console.log("▶ ViewerInitializer 시작");

        // 1) Three.js 렌더러 초기화
        const ok = window.ThreeRenderer.init("app");
        if (!ok) {
            console.error("❌ ThreeRenderer.init 실패");
            return;
        }

        // 2) GridManager 초기화
        if (window.GridManager && window.GridManager.init) {
            window.GridManager.init();
        }

        // 3) 컨트롤러 초기화
        if (window.MouseHandler && window.MouseHandler.init) {
            window.MouseHandler.init();
        }
        if (window.KeyboardManager && window.KeyboardManager.init) {
            window.KeyboardManager.init();
        }
        if (window.CameraController && window.CameraController.init) {
            window.CameraController.init();
        }

        // 4) ToolManager 초기화 및 기본 툴 설정
        if (window.ToolManager && window.ToolManager.init) {
            window.ToolManager.init();
            window.ToolManager.setTool("select");
            console.log("🛠 기본 툴: select");
        }

        // 5) StatusManager 초기화
        if (window.StatusManager && window.StatusManager.init) {
            window.StatusManager.init();
        }

        console.log("✅ 3D 뷰어 완전 초기화 완료");
    }
};
