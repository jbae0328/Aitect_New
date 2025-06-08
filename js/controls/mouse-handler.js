window.MouseHandler = {
    canvas: null,
    raycaster: null,
    mouse: null,
    isMouseDown: false,
    isDragging: false,
    dragStartPoint: null,
    dragStartScreen: null,
    dragThreshold: 5,

    init: function (canvas) {
        this.canvas = canvas || (window.ThreeRenderer ? window.ThreeRenderer.getRenderer().domElement : null);
        if (!this.canvas) {
            console.error('Canvas를 찾을 수 없습니다.');
            return;
        }

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.setupEvents();
        console.log("✅ 통합 Mouse Handler 초기화 완료");
    },

    setupEvents: function () {
        const self = this;

        this.canvas.addEventListener('mousedown', function (event) {
            self.onMouseDown(event);
        });

        document.addEventListener('mousemove', function (event) {
            self.onMouseMove(event);
        });

        document.addEventListener('mouseup', function (event) {
            self.onMouseUp(event);
        });

        this.canvas.addEventListener('wheel', function (event) {
            self.onWheel(event);
        });

        this.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    },

    onMouseDown: function (event) {
        event.preventDefault();

        if (event.button === 1) { // 휠 버튼
            if (event.shiftKey) {
                if (window.CameraController) {
                    window.CameraController.startPan(event.clientX, event.clientY);
                }
                this.canvas.style.cursor = 'move';
            } else {
                if (window.CameraController) {
                    window.CameraController.startOrbit(event.clientX, event.clientY);
                }
                this.canvas.style.cursor = 'grabbing';
            }
            return;
        }

        if (event.button === 2) { // 우클릭
            if (window.CameraController) {
                window.CameraController.startOrbit(event.clientX, event.clientY);
            }
            this.canvas.style.cursor = 'grabbing';
            return;
        }

        if (event.button !== 0) return;

        this.isMouseDown = true;
        this.isDragging = false;
        this.dragStartScreen = { x: event.clientX, y: event.clientY };
        this.dragStartPoint = this.getGroundIntersection(event);
        console.log("🖱️ 왼쪽 마우스 다운");
    },

    onMouseMove: function (event) {
        if (window.CameraController && (window.CameraController.controls.isOrbiting || window.CameraController.controls.isPanning)) {
            window.CameraController.updateOrbit(event.clientX, event.clientY);
            window.CameraController.updatePan(event.clientX, event.clientY);
            return;
        }

        if (!this.isMouseDown) {
            const intersectionPoint = this.getGroundIntersection(event);
            if (intersectionPoint && window.ToolManager) {
                window.ToolManager.handleMouseMove(intersectionPoint, event);
            }
            return;
        }

        if (!this.isDragging && this.dragStartScreen) {
            const deltaX = event.clientX - this.dragStartScreen.x;
            const deltaY = event.clientY - this.dragStartScreen.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > this.dragThreshold) {
                this.isDragging = true;
                console.log("🚚 왼쪽 버튼 드래그 시작");
                if (window.ToolManager && this.dragStartPoint) {
                    window.ToolManager.handleDragStart(this.dragStartPoint, this.dragStartScreen);
                }
            }
        }

        if (this.isDragging) {
            const currentPoint = this.getGroundIntersection(event);
            const currentScreen = { x: event.clientX, y: event.clientY };
            if (window.ToolManager && currentPoint) {
                window.ToolManager.handleDragMove(currentPoint, currentScreen, {
                    startPoint: this.dragStartPoint,
                    startScreen: this.dragStartScreen
                });
            }
        }
    },

    onMouseUp: function (event) {
        if (window.CameraController) {
            window.CameraController.stopOrbit();
            window.CameraController.stopPan();
        }

        this.canvas.style.cursor = 'default';

        if (!this.isMouseDown) return;

        if (this.isDragging) {
            console.log("🔴 왼쪽 버튼 드래그 종료");
            const endPoint = this.getGroundIntersection(event);
            const endScreen = { x: event.clientX, y: event.clientY };
            if (window.ToolManager && endPoint) {
                window.ToolManager.handleDragEnd(endPoint, endScreen, {
                    startPoint: this.dragStartPoint,
                    startScreen: this.dragStartScreen
                });
            }
        } else {
            console.log("🎯 클릭");
            const clickPoint = this.getGroundIntersection(event);
            if (window.ToolManager && clickPoint) {
                window.ToolManager.handleClick(clickPoint, event);
            }
        }

        this.isMouseDown = false;
        this.isDragging = false;
        this.dragStartPoint = null;
        this.dragStartScreen = null;
    },

    onWheel: function (event) {
        event.preventDefault();
        if (window.CameraController) {
            window.CameraController.zoom(event.deltaY);
        }
    },

    getGroundIntersection: function (event) {
        this.updateMousePosition(event);
        if (!this.raycaster || !window.ThreeRenderer) return null;
        const camera = window.ThreeRenderer.getCamera();
        if (!camera) return null;
        this.raycaster.setFromCamera(this.mouse, camera);
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
            return intersectionPoint;
        }
        return null;
    },

    updateMousePosition: function (event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        // 디버깅용 로그
        console.log(`Mouse Position - clientX: ${event.clientX}, clientY: ${event.clientY}, rect:`, rect, `NDC: ${this.mouse.x}, ${this.mouse.y}`);
    },

    getIntersectedObjects: function (event) {
        if (event) {
            this.updateMousePosition(event);
        }
        if (!this.raycaster || !window.ThreeRenderer) return [];
        const camera = window.ThreeRenderer.getCamera();
        const scene = window.ThreeRenderer.getScene();
        if (!camera || !scene) return [];
        this.raycaster.setFromCamera(this.mouse, camera);
        const selectableObjects = [];
        scene.traverse(function (child) {
            if ((child.isMesh || child.isLine) && child.userData && child.userData.selectable) {
                selectableObjects.push(child);
            }
        });
        this.raycaster.params.Line = { threshold: 0.5 };
        return this.raycaster.intersectObjects(selectableObjects, false);
    }
};