// js/controls/camera-controller.js - 카메라 조작 전용 (기존 코드 기반)
window.CameraController = {
    camera: null,
    controls: {
        target: new THREE.Vector3(0, 0, 0),
        distance: 25,
        theta: Math.PI / 4,
        phi: Math.PI / 3,
        isOrbiting: false,
        isPanning: false,
        lastMouse: { x: 0, y: 0 }
    },

    init: function (camera) {
        this.camera = camera || (window.ThreeRenderer ? window.ThreeRenderer.getCamera() : null);
        if (!this.camera) {
            console.error('Camera가 없습니다. ThreeRenderer를 먼저 초기화하세요.');
            return;
        }

        this.updateCameraPosition();
        console.log("✅ Camera Controller 초기화 완료");
    },

    updateCameraPosition: function () {
        if (!this.camera) return;

        const { target, distance, theta, phi } = this.controls;

        const x = target.x + distance * Math.sin(phi) * Math.cos(theta);
        const y = target.y + distance * Math.cos(phi);
        const z = target.z + distance * Math.sin(phi) * Math.sin(theta);

        this.camera.position.set(x, y, z);
        this.camera.lookAt(target);

        // 그리드 매니저에 카메라 거리 전달 (무한 그리드 업데이트)
        if (window.GridManager && window.GridManager.updateGridForDistance) {
            window.GridManager.updateGridForDistance(distance);
        }
    },

    startOrbit: function (mouseX, mouseY) {
        this.controls.isOrbiting = true;
        this.controls.lastMouse = { x: mouseX, y: mouseY };
    },

    updateOrbit: function (mouseX, mouseY) {
        if (!this.controls.isOrbiting) return;

        const deltaX = mouseX - this.controls.lastMouse.x;
        const deltaY = mouseY - this.controls.lastMouse.y;

        this.controls.theta += deltaX * 0.01;
        this.controls.phi -= deltaY * 0.01;
        this.controls.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.controls.phi));

        this.updateCameraPosition();
        this.controls.lastMouse = { x: mouseX, y: mouseY };
    },

    stopOrbit: function () {
        this.controls.isOrbiting = false;
    },

    startPan: function (mouseX, mouseY) {
        this.controls.isPanning = true;
        this.controls.lastMouse = { x: mouseX, y: mouseY };
    },

    updatePan: function (mouseX, mouseY) {
        if (!this.controls.isPanning || !this.camera) return;

        const deltaX = mouseX - this.controls.lastMouse.x;
        const deltaY = mouseY - this.controls.lastMouse.y;

        const panSpeed = this.controls.distance * 0.0005;
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const right = new THREE.Vector3().crossVectors(this.camera.up, cameraDirection).normalize();
        const up = new THREE.Vector3().crossVectors(cameraDirection, right).normalize();

        // 방향 완전 반대: 마우스 이동 방향과 뷰 이동 방향 일치
        const panOffset = new THREE.Vector3()
            .addScaledVector(right, deltaX * panSpeed)     // 좌우 반대
            .addScaledVector(up, deltaY * panSpeed);       // 상하도 반대

        this.controls.target.add(panOffset);
        this.updateCameraPosition();
        this.controls.lastMouse = { x: mouseX, y: mouseY };
    },

    stopPan: function () {
        this.controls.isPanning = false;
    },

    zoom: function (delta) {
        const zoomSpeed = 0.1;
        const zoomFactor = delta > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;

        this.controls.distance *= zoomFactor;
        this.controls.distance = Math.max(1, Math.min(200, this.controls.distance));

        this.updateCameraPosition();
    },

    resetView: function () {
        this.controls.target.set(0, 0, 0);
        this.controls.distance = 25;
        this.controls.theta = Math.PI / 4;
        this.controls.phi = Math.PI / 3;
        this.updateCameraPosition();
    },

    // 기존 호환성
    reset: function () {
        this.resetView();
    },

    setViewMode: function (mode) {
        switch (mode) {
            case 'top':
                this.controls.phi = 0.1;
                break;
            case 'front':
                this.controls.theta = 0;
                this.controls.phi = Math.PI / 2;
                break;
            case 'side':
                this.controls.theta = Math.PI / 2;
                this.controls.phi = Math.PI / 2;
                break;
            case 'iso':
                this.controls.theta = Math.PI / 4;
                this.controls.phi = Math.PI / 3;
                break;
        }
        this.updateCameraPosition();
    }
};