window.SelectTool = {
    selectedObjects: [],
    selectionBox: null,
    objectStartPositions: [],
    dragMode: null, // 'move' 또는 'select'

    activate: function () {
        console.log("📍 Select Tool 활성화");
        this.showMessage("왼쪽 클릭/드래그로 선택/이동 (Ctrl+클릭: 다중선택)");
    },

    deactivate: function () {
        console.log("Select Tool 비활성화");
        this.clearSelection();
        this.clearSelectionBox();
    },

    // === 통합 이벤트 처리 ===

    handleClick: function (intersectionPoint, event) {
        console.log("🎯 SelectTool 클릭 처리");

        var selectedObject = this.getObjectUnderMouse(event);

        if (selectedObject) {
            if (event.ctrlKey) {
                this.toggleSelection(selectedObject);
            } else {
                this.selectObject(selectedObject);
            }
        } else {
            if (!event.ctrlKey) {
                this.clearSelection();
            }
        }
    },

    handleDragStart: function (startPoint, startScreen) {
        console.log("🚚 SelectTool 드래그 시작");

        var event = { clientX: startScreen.x, clientY: startScreen.y };
        var selectedObject = this.getObjectUnderMouse(event);

        if (selectedObject && this.selectedObjects.indexOf(selectedObject) >= 0) {
            this.dragMode = 'move';
            this.startObjectMove(startPoint);
        } else {
            this.dragMode = 'select';
            this.startAreaSelect(startScreen);
        }
    },

    handleDragMove: function (currentPoint, currentScreen, dragData) {
        if (this.dragMode === 'move') {
            this.updateObjectMove(currentPoint, dragData.startPoint);
        } else if (this.dragMode === 'select') {
            this.updateAreaSelect(dragData.startScreen, currentScreen);
        }
    },

    handleDragEnd: function (endPoint, endScreen, dragData) {
        console.log("🔴 SelectTool 드래그 종료");

        if (this.dragMode === 'move') {
            this.finishObjectMove();
        } else if (this.dragMode === 'select') {
            this.finishAreaSelect(dragData.startScreen, endScreen);
        }

        this.dragMode = null;
    },

    handleMouseMove: function (intersectionPoint, event) {
        // hover 효과 등 필요 시 추가
    },

    // === 객체 이동 관련 ===

    startObjectMove: function (startPoint) {
        if (this.selectedObjects.length === 0) return;

        this.objectStartPositions = [];
        for (var i = 0; i < this.selectedObjects.length; i++) {
            this.objectStartPositions.push(this.selectedObjects[i].position.clone());
        }

        this.showMessage("객체 이동 중...");
        console.log("📦 객체 이동 시작:", this.selectedObjects.length + "개");
    },

    updateObjectMove: function (currentPoint, startPoint) {
        if (!startPoint || this.objectStartPositions.length === 0) return;

        var deltaX = currentPoint.x - startPoint.x;
        var deltaZ = currentPoint.z - startPoint.z;

        for (var i = 0; i < this.selectedObjects.length; i++) {
            var obj = this.selectedObjects[i];
            var startPos = this.objectStartPositions[i];

            if (startPos) {
                obj.position.x = startPos.x + deltaX;
                obj.position.z = startPos.z + deltaZ;
            }
        }
    },

    finishObjectMove: function () {
        console.log("✅ 객체 이동 완료");
        this.showMessage(this.selectedObjects.length + "개 객체 이동 완료");
    },

    // === 영역 선택 관련 ===

    startAreaSelect: function (startScreen) {
        this.createSelectionBox();
        this.showMessage("영역 선택 중...");
        console.log("🎯 영역 선택 시작");
    },

    updateAreaSelect: function (startScreen, currentScreen) {
        this.updateSelectionBox(startScreen, currentScreen);
    },

    finishAreaSelect: function (startScreen, endScreen) {
        this.selectObjectsInRegion(startScreen, endScreen);
        this.clearSelectionBox();
        console.log("✅ 영역 선택 완료:", this.selectedObjects.length + "개");
        this.showMessage(this.selectedObjects.length + "개 객체 선택됨");
    },

    // === 선택 박스 관련 ===

    createSelectionBox: function () {
        if (this.selectionBox) return;

        // 2D HTML 요소로 선택 박스 생성
        this.selectionBox = document.createElement('div');
        this.selectionBox.style.position = 'absolute';
        this.selectionBox.style.background = 'rgba(0, 128, 255, 0.2)';
        this.selectionBox.style.border = '1px solid #0080ff';
        this.selectionBox.style.pointerEvents = 'none';
        document.body.appendChild(this.selectionBox);
        console.log("📦 2D 선택 박스 생성됨");
    },

    updateSelectionBox: function (startScreen, currentScreen) {
        if (!this.selectionBox || !startScreen || !currentScreen) return;

        // 2D 스크린 좌표로 박스 업데이트
        const minX = Math.min(startScreen.x, currentScreen.x);
        const maxX = Math.max(startScreen.x, currentScreen.x);
        const minY = Math.min(startScreen.y, currentScreen.y);
        const maxY = Math.max(startScreen.y, currentScreen.y);

        this.selectionBox.style.left = minX + 'px';
        this.selectionBox.style.top = minY + 'px';
        this.selectionBox.style.width = (maxX - minX) + 'px';
        this.selectionBox.style.height = (maxY - minY) + 'px';
    },

    clearSelectionBox: function () {
        if (this.selectionBox) {
            this.selectionBox.remove();
            this.selectionBox = null;
            console.log("📦 2D 선택 박스 제거됨");
        }
    },

    selectObjectsInRegion: function (startScreen, endScreen) {
        if (!startScreen || !endScreen) return;

        const minX = Math.min(startScreen.x, endScreen.x);
        const maxX = Math.max(startScreen.x, endScreen.x);
        const minY = Math.min(startScreen.y, endScreen.y);
        const maxY = Math.max(startScreen.y, endScreen.y);

        const scene = window.ThreeRenderer.getScene();
        const camera = window.ThreeRenderer.getCamera();
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = window.MouseHandler.canvas.getBoundingClientRect();

        // 2D 박스의 네 모서리를 3D 월드 좌표로 변환
        const corners = [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: minX, y: maxY },
            { x: maxX, y: maxY }
        ];
        const worldCorners = [];

        corners.forEach(corner => {
            mouse.x = ((corner.x - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((corner.y - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersection = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
                worldCorners.push(intersection);
            }
        });

        if (worldCorners.length < 4) {
            console.warn("⚠️ 3D 좌표 변환 실패");
            return;
        }

        // 월드 좌표 범위 계산
        const minWorldX = Math.min(...worldCorners.map(p => p.x));
        const maxWorldX = Math.max(...worldCorners.map(p => p.x));
        const minWorldZ = Math.min(...worldCorners.map(p => p.z));
        const maxWorldZ = Math.max(...worldCorners.map(p => p.z));

        this.clearSelection();
        const newSelections = [];
        scene.traverse(function (child) {
            if (child.userData && child.userData.selectable && child.name !== 'selection-box') {
                const pos = child.position;
                if (pos.x >= minWorldX && pos.x <= maxWorldX && pos.z >= minWorldZ && pos.z <= maxWorldZ) {
                    newSelections.push(child);
                }
            }
        });

        for (const obj of newSelections) {
            this.selectedObjects.push(obj);
            this.highlightObject(obj, true);
        }
    },

    // === 기본 선택 기능 ===

    getObjectUnderMouse: function (event) {
        if (!window.MouseHandler || !window.MouseHandler.getIntersectedObjects) {
            return null;
        }

        var intersections = window.MouseHandler.getIntersectedObjects(event);

        for (var i = 0; i < intersections.length; i++) {
            var obj = intersections[i].object;
            if (obj.userData && obj.userData.selectable && obj.name !== 'selection-box') {
                return obj;
            }
        }
        return null;
    },

    selectObject: function (object) {
        this.clearSelection();
        this.selectedObjects = [object];
        this.highlightObject(object, true);
        console.log("🎯 객체 선택:", object.name);
        this.showMessage("선택됨: " + (object.name || "객체"));
    },

    toggleSelection: function (object) {
        var index = this.selectedObjects.indexOf(object);
        if (index >= 0) {
            this.selectedObjects.splice(index, 1);
            this.highlightObject(object, false);
        } else {
            this.selectedObjects.push(object);
            this.highlightObject(object, true);
        }
        this.showMessage(this.selectedObjects.length + "개 객체 선택됨");
    },

    clearSelection: function () {
        for (var i = 0; i < this.selectedObjects.length; i++) {
            this.highlightObject(this.selectedObjects[i], false);
        }
        this.selectedObjects = [];
    },

    highlightObject: function (object, highlight) {
        if (!object.material) return;

        if (highlight) {
            if (!object.userData.originalColor) {
                object.userData.originalColor = object.material.color.getHex();
            }
            object.material.color.setHex(0xff6b6b);
        } else {
            if (object.userData.originalColor !== undefined) {
                object.material.color.setHex(object.userData.originalColor);
            }
        }
    },

    showMessage: function (message) {
        if (window.StatusManager && window.StatusManager.showMessage) {
            window.StatusManager.showMessage(message, 2000);
        }
        console.log("📢", message);
    },

    handleEscape: function () {
        this.clearSelection();
        this.clearSelectionBox();
        this.dragMode = null;
        this.showMessage("선택 해제됨");
    },

    handleKeyDown: function (event) {
        switch (event.key) {
            case 'Delete':
            case 'Backspace':
                this.deleteSelected();
                event.preventDefault();
                break;
        }
    },

    deleteSelected: function () {
        if (this.selectedObjects.length === 0) {
            this.showMessage("삭제할 객체가 없습니다");
            return;
        }

        var count = this.selectedObjects.length;

        if (window.ThreeRenderer && window.ThreeRenderer.getScene) {
            var scene = window.ThreeRenderer.getScene();

            for (var i = 0; i < this.selectedObjects.length; i++) {
                var obj = this.selectedObjects[i];
                scene.remove(obj);

                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            }
        }

        this.selectedObjects = [];
        console.log("🗑️ " + count + "개 객체 삭제됨");
        this.showMessage(count + "개 객체 삭제됨");
    }
};