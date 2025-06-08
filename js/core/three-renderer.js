// js/core/three-renderer.js - 순수 렌더링 엔진
window.ThreeRenderer = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    raycaster: null,
    mouse: null,
    objects: [],

    init: function (containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return false;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupRaycaster();
        this.createGrid();
        this.startAnimation();

        // 마우스 핸들러 초기화
        if (window.MouseHandler) {
            window.MouseHandler.init();
        }

        // 도구 관리자 초기화
        if (window.ToolManager) {
            window.ToolManager.init();
        }

        // 리사이즈 이벤트
        window.addEventListener('resize', () => {
            this.resize();
        });

        console.log("✅ Three.js Renderer 초기화 완료");
        return true;
    },

    setupScene: function () {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
    },

    setupCamera: function () {
        const rect = this.container.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(
            75,
            rect.width / rect.height,
            0.1,
            1000
        );
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
    },

    setupRenderer: function () {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        const rect = this.container.getBoundingClientRect();
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 기존 내용 제거하고 캔버스 추가
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
    },

    setupLights: function () {
        // 환경광
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        this.scene.add(ambientLight);

        // 방향광
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(20, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    },

    setupRaycaster: function () {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    },

    createGrid: function () {
        // 그리드 생성
        const gridHelper = new THREE.GridHelper(50, 50, 0xcccccc, 0xeeeeee);
        gridHelper.name = 'grid';
        gridHelper.raycast = function () { }; // 레이캐스팅 완전 무시
        gridHelper.userData.selectable = false; // 추가 마킹
        this.scene.add(gridHelper);

        // 축 표시
        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.name = 'axes';
        axesHelper.raycast = function () { }; // 레이캐스팅 완전 무시
        axesHelper.userData.selectable = false; // 추가 마킹
        this.scene.add(axesHelper);

        console.log("✅ 그리드 및 축 생성 완료 (선택 불가능)");
    },

    startAnimation: function () {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    },

    addObject: function (object) {
        this.scene.add(object);
        if (this.objects.indexOf(object) === -1) {
            this.objects.push(object);
        }
        console.log(`➕ 객체 추가: ${object.name || object.type}`);
    },

    removeObject: function (object) {
        this.scene.remove(object);
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
        console.log(`➖ 객체 제거: ${object.name || object.type}`);
    },

    clearAll: function () {
        // 사용자가 만든 객체들만 제거 (그리드, 조명 제외)
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if ((child.isMesh || child.isLine) &&
                child.name &&
                !child.name.includes('grid') &&
                !child.name.includes('axis') &&
                !child.name.includes('helper')) {
                objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach(object => {
            this.scene.remove(object);
        });

        this.objects = [];
        console.log("🗑️ 모든 객체 삭제 완료");

        if (window.StatusManager) {
            window.StatusManager.showSuccess("모든 객체 삭제 완료");
        }
    },

    resize: function () {
        if (!this.container || !this.camera || !this.renderer) return;

        const rect = this.container.getBoundingClientRect();
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);

        console.log(`📐 리사이즈: ${rect.width}x${rect.height}`);
    },

    // 그리드 토글
    toggleGrid: function () {
        const grid = this.scene.getObjectByName('grid');
        if (grid) {
            grid.visible = !grid.visible;

            if (window.StatusManager) {
                window.StatusManager.showInfo(`그리드 ${grid.visible ? '표시' : '숨김'}`);
            }
        }
    },

    // 축 토글
    toggleAxes: function () {
        const axes = this.scene.getObjectByName('axes');
        if (axes) {
            axes.visible = !axes.visible;

            if (window.StatusManager) {
                window.StatusManager.showInfo(`축 ${axes.visible ? '표시' : '숨김'}`);
            }
        }
    },

    // 접근자 메서드들
    getScene: function () {
        return this.scene;
    },

    getCamera: function () {
        return this.camera;
    },

    getRenderer: function () {
        return this.renderer;
    },

    getContainer: function () {
        return this.container;
    },

    // 객체 개수 반환
    getObjectCount: function () {
        return this.objects.length;
    },

    // 씬 정보 출력
    getSceneInfo: function () {
        const info = {
            objects: this.objects.length,
            triangles: 0,
            vertices: 0
        };

        this.scene.traverse((child) => {
            if (child.geometry) {
                if (child.geometry.index) {
                    info.triangles += child.geometry.index.count / 3;
                } else {
                    info.triangles += child.geometry.attributes.position.count / 3;
                }
                info.vertices += child.geometry.attributes.position.count;
            }
        });

        return info;
    }
};