// line-tool.js - 통합 이벤트 방식으로 수정
window.LineTool = {
    isDrawing: false,
    startPoint: null,
    previewLine: null,
    startMarker: null,

    activate: function () {
        console.log("📏 Line Tool 활성화");
        this.reset();
        this.showMessage("첫 번째 점을 클릭하세요");
    },

    deactivate: function () {
        console.log("Line Tool 비활성화");
        this.reset();
    },

    reset: function () {
        this.isDrawing = false;
        this.startPoint = null;
        this.clearPreview();
        this.clearMarker();
    },

    // === 새로운 통합 이벤트 처리 ===

    // 단순 클릭 처리
    handleClick: function (intersectionPoint, event) {
        console.log("🖱️ LineTool 클릭 처리", {
            isDrawing: this.isDrawing,
            point: intersectionPoint
        });

        if (!intersectionPoint) return;

        if (!this.isDrawing) {
            // 첫 번째 클릭 - 시작점 설정
            this.startDrawing(intersectionPoint);
        } else {
            // 두 번째 클릭 - 라인 완성
            this.finishLine(intersectionPoint);
        }
    },

    // 드래그는 LineTool에서 사용하지 않음
    handleDragStart: function (startPoint, startScreen) {
        console.log("LineTool: 드래그 시작 (무시됨)");
    },

    handleDragMove: function (currentPoint, currentScreen, dragData) {
        // 무시
    },

    handleDragEnd: function (endPoint, endScreen, dragData) {
        // 무시
    },

    // 마우스 이동 (프리뷰 업데이트)
    handleMouseMove: function (intersectionPoint, event) {
        if (this.isDrawing && intersectionPoint) {
            this.updatePreview(intersectionPoint);
        }
    },

    // === 라인 그리기 로직 ===

    startDrawing: function (point) {
        console.log("🟢 라인 그리기 시작:", point);

        this.startPoint = point.clone();
        this.isDrawing = true;

        this.createStartMarker(point);
        this.createPreviewLine(point);

        this.showMessage("두 번째 점을 클릭하세요 (ESC: 취소)");
        console.log("✅ 라인 시작점 설정 완료");
    },

    finishLine: function (endPoint) {
        if (!this.startPoint) {
            console.log("❌ 시작점이 없음");
            return;
        }

        console.log("🔴 라인 그리기 완료:", this.startPoint, "->", endPoint);

        // 너무 짧은 라인 체크
        var distance = this.startPoint.distanceTo(endPoint);
        if (distance < 0.1) {
            console.log("⚠️ 라인이 너무 짧음:", distance);
            this.showMessage("라인이 너무 짧습니다. 더 멀리 클릭하세요.");
            return;
        }

        this.createActualLine(this.startPoint, endPoint);
        this.reset();

        this.showMessage("라인 완성! Select 모드로 전환됩니다");
        console.log("✅ 라인 생성 완료");

        // Select 모드로 자동 전환 🎯
        setTimeout(() => {
            console.log("🔄 Select 모드로 자동 전환");
            if (window.ToolManager && window.ToolManager.setTool) {
                window.ToolManager.setTool('select');
            }
        }, 100);
    },

    createStartMarker: function (point) {
        this.clearMarker();

        var geometry = new THREE.SphereGeometry(0.3, 16, 8);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: false
        });

        this.startMarker = new THREE.Mesh(geometry, material);
        this.startMarker.position.copy(point);
        this.startMarker.name = 'line-start-marker';

        if (window.ThreeRenderer && window.ThreeRenderer.getScene) {
            var scene = window.ThreeRenderer.getScene();
            scene.add(this.startMarker);
            console.log("✅ 시작점 마커 추가됨:", point);
        }
    },

    createPreviewLine: function (startPoint) {
        this.clearPreview();

        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array([
            startPoint.x, startPoint.y, startPoint.z,
            startPoint.x, startPoint.y, startPoint.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });

        this.previewLine = new THREE.Line(geometry, material);
        this.previewLine.name = 'line-preview';

        if (window.ThreeRenderer && window.ThreeRenderer.getScene) {
            var scene = window.ThreeRenderer.getScene();
            scene.add(this.previewLine);
            console.log("✅ 프리뷰 라인 추가됨");
        }
    },

    updatePreview: function (endPoint) {
        if (!this.previewLine || !this.startPoint) return;

        try {
            var positions = this.previewLine.geometry.attributes.position.array;
            positions[3] = endPoint.x;
            positions[4] = endPoint.y;
            positions[5] = endPoint.z;

            this.previewLine.geometry.attributes.position.needsUpdate = true;
        } catch (error) {
            console.error("프리뷰 업데이트 오류:", error);
        }
    },

    createActualLine: function (startPoint, endPoint) {
        console.log("🔧 실제 라인 생성 시작:", startPoint, "->", endPoint);

        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array([
            startPoint.x, startPoint.y, startPoint.z,
            endPoint.x, endPoint.y, endPoint.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        var material = new THREE.LineBasicMaterial({
            color: 0x333333,
            linewidth: 2
        });

        var line = new THREE.Line(geometry, material);
        line.name = 'line-' + Date.now();
        line.userData = {
            type: 'line',
            selectable: true,
            created: new Date(),
            startPoint: startPoint.clone(),
            endPoint: endPoint.clone()
        };

        // 씬에 추가
        if (window.ThreeRenderer) {
            if (window.ThreeRenderer.addObject) {
                window.ThreeRenderer.addObject(line);
            } else {
                var scene = window.ThreeRenderer.getScene();
                scene.add(line);
            }
        }

        console.log("✅ 라인 생성 완료:", line.name);
    },

    clearPreview: function () {
        if (this.previewLine) {
            if (window.ThreeRenderer && window.ThreeRenderer.getScene) {
                var scene = window.ThreeRenderer.getScene();
                scene.remove(this.previewLine);
            }
            if (this.previewLine.geometry) {
                this.previewLine.geometry.dispose();
            }
            if (this.previewLine.material) {
                this.previewLine.material.dispose();
            }
            this.previewLine = null;
            console.log("프리뷰 라인 제거됨");
        }
    },

    clearMarker: function () {
        if (this.startMarker) {
            if (window.ThreeRenderer && window.ThreeRenderer.getScene) {
                var scene = window.ThreeRenderer.getScene();
                scene.remove(this.startMarker);
            }
            if (this.startMarker.geometry) {
                this.startMarker.geometry.dispose();
            }
            if (this.startMarker.material) {
                this.startMarker.material.dispose();
            }
            this.startMarker = null;
            console.log("시작점 마커 제거됨");
        }
    },

    showMessage: function (message) {
        if (window.StatusManager && window.StatusManager.showMessage) {
            window.StatusManager.showMessage(message, 0);
        }
        console.log("📢 메시지:", message);
    },

    handleEscape: function () {
        console.log("⚠️ ESC - 라인 그리기 취소");
        this.reset();
        this.showMessage("라인 그리기 취소됨");

        // ESC로 취소할 때도 Select 모드로 전환
        setTimeout(() => {
            if (window.ToolManager && window.ToolManager.setTool) {
                window.ToolManager.setTool('select');
            }
        }, 100);
    }
};