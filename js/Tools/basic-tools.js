// 기본 3D 도구들 - 업데이트된 버전
// 박스 도구
window.BoxTool = {
    activate: function () {
        console.log("📦 Box Tool 활성화");
        if (window.StatusManager) {
            window.StatusManager.showMessage("클릭하여 박스를 생성하세요", 0);
        }
    },

    deactivate: function () {
        console.log("Box Tool 비활성화");
        if (window.StatusManager) {
            window.StatusManager.clearMessage();
        }
    },

    handleClick: function (intersectionPoint, event) {
        if (!intersectionPoint || !window.ThreeRenderer) return;

        // 박스 생성
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x0078d4 });
        const box = new THREE.Mesh(geometry, material);

        // 클릭 위치에 배치
        box.position.copy(intersectionPoint);
        box.position.y += 1; // 바닥에서 1 단위 위로
        box.name = `box-${Date.now()}`;
        box.userData = {
            type: 'box',
            created: new Date(),
            selectable: true // 명시적으로 선택 가능 표시
        };

        // 씬에 추가
        window.ThreeRenderer.addObject(box);
        console.log('박스 생성됨:', box.name);

        if (window.StatusManager) {
            window.StatusManager.showMessage("박스 생성 완료!", 1500);
        }

        // Select 도구로 자동 전환
        setTimeout(() => {
            if (window.ToolManager) {
                window.ToolManager.setTool('select');
            }
        }, 100);
    }
};

// 구 도구
window.SphereTool = {
    activate: function () {
        console.log("🔴 Sphere Tool 활성화");
        if (window.StatusManager) {
            window.StatusManager.showMessage("클릭하여 구를 생성하세요", 0);
        }
    },

    deactivate: function () {
        console.log("Sphere Tool 비활성화");
        if (window.StatusManager) {
            window.StatusManager.clearMessage();
        }
    },

    handleClick: function (intersectionPoint, event) {
        if (!intersectionPoint || !window.ThreeRenderer) return;

        // 구 생성
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xff6b35 });
        const sphere = new THREE.Mesh(geometry, material);

        // 클릭 위치에 배치
        sphere.position.copy(intersectionPoint);
        sphere.position.y += 1; // 바닥에서 1 단위 위로
        sphere.name = `sphere-${Date.now()}`;
        sphere.userData = {
            type: 'sphere',
            created: new Date(),
            selectable: true // 명시적으로 선택 가능 표시
        };

        // 씬에 추가
        window.ThreeRenderer.addObject(sphere);
        console.log('구 생성됨:', sphere.name);

        if (window.StatusManager) {
            window.StatusManager.showMessage("구 생성 완료!", 1500);
        }

        // Select 도구로 자동 전환
        setTimeout(() => {
            if (window.ToolManager) {
                window.ToolManager.setTool('select');
            }
        }, 100);
    }
};

// 실린더 도구
window.CylinderTool = {
    activate: function () {
        console.log("🔵 Cylinder Tool 활성화");
        if (window.StatusManager) {
            window.StatusManager.showMessage("클릭하여 실린더를 생성하세요", 0);
        }
    },

    deactivate: function () {
        console.log("Cylinder Tool 비활성화");
        if (window.StatusManager) {
            window.StatusManager.clearMessage();
        }
    },

    handleClick: function (intersectionPoint, event) {
        if (!intersectionPoint || !window.ThreeRenderer) return;

        // 실린더 생성
        const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0x2ecc71 });
        const cylinder = new THREE.Mesh(geometry, material);

        // 클릭 위치에 배치
        cylinder.position.copy(intersectionPoint);
        cylinder.position.y += 1; // 바닥에서 1 단위 위로
        cylinder.name = `cylinder-${Date.now()}`;
        cylinder.userData = {
            type: 'cylinder',
            created: new Date(),
            selectable: true // 명시적으로 선택 가능 표시
        };

        // 씬에 추가
        window.ThreeRenderer.addObject(cylinder);
        console.log('실린더 생성됨:', cylinder.name);

        if (window.StatusManager) {
            window.StatusManager.showMessage("실린더 생성 완료!", 1500);
        }

        // Select 도구로 자동 전환
        setTimeout(() => {
            if (window.ToolManager) {
                window.ToolManager.setTool('select');
            }
        }, 100);
    }
};