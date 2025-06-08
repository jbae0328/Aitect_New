// js/controls/drag-manager.js - 간소화된 드래그 관리자
window.DragManager = {
    isActive: false,
    dragType: null,
    startPoint: null,
    currentPoint: null,
    startScreenPos: null,
    currentScreenPos: null,
    dragThreshold: 5,
    onDragStart: null,
    onDragMove: null,
    onDragEnd: null,
    onDragCancel: null,

    init: function () {
        console.log("🖱️ Drag Manager 초기화");
        this.setupGlobalEvents();
    },

    setupGlobalEvents: function () {
        var self = this;

        // 전역 document 레벨에서 이벤트 캐치
        document.addEventListener('mousemove', function (event) {
            if (self.isActive) {
                self.handleGlobalMove(event);
            }
        });

        document.addEventListener('mouseup', function (event) {
            if (self.isActive) {
                self.endDrag(event);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && self.isActive) {
                self.cancelDrag();
            }
        });

        console.log("📡 전역 드래그 이벤트 설정 완료");
    },

    startDrag: function (options) {
        if (this.isActive) {
            console.log("⚠️ 이미 드래그 중입니다");
            return false;
        }

        this.isActive = true;
        this.dragType = options.type || 'unknown';
        this.startPoint = options.worldPoint ? options.worldPoint.clone() : null;
        this.startScreenPos = options.screenPoint ? {
            x: options.screenPoint.x,
            y: options.screenPoint.y
        } : null;

        this.onDragStart = options.onStart || null;
        this.onDragMove = options.onMove || null;
        this.onDragEnd = options.onEnd || null;
        this.onDragCancel = options.onCancel || null;

        console.log("🟢 드래그 시작:", this.dragType);

        if (this.onDragStart) {
            this.onDragStart({
                type: this.dragType,
                startPoint: this.startPoint,
                startScreenPos: this.startScreenPos
            });
        }

        document.body.style.cursor = this.getCursorForType(this.dragType);
        return true;
    },

    handleGlobalMove: function (event) {
        if (!this.isActive) return;

        this.currentScreenPos = { x: event.clientX, y: event.clientY };

        // 월드 좌표 계산
        if (window.MouseHandler && window.MouseHandler.getGroundIntersection) {
            this.currentPoint = window.MouseHandler.getGroundIntersection(event);
        }

        // 드래그 거리 체크
        if (this.startScreenPos) {
            var deltaX = this.currentScreenPos.x - this.startScreenPos.x;
            var deltaY = this.currentScreenPos.y - this.startScreenPos.y;
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < this.dragThreshold) {
                return;
            }
        }

        // 이동 콜백 호출
        if (this.onDragMove && this.currentPoint) {
            this.onDragMove({
                type: this.dragType,
                startPoint: this.startPoint,
                currentPoint: this.currentPoint,
                startScreenPos: this.startScreenPos,
                currentScreenPos: this.currentScreenPos,
                deltaWorld: this.startPoint ? {
                    x: this.currentPoint.x - this.startPoint.x,
                    y: this.currentPoint.y - this.startPoint.y,
                    z: this.currentPoint.z - this.startPoint.z
                } : null,
                deltaScreen: this.startScreenPos ? {
                    x: this.currentScreenPos.x - this.startScreenPos.x,
                    y: this.currentScreenPos.y - this.startScreenPos.y
                } : null
            });
        }
    },

    endDrag: function (event) {
        if (!this.isActive) return;

        console.log("🔴 드래그 종료:", this.dragType);

        if (this.onDragEnd) {
            this.onDragEnd({
                type: this.dragType,
                startPoint: this.startPoint,
                endPoint: this.currentPoint,
                startScreenPos: this.startScreenPos,
                endScreenPos: this.currentScreenPos,
                deltaWorld: this.startPoint && this.currentPoint ? {
                    x: this.currentPoint.x - this.startPoint.x,
                    y: this.currentPoint.y - this.startPoint.y,
                    z: this.currentPoint.z - this.startPoint.z
                } : null
            });
        }

        this.cleanup();
    },

    cancelDrag: function () {
        if (!this.isActive) return;

        console.log("❌ 드래그 취소:", this.dragType);

        if (this.onDragCancel) {
            this.onDragCancel({
                type: this.dragType,
                startPoint: this.startPoint
            });
        }

        this.cleanup();
    },

    cleanup: function () {
        this.isActive = false;
        this.dragType = null;
        this.startPoint = null;
        this.currentPoint = null;
        this.startScreenPos = null;
        this.currentScreenPos = null;
        this.onDragStart = null;
        this.onDragMove = null;
        this.onDragEnd = null;
        this.onDragCancel = null;

        document.body.style.cursor = 'default';
    },

    getCursorForType: function (type) {
        switch (type) {
            case 'move': return 'move';
            case 'resize': return 'nw-resize';
            case 'select': return 'crosshair';
            case 'draw': return 'crosshair';
            case 'rotate': return 'grab';
            default: return 'default';
        }
    },

    isDragging: function () {
        return this.isActive;
    },

    getDragType: function () {
        return this.dragType;
    }
};

// 간단한 헬퍼 함수들
window.DragHelper = {
    startObjectMove: function (worldPoint, screenPoint, onMove, onEnd, onCancel) {
        return window.DragManager.startDrag({
            type: 'move',
            worldPoint: worldPoint,
            screenPoint: screenPoint,
            onMove: onMove,
            onEnd: onEnd,
            onCancel: onCancel
        });
    },

    startAreaSelect: function (worldPoint, screenPoint, onMove, onEnd, onCancel) {
        return window.DragManager.startDrag({
            type: 'select',
            worldPoint: worldPoint,
            screenPoint: screenPoint,
            onMove: onMove,
            onEnd: onEnd,
            onCancel: onCancel
        });
    }
};