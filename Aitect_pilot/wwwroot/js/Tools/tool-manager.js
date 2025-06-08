// tool-manager.js - 통합 이벤트 처리 방식
window.ToolManager = {
    currentTool: 'select',
    tools: {},

    init: function () {
        console.log("ToolManager 초기화 시작");
        this.registerTools();
        this.setTool('select');
        this.setupKeyboard();
        console.log("ToolManager 초기화 완료");
    },

    registerTools: function () {
        this.tools = {};
        if (window.SelectTool) {
            this.tools['select'] = window.SelectTool;
            console.log("SelectTool 등록됨");
        }
        if (window.LineTool) {
            this.tools['line'] = window.LineTool;
            console.log("LineTool 등록됨");
        }
    },

    setTool: function (toolName) {
        console.log("🔄 도구 변경:", this.currentTool, "->", toolName);

        // 현재 도구 비활성화
        if (this.currentTool && this.tools[this.currentTool]) {
            try {
                this.tools[this.currentTool].deactivate();
            } catch (e) {
                console.log("도구 비활성화 중 에러:", e);
            }
        }

        // 새 도구 활성화
        this.currentTool = toolName;
        if (this.tools[toolName]) {
            try {
                this.tools[toolName].activate();
                console.log("✅ 도구 활성화 완료:", toolName);
            } catch (e) {
                console.log("도구 활성화 중 에러:", e);
            }
        } else {
            console.log("❌ 도구를 찾을 수 없습니다:", toolName);
        }

        this.updateUI(toolName);
    },

    updateUI: function (toolName) {
        // 툴바 버튼 업데이트
        var toolButtons = document.querySelectorAll('.tool-btn');
        for (var i = 0; i < toolButtons.length; i++) {
            toolButtons[i].classList.remove('active');
        }

        var activeBtn = document.getElementById(toolName + '-tool');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // 현재 도구 표시 업데이트
        var display = document.getElementById('current-tool-display');
        if (display) {
            display.textContent = toolName.charAt(0).toUpperCase() + toolName.slice(1);
        }
    },

    getCurrentTool: function () {
        return this.tools[this.currentTool];
    },

    // === 새로운 통합 이벤트 처리 ===

    // 단순 클릭
    handleClick: function (intersectionPoint, event) {
        var tool = this.getCurrentTool();
        if (tool && tool.handleClick) {
            tool.handleClick(intersectionPoint, event);
        }
    },

    // 드래그 시작
    handleDragStart: function (startPoint, startScreen) {
        var tool = this.getCurrentTool();
        if (tool && tool.handleDragStart) {
            tool.handleDragStart(startPoint, startScreen);
        }
    },

    // 드래그 중
    handleDragMove: function (currentPoint, currentScreen, dragData) {
        var tool = this.getCurrentTool();
        if (tool && tool.handleDragMove) {
            tool.handleDragMove(currentPoint, currentScreen, dragData);
        }
    },

    // 드래그 종료
    handleDragEnd: function (endPoint, endScreen, dragData) {
        var tool = this.getCurrentTool();
        if (tool && tool.handleDragEnd) {
            tool.handleDragEnd(endPoint, endScreen, dragData);
        }
    },

    // 마우스 이동 (드래그 아닐 때)
    handleMouseMove: function (intersectionPoint, event) {
        var tool = this.getCurrentTool();
        if (tool && tool.handleMouseMove) {
            tool.handleMouseMove(intersectionPoint, event);
        }
    },

    // ESC 처리
    handleEscape: function () {
        var tool = this.getCurrentTool();
        if (tool && tool.handleEscape) {
            tool.handleEscape();
        }

        // 다른 도구에서 ESC를 누르면 Select로 전환
        if (this.currentTool !== 'select') {
            console.log("⚠️ ESC - Select 모드로 전환");
            this.setTool('select');
        }
    },

    // 키보드 설정
    setupKeyboard: function () {
        var self = this;

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                self.handleEscape();
                event.preventDefault();
            } else if (!event.ctrlKey && !event.altKey) {
                switch (event.key.toLowerCase()) {
                    case 's':
                        self.setTool('select');
                        event.preventDefault();
                        break;
                    case 'l':
                        self.setTool('line');
                        event.preventDefault();
                        break;
                }
            }

            // 현재 도구에 키보드 이벤트 전달
            var tool = self.getCurrentTool();
            if (tool && tool.handleKeyDown) {
                tool.handleKeyDown(event);
            }
        });
    }
};

// 전역 함수
window.setTool = function (toolName) {
    if (window.ToolManager) {
        window.ToolManager.setTool(toolName);
    }
};