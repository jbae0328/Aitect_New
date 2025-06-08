// 그리드 & 축 관리 - window 방식
window.GridManager = {
    scene: null,
    gridHelper: null,
    axesHelper: null,
    gridVisible: true,
    axesVisible: true,
    currentGridSize: 1000,

    init: function (scene) {
        this.scene = scene || (window.ThreeRenderer ? window.ThreeRenderer.getScene() : null);
        if (!this.scene) {
            console.error('Scene이 없습니다. ThreeRenderer를 먼저 초기화하세요.');
            return;
        }

        this.createGrid();
        this.createAxes();
        console.log("Grid Manager 초기화 완료");
    },

    createGrid: function () {
        if (!this.scene) return;

        // 기존 그리드 제거
        if (this.gridHelper) {
            this.scene.remove(this.gridHelper);
        }

        // 무한 그리드 생성 (크기를 매우 크게)
        this.gridHelper = new THREE.GridHelper(1000, 1000, 0xcccccc, 0xeeeeee);
        this.gridHelper.material.transparent = true;
        this.gridHelper.material.opacity = 0.5;
        this.scene.add(this.gridHelper);
    },

    createAxes: function () {
        if (!this.scene) return;

        // 기존 축 제거
        if (this.axesHelper) {
            this.scene.remove(this.axesHelper);
        }

        // 새 축 생성
        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);
    },

    toggleGrid: function () {
        this.gridVisible = !this.gridVisible;
        if (this.gridHelper) {
            this.gridHelper.visible = this.gridVisible;
        }
        console.log('Grid visibility:', this.gridVisible);
    },

    toggleAxes: function () {
        this.axesVisible = !this.axesVisible;
        if (this.axesHelper) {
            this.axesHelper.visible = this.axesVisible;
        }
        console.log('Axes visibility:', this.axesVisible);
    },

    setGridSize: function (size, divisions) {
        if (!this.scene) return;

        // 기존 그리드 제거
        if (this.gridHelper) {
            this.scene.remove(this.gridHelper);
        }

        // 무한 그리드 생성 (최소 크기 제한)
        const gridSize = Math.max(size, 1000);  // 최소 1000 단위
        const gridDivisions = Math.max(divisions, 1000);  // 최소 1000 분할

        this.gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xcccccc, 0xeeeeee);
        this.gridHelper.material.transparent = true;
        this.gridHelper.material.opacity = 0.5;
        this.gridHelper.visible = this.gridVisible;
        this.scene.add(this.gridHelper);
    },

    setAxesSize: function (size) {
        if (!this.scene) return;

        // 기존 축 제거
        if (this.axesHelper) {
            this.scene.remove(this.axesHelper);
        }

        // 새 축 생성
        this.axesHelper = new THREE.AxesHelper(size);
        this.axesHelper.visible = this.axesVisible;
        this.scene.add(this.axesHelper);
    },

    showGrid: function () {
        this.gridVisible = true;
        if (this.gridHelper) {
            this.gridHelper.visible = true;
        }
    },

    hideGrid: function () {
        this.gridVisible = false;
        if (this.gridHelper) {
            this.gridHelper.visible = false;
        }
    },

    showAxes: function () {
        this.axesVisible = true;
        if (this.axesHelper) {
            this.axesHelper.visible = true;
        }
    },

    hideAxes: function () {
        this.axesVisible = false;
        if (this.axesHelper) {
            this.axesHelper.visible = false;
        }
    },

    // 카메라 거리에 따른 동적 그리드 업데이트
    updateGridForDistance: function (cameraDistance) {
        if (!this.scene || !this.gridHelper) return;

        // 카메라 거리에 따라 그리드 크기와 밀도 조절
        let gridSize, gridDivisions;

        if (cameraDistance < 50) {
            gridSize = 2000;
            gridDivisions = 2000;
        } else if (cameraDistance < 200) {
            gridSize = 5000;
            gridDivisions = 1000;
        } else {
            gridSize = 10000;
            gridDivisions = 500;
        }

        // 현재 그리드와 다르면 업데이트
        if (this.currentGridSize !== gridSize) {
            this.setGridSize(gridSize, gridDivisions);
            this.currentGridSize = gridSize;
        }
    }
};