! function(t) {
    function e(n) {
        if (i[n]) return i[n].exports;
        var s = i[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return t[n].call(s.exports, s, s.exports, e), s.l = !0, s.exports
    }
    var i = {};
    e.m = t, e.c = i, e.d = function(t, i, n) {
        e.o(t, i) || Object.defineProperty(t, i, {
            configurable: !1,
            enumerable: !0,
            get: n
        })
    }, e.n = function(t) {
        var i = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return e.d(i, "a", i), i
    }, e.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, e.p = "", e(e.s = 0)
}([function(t, e, i) {
    "use strict";
    i(1), i(2), i(3), i(4), i(5)
}, function(t, e, i) {
    "use strict";
    AFRAME.registerSystem("xr", {
        schema: {
            arAutostart: {
                default: !0
            },
            arLightEstimate: {
                default: !0
            }
        },
        init: function() {
            this.sceneEl.setAttribute("vr-mode-ui", {
                enabled: !1
            }), this.bindMethods(), this.sceneEl.addEventListener("loaded", this.wrapSceneMethods), this.lightEstimate = 1
        },
        bindMethods: function() {
            this.updateFrame = this.updateFrame.bind(this), this.sessionStarted = this.sessionStarted.bind(this), this.sessionEnded = this.sessionEnded.bind(this), this.poseLost = this.poseLost.bind(this), this.poseFound = this.poseFound.bind(this), this.wrapSceneMethods = this.wrapSceneMethods.bind(this)
        },
        wrapSceneMethods: function() {
            var t = this.sceneEl;
            t._enterVR = t.enterVR, t._exitVR = t.exitVR, t._resize = t.resize, t._render = t.render;
            var e = this;
            t.enterAR = function() {
                this.renderer.xr.startSession(e.lastARDisplay, "ar", !0)
            }, t.exitAR = function() {
                this.renderer.xr.endSession()
            }, t.enterVR = function(e) {
                this.renderer.xr.dispatchEvent({
                    type: "sessionStarted",
                    session: this.renderer.xr.session
                }), t._enterVR(e)
            }, t.exitVR = function() {
                this.renderer.xr.dispatchEvent({
                    type: "sessionEnded",
                    session: this.renderer.xr.session
                }), t._exitVR()
            }, t.render = function() {
                "ar" !== e.activeRealityType && t._render()
            }, this.activeRealityType = "magicWindow", this.el.camera ? this.cameraActivated() : this.el.addEventListener("camera-set-active", function(t) {
                e.cameraActivated()
            })
        },
        cameraActivated: function() {
            var t = this;
            this.el.emit("realityChanged", "magicWindow"), THREE.WebXRUtils.getDisplays().then(t.initXR.bind(t))
        },
        initXR: function(t) {
            var e = this.sceneEl;
            e.renderer.autoClear = !1, this.supportAR = !1;
            for (var i = 0; i < t.length; i++) {
                t[i].supportedRealities.ar && (this.supportAR = !0)
            }
            var n = {
                AR_AUTOSTART: this.data.arAutostart
            };
            e.renderer.xr = new THREE.WebXRManager(n, t, e.renderer, e.camera, e.object3D, this.updateFrame), e.renderer.xr.addEventListener("sessionStarted", this.sessionStarted), e.renderer.xr.addEventListener("sessionEnded", this.sessionEnded), e.renderer.xr.addEventListener("poseLost", this.poseLost), e.renderer.xr.addEventListener("poseFound", this.poseFound), 0 === e.renderer.xr.totalSupportedDisplays ? this.sceneEl.setAttribute("vr-mode-ui", {
                enabled: !0
            }) : e.renderer.xr.autoStarted || this.addEnterButtons(t), this.el.emit("xrInitialized")
        },
        addEnterButtons: function(t) {
            for (var e = 0; e < t.length; e++) {
                var i = t[e];
                i.supportedRealities.vr && (this.lastVRDisplay = i, this.sceneEl.setAttribute("vr-mode-ui", {
                    enabled: !0
                })), i.supportedRealities.ar && (this.lastARDisplay = i, this.sceneEl.setAttribute("ar-mode-ui", {
                    enabled: !0
                }))
            }
        },
        sessionStarted: function(t) {
            t.session && t.session.realityType && (this.activeRealityType = t.session.realityType, this.el.emit("realityChanged", this.activeRealityType), "ar" === this.activeRealityType && (document.documentElement.style.backgroundColor = "transparent", document.body.style.backgroundColor = "transparent"))
        },
        sessionEnded: function(t) {
            this.activeRealityType = "magicWindow", this.el.emit("realityChanged", this.activeRealityType), "ar" === this.activeRealityType && (document.documentElement.style.backgroundColor = "", document.body.style.backgroundColor = "")
        },
        poseLost: function() {
            this.el.emit("poseLost")
        },
        poseFound: function() {
            this.el.emit("poseFound")
        },
        update: function() {
            if (this.data.arLightEstimate) {
                this.lightsArray = this.el.sceneEl.querySelectorAll("[light]");
                var t = this;
                this.lightsArrayInterval = setInterval(function() {
                    t.lightsArray = t.el.sceneEl.querySelectorAll("[light]")
                }, 2e3)
            } else this.lightsArrayInterval && clearInterval(this.lightsArrayInterval)
        },
        updateFrame: function(t) {
            if (this.el.emit("updateFrame", t), t.hasLightEstimate && this.data.arLightEstimate)
                for (var e = 0; e < this.lightsArray.length; e++) {
                    var i = this.lightsArray[e];
                    i.getObject3D("light").originalIntensity || (i.getObject3D("light").originalIntensity = i.getAttribute("light").intensity), this.lightEstimate = t.lightEstimate, i.setAttribute("light", "intensity", i.getObject3D("light").originalIntensity * t.lightEstimate)
                }
        }
    })
}, function(t, e, i) {
    "use strict";

    function n(t) {
        var e;
        return e = document.createElement("button"), e.className = r, e.setAttribute("title", "Enter AR mode."), e.setAttribute("aframe-injected", ""), e.addEventListener("click", function(e) {
            document.getElementsByClassName(r)[0].style.display = "none", document.getElementsByClassName(a)[0].style.display = "inline-block", t()
        }), e
    }

    function s(t) {
        var e;
        return e = document.createElement("button"), e.className = a, e.setAttribute("title", "Exit AR mode."), e.setAttribute("aframe-injected", ""), e.addEventListener("click", function(e) {
            document.getElementsByClassName(r)[0].style.display = "inline-block", document.getElementsByClassName(a)[0].style.display = "none", t()
        }), e
    }
    var r = "a-enter-ar-button",
        a = "a-exit-ar-button";
    AFRAME.registerComponent("ar-mode-ui", {
        dependencies: ["canvas"],
        schema: {
            enabled: {
                default: !0
            }
        },
        init: function() {
            var t = this,
                e = this.el;
            if ("false" !== AFRAME.utils.getUrlParameter("ui")) {
                var i = document.createElement("style");
                i.innerHTML = ".a-enter-vr {text-align: center;right: 10px;}", i.innerHTML += ".a-enter-vr-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIyMDQ4cHgiIGhlaWdodD0iMjA0OHB4IiB2aWV3Qm94PSIwIDAgMjA0OCAyMDQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDQ4IDIwNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHRpdGxlPm1hc2s8L3RpdGxlPg0KPGc+DQoJPHJlY3QgeD0iMTQ0LjIzMiIgeT0iNTg3LjI3NiIgZmlsbD0ibm9uZSIgd2lkdGg9IjE4NjYuMTg3IiBoZWlnaHQ9IjEzNDEuMTM0Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTc4MS42NjksNTg2LjU4OWgxOTguNzk3bC0zMTQuMTI1LDkyMUg0ODUuNzAxbC0zMTEuODEyLTkyMWgyMDUuNjU2bDIwMC4xODgsNjk5LjE4OEw3ODEuNjY5LDU4Ni41ODl6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE2ODYuMjc5LDYxMC4zMjRjMzMuOTM4LDE0LjU3OCw2Mi43MDMsMzYuMDMxLDg2LjI4MSw2NC4zNDRjMTkuNTE2LDIzLjMyOCwzNC45NjksNDkuMTU2LDQ2LjM0NCw3Ny40NjkNCgkJczE3LjA3OCw2MC41OTQsMTcuMDc4LDk2LjgxMmMwLDQzLjcxOS0xMS4wNDcsODYuNzE5LTMzLjE0MSwxMjguOTg0Yy0yMi4wOTQsNDIuMjgxLTU4LjU0Nyw3Mi4xNTctMTA5LjM5MSw4OS42NDENCgkJYzQyLjM3NSwxNy4xMjUsNzIuMzkxLDQxLjQzOCw5MC4wNDcsNzIuOTUzYzE3LjY1NiwzMS41MzEsMjYuNDg0LDc5LjU2MiwyNi40ODQsMTQ0LjA5NHY2MS44MjgNCgkJYzAsNDIuMDYyLDEuNzAzLDcwLjU3OCw1LjEyNSw4NS41NjJjNS4xMjUsMjMuNzUsMTcuMDc4LDQxLjIzNCwzNS44NzUsNTIuNDY5djIzLjEwOWgtMjEyLjMyOA0KCQljLTUuNzgxLTIwLjQwNi05LjkwNi0zNi44NDQtMTIuMzc1LTQ5LjM0NGMtNC45NjktMjUuODEyLTcuNjU2LTUyLjI1LTguMDYyLTc5LjMxMmwtMS4yMzQtODUuNTc4DQoJCWMtMC43OTctNTguNzAzLTEwLjk2OS05Ny44NDQtMzAuNTMxLTExNy40MDZzLTU2LjIxOS0yOS4zNTktMTA5Ljk1My0yOS4zNTloLTE4OC41MTZ2MzYxaC0xODh2LTkyMWg0NDAuODc1DQoJCUMxNjAzLjg1Nyw1ODcuODM5LDE2NTIuMzQyLDU5NS43NjEsMTY4Ni4yNzksNjEwLjMyNHogTTEyODcuOTgyLDc0NS41ODl2MjQ4aDIwNy41MzFjNDEuMjE5LDAsNzIuMTQxLTUsOTIuNzY2LTE1LjAzMQ0KCQljMzYuNDY5LTE3LjUzMSw1NC43MDMtNTIuMTcyLDU0LjcwMy0xMDMuOTUzYzAtNTUuOTM4LTE3LjY0MS05My41MTYtNTIuOTIyLTExMi43MzRjLTE5LjgyOC0xMC44NDQtNDkuNTYyLTE2LjI4MS04OS4yMDMtMTYuMjgxDQoJCUgxMjg3Ljk4MnoiLz4NCjwvZz4NCjwvc3ZnPg0K) 50% 50%/70% 70% no-repeat rgba(0,0,0,.35);", i.innerHTML += "position: relative;", i.innerHTML += "margin-right: 10px;", i.innerHTML += "}", i.innerHTML += ".a-enter-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIyMDQ4cHgiIGhlaWdodD0iMjA0OHB4IiB2aWV3Qm94PSIwIDAgMjA0OCAyMDQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDQ4IDIwNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHRpdGxlPm1hc2s8L3RpdGxlPg0KPGc+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTQzOS45NzIsNTg0LjgzNWgyMTcuNjI1bDMyNS4zNDUsOTIxaC0yMDguNzJsLTYwLjU3Ny0xODloLTMzOS4yNWwtNjIuNDIzLDE4OWgtMjAxLjExTDQzOS45NzIsNTg0LjgzNXoNCgkJIE00MjYuODc4LDExNTcuODM1aDIzNS44MTJMNTQ2LjU1LDc5NS4zOTZMNDI2Ljg3OCwxMTU3LjgzNXoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTY5MC43MjMsNjA4LjU2OWMzMy45MzgsMTQuNTc3LDYyLjcwMiwzNi4wMyw4Ni4yOCw2NC4zNDRjMTkuNTE3LDIzLjMyOCwzNC45Nyw0OS4xNTYsNDYuMzQ1LDc3LjQ2OQ0KCQljMTEuMzc1LDI4LjMxMywxNy4wNzcsNjAuNTk0LDE3LjA3Nyw5Ni44MTJjMCw0My43MTktMTEuMDQ3LDg2LjcxOS0zMy4xNDEsMTI4Ljk4M2MtMjIuMDk1LDQyLjI4MS01OC41NDcsNzIuMTU2LTEwOS4zOTIsODkuNjQyDQoJCWM0Mi4zNzUsMTcuMTI1LDcyLjM5Miw0MS40MzgsOTAuMDQ3LDcyLjk1MmMxNy42NTYsMzEuNTMxLDI2LjQ4NCw3OS41NjIsMjYuNDg0LDE0NC4wOTV2NjEuODI4DQoJCWMwLDQyLjA2MiwxLjcwMyw3MC41NzcsNS4xMjUsODUuNTYyYzUuMTI1LDIzLjc1LDE3LjA3OCw0MS4yMzQsMzUuODc1LDUyLjQ2OXYyMy4xMDloLTIxMi4zMjgNCgkJYy01Ljc4MS0yMC40MDYtOS45MDYtMzYuODQ0LTEyLjM3NS00OS4zNDRjLTQuOTY5LTI1LjgxMi03LjY1Ni01Mi4yNS04LjA2Mi03OS4zMTJsLTEuMjM0LTg1LjU3OA0KCQljLTAuNzk3LTU4LjcwMy0xMC45NjktOTcuODQ0LTMwLjUzLTExNy40MDVjLTE5LjU2Mi0xOS41NjItNTYuMjItMjkuMzU5LTEwOS45NTMtMjkuMzU5aC0xODguNTE3djM2MWgtMTg4di05MjFIMTU0NS4zDQoJCUMxNjA4LjMsNTg2LjA4NSwxNjU2Ljc4NCw1OTQuMDA3LDE2OTAuNzIzLDYwOC41Njl6IE0xMjkyLjQyNSw3NDMuODM1djI0OGgyMDcuNTMxYzQxLjIxOSwwLDcyLjE0Mi01LDkyLjc2Ny0xNS4wMzENCgkJYzM2LjQ2OS0xNy41Myw1NC43MDItNTIuMTcyLDU0LjcwMi0xMDMuOTUzYzAtNTUuOTM4LTE3LjY0MS05My41MTYtNTIuOTIyLTExMi43MzNjLTE5LjgyOC0xMC44NDQtNDkuNTYyLTE2LjI4MS04OS4yMDMtMTYuMjgxDQoJCUwxMjkyLjQyNSw3NDMuODM1TDEyOTIuNDI1LDc0My44MzV6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==) 50% 50%/70% 70% no-repeat rgba(0,0,0,.35);", i.innerHTML += "border: 0;", i.innerHTML += "bottom: 0;", i.innerHTML += "cursor: pointer;", i.innerHTML += "min-width: 50px;", i.innerHTML += "min-height: 30px;", i.innerHTML += "padding-right: 5%;", i.innerHTML += "padding-top: 4%;", i.innerHTML += "transition: background-color .05s ease;", i.innerHTML += "-webkit-transition: background-color .05s ease;", i.innerHTML += "z-index: 9999;", i.innerHTML += "margin-right: 10px;}", i.innerHTML += ".a-enter-ar-button:active,.a-enter-ar-button:hover { background-color: #666;", i.innerHTML += "}", i.innerHTML += ".a-exit-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIyMDQ4cHgiIGhlaWdodD0iMjA0OHB4IiB2aWV3Qm94PSIwIDAgMjA0OCAyMDQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDQ4IDIwNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHRpdGxlPm1hc2s8L3RpdGxlPg0KPHJlY3QgeD0iNTYxLjI3MyIgeT0iNTg0LjgzNiIgZmlsbD0ibm9uZSIgd2lkdGg9IjEzODMuMTM5IiBoZWlnaHQ9IjEzODMuMTM5Ii8+DQo8ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICI+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTgwNi41MDgsMTUwNS4xNDhINTgyLjc3NGwyOTYuMDE2LTQ2OS4yNWwtMjgyLjAxNi00NTEuNzVoMjMwLjA0N2wxNjQuNDM4LDMwMC4wMTZsMTY4Ljk2OC0zMDAuMDE2DQoJCWgyMjIuNTQ3bC0yODIuMDE2LDQ0NC4yNWwzMDAuMDE2LDQ3Ni43NWgtMjMzLjg5MWwtMTc1LjUzMS0zMTQuMTU2TDgwNi41MDgsMTUwNS4xNDh6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==) 50% 50%/70% 70% no-repeat rgba(0,0,0,.35);", i.innerHTML += "border: 0;", i.innerHTML += "bottom: 0;", i.innerHTML += "cursor: pointer;", i.innerHTML += "min-width: 30px;", i.innerHTML += "min-height: 30px;", i.innerHTML += "padding-right: 5%;", i.innerHTML += "padding-top: 4%;", i.innerHTML += "transition: background-color .05s ease;", i.innerHTML += "-webkit-transition: background-color .05s ease;", i.innerHTML += "z-index: 9999;", i.innerHTML += "display: none;", i.innerHTML += "margin-right: 10px;}", i.innerHTML += ".a-exit-ar-button:active,.a-exit-ar-button:hover { background-color: #666;", i.innerHTML += "}", document.body.appendChild(i), this.enterAR = e.enterAR.bind(e), this.exitAR = e.exitAR.bind(e), this.insideLoader = !1, this.enterAREl = null, e.addEventListener("enter-vr", this.updateEnterARInterface.bind(this)), e.addEventListener("exit-vr", this.updateEnterARInterface.bind(this)), window.addEventListener("message", function(e) {
                    "loaderReady" === e.data.type && (t.insideLoader = !0, t.remove())
                })
            }
        },
        update: function() {
            var t = this.el;
            if (!this.data.enabled || this.insideLoader || "false" === AFRAME.utils.getUrlParameter("ui")) return this.remove();
            if (!this.enterAREl) {
                if (this.enterAREl = n(this.enterAR), this.exitAREl = s(this.exitAR), !document.getElementsByClassName("a-enter-vr")[0]) {
                    var e = document.createElement("div");
                    e.classList.add("a-enter-vr"), e.setAttribute("aframe-injected", ""), t.appendChild(e)
                }
                document.getElementsByClassName("a-enter-vr")[0].appendChild(this.enterAREl), document.getElementsByClassName("a-enter-vr")[0].appendChild(this.exitAREl), this.updateEnterARInterface()
            }
        },
        remove: function() {
            [this.enterAREl].forEach(function(t) {
                t && t.parentNode.removeChild(t)
            })
        },
        updateEnterARInterface: function() {
            this.toggleEnterARButtonIfNeeded()
        },
        toggleEnterARButtonIfNeeded: function() {
            var t = this.el;
            this.enterAREl && (t.is("vr-mode") ? (this.enterAREl.classList.add("a-hidden"), this.exitAREl.classList.add("a-hidden")) : (this.enterAREl.classList.remove("a-hidden"), this.exitAREl.classList.remove("a-hidden")))
        }
    })
}, function(t, e, i) {
    "use strict";
    AFRAME.registerComponent("xr", {
        schema: {
            vr: {
                default: !0
            },
            ar: {
                default: !0
            },
            magicWindow: {
                default: !0
            }
        },
        init: function() {
            this.realityChanged = this.realityChanged.bind(this), this.el.sceneEl.addEventListener("realityChanged", this.realityChanged), this.originalVisibility = this.el.getAttribute("visible")
        },
        update: function() {
            this.originalVisibility = this.el.getAttribute("visible"), this.el.setAttribute("visible", this.newVisibility)
        },
        realityChanged: function(t) {
            void 0 !== this.data[t.detail] && (this.data[t.detail] ? this.newVisibility = this.originalVisibility : this.newVisibility = !1, this.el.setAttribute("visible", this.newVisibility))
        }
    })
}, function(t, e, i) {
    "use strict";
    AFRAME.registerComponent("xranchor", {
        init: function() {
            this.anchorMatrix = new THREE.Matrix4, this.positionVec3 = new THREE.Vector3, this.rotationQuat = new THREE.Quaternion, this.rotationVec3 = new THREE.Vector3, this.el.sceneEl.addEventListener("updateFrame", this.updateFrame.bind(this))
        },
        updateFrame: function(t) {
            var e = t.detail,
                i = this.anchorOffset;
            if (i) {
                var n = e.getAnchor(i.anchorUID);
                if (null !== n) {
                    var s = this.anchorMatrix.fromArray(i.getOffsetTransform(n.coordinateSystem)),
                        r = this.positionVec3.setFromMatrixPosition(s);
                    this.el.setAttribute("position", {
                        x: r.x,
                        y: r.y,
                        z: r.z
                    });
                    var a = this.rotationQuat.setFromRotationMatrix(s),
                        o = this.rotationVec3.applyQuaternion(a);
                    this.el.setAttribute("rotation", {
                        x: o.x,
                        y: o.y,
                        z: o.z
                    })
                }
            }
        }
    })
}, function(t, e, i) {
    "use strict";
    AFRAME.registerComponent("reticle", {
        init: function() {
            this.el.setAttribute("visible", !1), this.el.sceneEl.addEventListener("updateFrame", this.updateFrame.bind(this)), this.el.setAttribute("rotation", {
                x: -90
            }), this.el.object3D.updateMatrix(), this.extraRotation = new THREE.Quaternion, this.extraRotation.setFromRotationMatrix(this.el.object3D.matrix), this.tapData = [.5, .5], this.onTouchStart = this.onTouchStart.bind(this)
        },
        onTouchStart: function(t) {
            if (!t.touches || 0 === t.touches.length) return void console.error("No touches on touch event", t);
            this.tapData = [t.touches[0].clientX / window.innerWidth, t.touches[0].clientY / window.innerHeight], this.el.emit("touched", t)
        },
        updateFrame: function(t) {
            var e = t.detail,
                i = e.hitTestNoAnchor(this.tapData[0], this.tapData[1]),
                n = new THREE.Matrix4,
                s = new THREE.Vector3,
                r = new THREE.Quaternion,
                a = new THREE.Vector3;
            i && i.length > 0 && (!1 === this.el.getAttribute("visible") && (this.el.setAttribute("visible", !0), this.el.emit("planeDetected"), window.addEventListener("touchstart", this.onTouchStart)), n.fromArray(i[0].modelMatrix), n.decompose(s, r, a), this.el.setAttribute("position", {
                x: s.x,
                y: s.y,
                z: s.z
            }), r.multiply(this.extraRotation), this.el.object3D.quaternion.copy(r))
        }
    })
}]);