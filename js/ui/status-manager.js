// status-manager.js - 상태 메시지 관리 (완전 새로 작성)
window.StatusManager = {
    timeout: null,

    showMessage: function (message, duration) {
        duration = duration || 3000;

        // 이전 타임아웃 제거
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        // 상태바 업데이트
        var statusSpans = document.querySelectorAll('.status-bar span');
        if (statusSpans.length > 1) {
            statusSpans[1].textContent = message;

            // 자동 클리어 설정
            if (duration > 0) {
                var self = this;
                this.timeout = setTimeout(function () {
                    statusSpans[1].textContent = "Ready";
                    self.timeout = null;
                }, duration);
            }
        }

        // 콘솔에도 출력
        console.log("Status:", message);
    },

    clearMessage: function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        var statusSpans = document.querySelectorAll('.status-bar span');
        if (statusSpans.length > 1) {
            statusSpans[1].textContent = "Ready";
        }
    },

    showCoordinates: function (x, y, z) {
        var coordText = "";
        if (z !== undefined && z !== null) {
            coordText = "X: " + x.toFixed(2) + ", Y: " + y.toFixed(2) + ", Z: " + z.toFixed(2);
        } else {
            coordText = "X: " + x.toFixed(2) + ", Y: " + y.toFixed(2);
        }

        var statusSpans = document.querySelectorAll('.status-bar span');
        if (statusSpans.length > 0) {
            statusSpans[0].textContent = coordText;
        }
    },

    updateCoordinates: function (x, y, z) {
        this.showCoordinates(x, y, z);
    }
};