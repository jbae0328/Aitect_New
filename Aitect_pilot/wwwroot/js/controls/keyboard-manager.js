// 키보드 단축키 관리 - window 방식
window.KeyboardManager = {
    shortcuts: {},

    init: function () {
        this.setupDefaultShortcuts();
        this.setupKeyboardEvents();
        console.log("Keyboard Manager 초기화 완료");
    },

    setupDefaultShortcuts: function () {
        // 3D 뷰어 관련 단축키만 (UI 관련은 Blazor에서 처리)
        this.shortcuts = {
            // 뷰 컨트롤
            'KeyF': () => this.fitToView(),
            'KeyG': () => this.toggleGrid(),
            'KeyA': () => this.toggleAxes(),
            'KeyR': () => this.resetView(),

            // 뷰 모드
            'Digit1': () => this.setView('top'),
            'Digit2': () => this.setView('front'),
            'Digit3': () => this.setView('side'),
            'Digit4': () => this.setView('iso'),

            // 객체 조작
            'Delete': () => this.deleteSelected(),
            'KeyX': () => this.clearAll(),

            // 카메라 미세 조정
            'ArrowUp': () => this.nudgeCamera('up'),
            'ArrowDown': () => this.nudgeCamera('down'),
            'ArrowLeft': () => this.nudgeCamera('left'),
            'ArrowRight': () => this.nudgeCamera('right'),
        };
    },

    setupKeyboardEvents: function () {
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    },

    handleKeyDown: function (event) {
        // 텍스트 입력 중일 때는 단축키 무시
        if (this.isInputActive()) return;

        const key = event.code;
        const hasCtrl = event.ctrlKey;
        const hasShift = event.shiftKey;
        const hasAlt = event.altKey;

        // 수정키 조합 생성
        let shortcut = '';
        if (hasCtrl) shortcut += 'Ctrl+';
        if (hasShift) shortcut += 'Shift+';
        if (hasAlt) shortcut += 'Alt+';
        shortcut += key;

        // 단축키 실행
        if (this.shortcuts[shortcut]) {
            event.preventDefault();
            this.shortcuts[shortcut]();
            return;
        }

        // 단일키 단축키 실행
        if (this.shortcuts[key]) {
            event.preventDefault();
            this.shortcuts[key]();
        }
    },

    handleKeyUp: function (event) {
        // 키 업 이벤트 처리 (필요시)
    },

    isInputActive: function () {
        const activeElement = document.activeElement;
        const inputTypes = ['input', 'textarea', 'select'];
        return inputTypes.includes(activeElement.tagName.toLowerCase()) ||
            activeElement.contentEditable === 'true';
    },

    // 3D 뷰어 제어 함수들
    fitToView: function () {
        if (window.CameraController) {
            window.CameraController.resetView();
        }
        if (window.StatusManager) {
            window.StatusManager.showMessage("전체 보기");
        }
    },

    toggleGrid: function () {
        if (window.GridManager) {
            window.GridManager.toggleGrid();
        }
    },

    toggleAxes: function () {
        if (window.GridManager) {
            window.GridManager.toggleAxes();
        }
    },

    resetView: function () {
        if (window.CameraController) {
            window.CameraController.resetView();
        }
        if (window.StatusManager) {
            window.StatusManager.showMessage("뷰 초기화");
        }
    },

    setView: function (viewMode) {
        if (window.CameraController) {
            window.CameraController.setViewMode(viewMode);
        }
        if (window.StatusManager) {
            const viewNames = {
                'top': '평면도',
                'front': '정면도',
                'side': '측면도',
                'iso': '아이소메트릭'
            };
            window.StatusManager.showMessage(`${viewNames[viewMode]} 보기`);
        }
    },

    deleteSelected: function () {
        // 향후 선택된 객체 삭제 기능
        console.log("선택된 객체 삭제");
        if (window.StatusManager) {
            window.StatusManager.showMessage("선택된 객체 삭제");
        }
    },

    clearAll: function () {
        if (window.clearAll) {
            window.clearAll();
        }
    },

    nudgeCamera: function (direction) {
        if (!window.CameraController) return;

        const nudgeAmount = 0.1;

        switch (direction) {
            case 'up':
                window.CameraController.controls.phi -= nudgeAmount;
                break;
            case 'down':
                window.CameraController.controls.phi += nudgeAmount;
                break;
            case 'left':
                window.CameraController.controls.theta -= nudgeAmount;
                break;
            case 'right':
                window.CameraController.controls.theta += nudgeAmount;
                break;
        }

        window.CameraController.updateCameraPosition();
    },

    // 사용자 정의 단축키 추가
    addShortcut: function (key, callback, description) {
        this.shortcuts[key] = callback;
        console.log(`단축키 추가: ${key} - ${description}`);
    },

    // 단축키 제거
    removeShortcut: function (key) {
        delete this.shortcuts[key];
        console.log(`단축키 제거: ${key}`);
    },

    // 모든 단축키 목록 반환
    getShortcuts: function () {
        return Object.keys(this.shortcuts);
    }
};