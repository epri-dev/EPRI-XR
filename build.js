! function(e) {
    function t(n) {
        if (i[n]) return i[n].exports;
        var o = i[n] = {
            exports: {},
            id: n,
            loaded: !1
        };
        return e[n].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
    }
    var i = {};
    return t.m = e, t.c = i, t.p = "", t(0)
}([function(e, t, i) {
    i(1), i(2), i(3)
}, function(e, t) {
    AFRAME.registerComponent("intersect-color-change", {
        init: function() {
            var e = this.el,
                t = e.getAttribute("material");
            if (t) {
                t.color;
                e.setAttribute("initialColor", t.color);
                var i = this;
                e.addEventListener("mousedown", function(t) {
                    e.setAttribute("material", "color", "#EF2D5E")
                }), e.addEventListener("mouseup", function(t) {
                    e.setAttribute("material", "color", i.isMouseEnter ? "#cccccc" : e.getAttribute("initialColor"))
                }), e.addEventListener("mouseenter", function() {
                    e.setAttribute("material", "color", "#cccccc"), i.isMouseEnter = !0
                }), e.addEventListener("mouseleave", function() {
                    e.setAttribute("material", "color", e.getAttribute("initialColor")), i.isMouseEnter = !1
                })
            }
        }
    })
}, function(e, t) {
    AFRAME.registerComponent("store-controls", {
        schema: {
            hand: {
                default: "left"
            }
        },
        init: function() {
            var e = this.el,
                t = this;
            e.addEventListener("scale", function(e) {}), t.touchStarted = !1, e.addEventListener("startScale", function() {
                t.touchStarted = !0
            })
        }
    })
}, function(e, t) {
    AFRAME.registerSystem("store", {
        init: function() {
            var e = {
                behaviours: {},
                mappings: {
                    store: {
                        common: {
                            "grip.down": "undo",
                            "trigger.changed": "select"
                        },
                        "vive-controls": {
                            "axis.move": "scale",
                            "trackpad.touchstart": "startScale",
                            "menu.down": "toggleMenu"
                        },
                        "daydream-controls": {
                            "trackpad.changed": "scale",
                            "trackpad.down": "startScale",
                            "menu.down": "toggleMenu"
                        },
                        "oculus-touch-controls": {
                            "axis.move": "scale",
                            "abutton.down": "toggleMenu",
                            "xbutton.down": "toggleMenu"
                        },
                        "windows-motion-controls": {
                            "axis.move": "scale",
                            "menu.down": "toggleMenu"
                        }
                    }
                }
            };
            this.pinDetected = !1, this.pinSelected = !1, this.colorArr = [6736540, 16406404, 5092817], this.currentReality = "magicWindow", this.meshContainer = document.querySelector("#meshContainer"), this.meshContainerOrigPosition = this.meshContainer.getAttribute("position"), this.reticle = document.querySelector("[reticle]"), this.planeDetected = this.planeDetected.bind(this), this.touched = this.touched.bind(this), this.reticle.addEventListener("planeDetected", this.planeDetected), this.reticle.addEventListener("touched", this.touched), this.el.sceneEl.addEventListener("realityChanged", this.realityChanged.bind(this)), this.el.sceneEl.addEventListener("xrInitialized", this.xrInitialized.bind(this)), this.addEvents();
            var t = this;
            this.sceneEl.addEventListener("loaded", function() {
                AFRAME.registerInputMappings(e), AFRAME.currentInputMapping = "store", t.flatMaterials(), t.addStorePanel(), t.hasVRDisplays = !1, navigator.getVRDisplays().then(function(e) {
                    e.length && (e[0].displayName.indexOf("Cardboard") !== -1 ? t.hideVRIcon() : (t.hasVRDisplays = !0, t.replaceVRIcon()))
                })
            })
        },
        realityChanged: function(e) {
            e.detail !== this.currentReality && (this.currentReality = e.detail, this.changeReality())
        },
        changeReality: function() {
            var e = document.getElementsByClassName("productOption");
            switch (this.currentReality) {
                case "ar":
                    document.getElementById("header").classList.add("ar"), document.getElementById("title").style.display = "none", document.getElementById("visualSheet").classList.add("ar"), document.getElementById("content3D").classList.add("ar"), document.getElementById("productOptions").classList.add("ar");
                    for (var t = 0; t < e.length; t++) e[t].classList.add("ar");
                    document.getElementById("brand").style.display = "none", document.getElementById("productName").style.display = "none", document.getElementById("price").style.display = "none", document.getElementById("comments").style.display = "none", document.getElementById("thumbs").classList.add("ar"), document.getElementById("buttonCart").classList.add("ar"), document.getElementById("footer").style.display = "none", this.pinSelected ? (document.getElementById("productOptions").style.display = "flex", document.getElementById("container").classList.add("ar")) : (document.getElementById("arui").style.display = "block", document.getElementById("header").style.display = "none", document.getElementById("productOptions").style.display = "none", document.getElementById("buttonCart").style.display = "none", this.meshContainer.setAttribute("visible", !1)), this.pinDetected && this.planeDetected();
                    break;
                case "magicWindow":
                    document.getElementById("header").classList.remove("ar"), document.getElementById("title").style.display = "block", document.getElementById("visualSheet").classList.remove("ar"), document.getElementById("content3D").classList.remove("ar"), document.getElementById("productOptions").classList.remove("ar");
                    for (var t = 0; t < e.length; t++) e[t].classList.remove("ar");
                    document.getElementById("brand").style.display = "block", document.getElementById("productName").style.display = "block", document.getElementById("price").style.display = "block", document.getElementById("comments").style.display = "block", document.getElementById("thumbs").classList.remove("ar"), document.getElementById("buttonCart").classList.remove("ar"), document.getElementById("container").classList.remove("ar"), document.getElementById("footer").style.display = "block", document.getElementById("header").style.display = "block", document.getElementById("productOptions").style.display = "block", document.getElementById("buttonCart").style.display = "block", document.getElementById("arui").style.display = "none", this.meshContainer.setAttribute("visible", !0), this.meshContainer.setAttribute("position", this.meshContainerOrigPosition), this.pinSelected = !1, this.reticleParent && this.reticleParent.appendChild(this.reticle), this.reticle.setAttribute("visible", !1), this.storePanelVR.setAttribute("visible", !1);
                    break;
                case "vr":
                    this.storePanelVR.setAttribute("visible", !0)
            }
        },
        addEvents: function() {
            this.isAdded = !1, this.thumbSelected = 2, this.shapeSelected = 0, this.colorSelected = 0, document.getElementById("thumb0").addEventListener("click", this.thumb0Clicked.bind(this)), document.getElementById("thumb1").addEventListener("click", this.thumb1Clicked.bind(this)), document.getElementById("thumb2").addEventListener("click", this.thumb2Clicked.bind(this)), this.shape0Clicked = this.shape0Clicked.bind(this), this.shape1Clicked = this.shape1Clicked.bind(this), this.shape2Clicked = this.shape2Clicked.bind(this), document.getElementById("shape0").addEventListener("click", this.shape0Clicked.bind(this)), document.getElementById("shape1").addEventListener("click", this.shape1Clicked.bind(this)), document.getElementById("shape2").addEventListener("click", this.shape2Clicked.bind(this)), this.color0Clicked = this.color0Clicked.bind(this), this.color1Clicked = this.color1Clicked.bind(this), this.color2Clicked = this.color2Clicked.bind(this), document.getElementById("color0").addEventListener("click", this.color0Clicked.bind(this)), document.getElementById("color1").addEventListener("click", this.color1Clicked.bind(this)), document.getElementById("color2").addEventListener("click", this.color2Clicked.bind(this)), this.buttonCartClicked = this.buttonCartClicked.bind(this), document.getElementById("buttonCart").addEventListener("click", this.buttonCartClicked)
        },
        thumb0Clicked: function(e) {
            this.removeSelected(), document.getElementById("thumb0").classList.add("selected"), document.getElementsByTagName("a-scene")[0].style.display = "none", document.getElementById("content3D").style.background = "url(assets/images/product-" + this.shapeSelected + "-" + this.colorSelected + "-0.png) no-repeat center #ffffff", this.thumbSelected = 0
        },
        thumb1Clicked: function(e) {
            this.removeSelected(), document.getElementById("thumb1").classList.add("selected"), document.getElementsByTagName("a-scene")[0].style.display = "none", document.getElementById("content3D").style.background = "url(assets/images/product-" + this.shapeSelected + "-0-1.png) no-repeat center #ffffff", this.thumbSelected = 1
        },
        thumb2Clicked: function(e) {
            this.removeSelected(), document.getElementById("content3D").style.background = "none", document.getElementsByTagName("a-scene")[0].style.display = "block", document.getElementById("thumb2").classList.add("selected"), this.thumbSelected = 2
        },
        removeSelected: function() {
            document.getElementById("thumb" + this.thumbSelected).classList.remove("selected")
        },
        shape0Clicked: function(e) {
            this.changeShape(0), document.querySelector("#shapeBar-vr").getAttribute("position").x = -.75
        },
        shape1Clicked: function(e) {
            this.changeShape(1), document.querySelector("#shapeBar-vr").getAttribute("position").x = -.5
        },
        shape2Clicked: function(e) {
            this.changeShape(2), document.querySelector("#shapeBar-vr").getAttribute("position").x = -.25
        },
        changeShape: function(e) {
            document.querySelector("#geo0").setAttribute("visible", !1), document.querySelector("#geo1").setAttribute("visible", !1), document.querySelector("#geo2").setAttribute("visible", !1), document.getElementById("shape" + this.shapeSelected).classList.remove("optionSelected"), this.shapeSelected = e, document.querySelector("#geo" + e).setAttribute("visible", !0), document.getElementById("shape" + e).classList.add("optionSelected"), this.updateThumbs()
        },
        color0Clicked: function(e) {
            this.changeColor(0), document.querySelector("#colorBar-vr").getAttribute("position").x = .25
        },
        color1Clicked: function(e) {
            this.changeColor(1), document.querySelector("#colorBar-vr").getAttribute("position").x = .5
        },
        color2Clicked: function(e) {
            this.changeColor(2), document.querySelector("#colorBar-vr").getAttribute("position").x = .75
        },
        changeColor: function(e) {
            document.getElementById("color" + this.colorSelected).classList.remove("optionSelected"), document.querySelector("#geo0").setAttribute("material", "color", this.colorArr[e]), document.querySelector("#geo1").setAttribute("material", "color", this.colorArr[e]), document.querySelector("#geo2").setAttribute("material", "color", this.colorArr[e]), document.getElementById("color" + e).classList.add("optionSelected"), this.colorSelected = e, this.updateThumbs(), this.flatMaterials()
        },
        updateThumbs: function() {
            document.querySelector("#thumb0").querySelector("img").src = "assets/images/thumbs-" + this.shapeSelected + "-" + this.colorSelected + "-0.png", document.querySelector("#thumb1").querySelector("img").src = "assets/images/thumbs-" + this.shapeSelected + "-0-1.png", document.querySelector("#thumb2").querySelector("img").src = "assets/images/thumbs-" + this.shapeSelected + "-" + this.colorSelected + "-2.png", 0 === this.thumbSelected ? document.getElementById("content3D").style.background = "url(assets/images/product-" + this.shapeSelected + "-" + this.colorSelected + "-0.png) no-repeat center #ffffff" : 1 === this.thumbSelected && (document.getElementById("content3D").style.background = "url(assets/images/product-" + this.shapeSelected + "-0-1.png) no-repeat center #ffffff")
        },
        buttonCartClicked: function() {
            this.isAdded ? (document.getElementById("cart").innerHTML = "(0) Cart", document.getElementById("cart").style.color = "#181818", document.getElementById("cart").style.fontWeight = "normal", document.getElementById("buttonCart").innerHTML = "Add to cart", document.getElementById("buttonCart").style.backgroundColor = "#181818", document.querySelector("#addBtn-vr-bg").setAttribute("initialColor", "#181818"), document.querySelector("#addBtn-vr-text").setAttribute("text", {
                value: "Add to cart"
            }), document.querySelector("#cart-vr").setAttribute("text", {
                value: "(0) Cart"
            })) : (document.getElementById("cart").innerHTML = "(1) Cart", document.getElementById("cart").style.color = "#b7374c", document.getElementById("cart").style.fontWeight = "bolder", document.getElementById("buttonCart").innerHTML = "Added!", document.getElementById("buttonCart").style.backgroundColor = "#b7374c", document.querySelector("#addBtn-vr-bg").setAttribute("initialColor", "#b7374c"), document.querySelector("#addBtn-vr-text").setAttribute("text", {
                value: "Added!"
            }), document.querySelector("#cart-vr").setAttribute("text", {
                value: "(1) Cart"
            })), this.isAdded = !this.isAdded
        },
        flatMaterials: function() {
            document.querySelector("#geo0").getObject3D("mesh").material.flatShading = !0, document.querySelector("#geo2").getObject3D("mesh").material.flatShading = !0
        },
        addStorePanel: function() {
            var e = document.createElement("a-entity");
            e.setAttribute("id", "storePanel"), e.setAttribute("position", "1.5 1.7 -2.75"), e.setAttribute("rotation", "0 -30 0"), e.setAttribute("visible", !1), this.storePanelVR = e, this.el.sceneEl.appendChild(e), this.addPlane({
                id: "main-vr",
                width: 2,
                height: 1.5,
                color: "white",
                parent: e
            }), this.addText({
                text: "Mozilla",
                id: "brand-vr",
                font: "OpenSans-Bold",
                size: 2,
                color: "#181818",
                position: "0.15 0.55 0",
                parent: e
            }), this.addText({
                text: "Basic Mesh",
                id: "product-vr",
                font: "OpenSans-Regular",
                size: 3,
                color: "#181818",
                position: "0.65 0.35 0",
                parent: e
            }), this.addText({
                text: "(0) Cart",
                id: "cart-vr",
                font: "OpenSans-Regular",
                size: 1.8,
                color: "#181818",
                position: "1.5 0.4 0",
                parent: e
            }), this.addText({
                text: "Shape",
                id: "shape-vr",
                font: "OpenSans-Regular",
                size: 1.8,
                color: "#181818",
                position: "0.06 0.2 0",
                parent: e
            }), this.addImage({
                id: "shape0-vr",
                src: "shape0",
                size: .25,
                position: "-0.75 0 0.01",
                collidable: !0,
                onclick: this.shape0Clicked,
                parent: e
            }), this.addImage({
                id: "shape1-vr",
                src: "shape1",
                size: .25,
                position: "-0.5 0 0.01",
                collidable: !0,
                onclick: this.shape1Clicked,
                parent: e
            }), this.addImage({
                id: "shape2-vr",
                src: "shape2",
                size: .25,
                position: "-0.25 0 0.01",
                collidable: !0,
                onclick: this.shape2Clicked,
                parent: e
            }), this.addPlane({
                id: "shapeBar-vr",
                width: .2,
                height: .01,
                position: "-0.75 -0.15 0.01",
                color: "#181818",
                parent: e
            }), this.addText({
                text: "Color",
                id: "color-vr",
                font: "OpenSans-Regular",
                size: 1.8,
                color: "#181818",
                position: "1.06 0.2 0",
                parent: e
            }), this.addImage({
                id: "color0-vr",
                src: "color0",
                size: .25,
                position: "0.25 0 0.01",
                collidable: !0,
                onclick: this.color0Clicked,
                parent: e
            }), this.addImage({
                id: "color1-vr",
                src: "color1",
                size: .25,
                position: "0.5 0 0.01",
                collidable: !0,
                onclick: this.color1Clicked,
                parent: e
            }), this.addImage({
                id: "color2-vr",
                src: "color2",
                size: .25,
                position: "0.75 0 0.01",
                collidable: !0,
                onclick: this.color2Clicked,
                parent: e
            }), this.addPlane({
                id: "colorBar-vr",
                width: .2,
                height: .01,
                position: "0.25 -0.15 0.01",
                color: "#181818",
                parent: e
            }), this.addText({
                text: "Price: $0.00 + Shipping & Import Fees",
                id: "price-vr",
                font: "OpenSans-Regular",
                size: 1.2,
                color: "#181818",
                position: "-0.25 -0.3 0",
                parent: e
            }), this.addButton({
                id: "addBtn-vr",
                text: "Add to cart",
                textColor: "#ffffff",
                width: .8,
                height: .2,
                color: "#181818",
                parent: e,
                position: "-0.45 -0.5 0.01",
                onclick: this.buttonCartClicked
            })
        },
        addPlane: function(e) {
            var t = document.createElement("a-entity");
            t.setAttribute("geometry", {
                primitive: "plane",
                width: e.width,
                height: e.height
            }), t.setAttribute("id", e.id), t.setAttribute("position", e.position || "0 0 0"), t.setAttribute("material", {
                shader: "flat",
                transparent: !0,
                color: e.color,
                side: "double"
            }), e.collidable && (t.setAttribute("class", "collidable"), t.setAttribute("intersect-color-change", "")), e.parent.appendChild(t)
        },
        addText: function(e) {
            var t = document.createElement("a-entity");
            t.setAttribute("text", {
                value: e.text,
                font: "assets/fonts/" + e.font + ".json",
                align: e.align || "left",
                shader: "msdf",
                color: e.color
            }), t.setAttribute("id", e.id), t.setAttribute("scale", {
                x: e.size,
                y: e.size,
                z: e.size
            }), e.collidable && (t.setAttribute("class", "collidable"), t.setAttribute("intersect-color-change", "")), t.setAttribute("position", e.position || "0 0 0"), e.parent.appendChild(t)
        },
        addImage: function(e) {
            var t = document.createElement("a-entity");
            t.setAttribute("id", e.id), t.setAttribute("geometry", {
                primitive: "plane",
                width: e.size,
                height: e.size
            }), e.onclick && t.addEventListener("mousedown", function(t) {
                e.onclick()
            }), t.setAttribute("material", {
                shader: "flat",
                transparent: !0,
                src: "assets/images/" + e.src + ".png"
            }), e.collidable && (t.setAttribute("class", "collidable"), t.setAttribute("intersect-color-change", "")), t.setAttribute("position", e.position || "0 0 0"), e.parent.appendChild(t)
        },
        addButton: function(e) {
            var t = document.createElement("a-entity");
            t.setAttribute("id", e.id), e.parent.appendChild(t), t.setAttribute("position", e.position || "0 0 0"), e.onclick && t.addEventListener("mousedown", function(t) {
                e.onclick()
            }), this.addPlane({
                id: e.id + "-bg",
                width: e.width,
                height: e.height,
                color: e.color,
                collidable: !0,
                parent: t
            }), this.addText({
                text: e.text,
                id: e.id + "-text",
                font: "OpenSans-Bold",
                align: "center",
                position: "0 -0.05 0",
                size: 1.4,
                color: e.textColor,
                collidable: !0,
                parent: t
            })
        },
        xrInitialized: function() {
            if ("false" !== AFRAME.utils.getUrlParameter("ui")) {
                var e = document.createElement("style");
                e.innerHTML = ".a-enter-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTg0Ny43NjEsMTMxNi40OTh2LTcxLjFoNjkuM2wtMzYtOTcuMTk5SDY0NS4yNjJsLTM4LjY5OSw5Ny4xOTloNzYuNXY3MS4xaC0yMTMuM3YtNzEuMWg1NGwxODQuNDk5LTQ0Mi43OTdoLTkwdi03MS4xMDFoMTc2LjM5OWwyMTAuNTk5LDUxMy44OTdoNTcuNjAxdjcxLjFIODQ3Ljc2MXogTTc2OC41NjIsODQ5LjQwMWgtNS40bC05My42LDIzNy41OThIODU3LjY2TDc2OC41NjIsODQ5LjQwMXoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQ4NC4wNSwxMzE2LjQ5OGwtMTIzLjI5OS0yMzguNDk5aC0xMTEuNnYxNjcuMzk5aDczLjh2NzEuMWgtMjI2Ljc5OXYtNzEuMWg3MS4xVjgwMi42MDJoLTcxLjF2LTcxLjEwMWgyNTYuNDk5YzE0NC44OTcsMCwyMDkuNjk4LDY3LjUsMjA5LjY5OCwxNjkuMTk5YzAsNzYuNS00NC4xMDEsMTM4LjU5OS0xMjEuNSwxNjEuMDk5bDk3LjE5OSwxODMuNjAxaDcyLjg5OXY3MS4xTDE0ODQuMDUsMTMxNi40OThMMTQ4NC4wNSwxMzE2LjQ5OHogTTEzNDAuMDUxLDgwMi42MDJoLTkwLjg5OHYyMDguNzk4aDkxLjhjOTguMSwwLDEzNC4wOTktNDAuNSwxMzQuMDk5LTEwOC44OTlDMTQ3NS4wNSw4MzEuNDAxLDE0MzcuMjUsODAyLjYwMiwxMzQwLjA1MSw4MDIuNjAyeiIvPjwvZz48L3N2Zz4=) 100% 100%/100% 100% no-repeat;", e.innerHTML += "border: 0;", e.innerHTML += "bottom: 0;", e.innerHTML += "cursor: pointer;", e.innerHTML += "min-width: 40px;", e.innerHTML += "min-height: 40px;", e.innerHTML += "padding-right: 5%;", e.innerHTML += "padding-top: 4%;", e.innerHTML += "position: absolute;", e.innerHTML += "right: 0;", e.innerHTML += "z-index: 9999;", e.innerHTML += "margin-right: 5px;}", e.innerHTML += ".a-enter-ar-button:active,.a-enter-ar-button:hover {opacity: 0.5}", e.innerHTML += ".a-exit-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwOTUuMTA0LDEzMTYuNDk4di03MS4xaDYzLjg5OWwtMTM1Ljg5OS0xNzYuMzk5bC0xMjcuNzk5LDE3Ni4zOTloNjIuOTk5djcxLjFINzQ0LjEwNXYtNzEuMWg2MS4xOTlsMTc2LjM5OS0yMzAuMzk5TDgxMi41MDUsODAyLjYwMmgtNTcuNnYtNzEuMTAxaDIwOS42OTh2NzEuMTAxaC01Ny42TDEwMzAuMzAzLDk2MWwxMTYuMS0xNTguMzk4aC01My45OTl2LTcxLjEwMWgyMDYuOTk4djcxLjEwMWgtNjIuMTAxTDEwNzEuNzAyLDEwMTMuMmwxODMuNTk5LDIzMi4xOTloNTR2NzEuMUwxMDk1LjEwNCwxMzE2LjQ5OEwxMDk1LjEwNCwxMzE2LjQ5OHoiLz48L2c+PC9zdmc+) 100% 100%/100% 100% no-repeat !important;", e.innerHTML += "border: 0;", e.innerHTML += "top: 20px;", e.innerHTML += "bottom: initial;", e.innerHTML += "position: fixed;", e.innerHTML += "left: 10px;", e.innerHTML += "cursor: pointer;", e.innerHTML += "min-width: 40px;", e.innerHTML += "min-height: 40px;", e.innerHTML += "padding-right: 5%;", e.innerHTML += "padding-top: 4%;", e.innerHTML += "transition: background-color .05s ease;", e.innerHTML += "-webkit-transition: background-color .05s ease;", e.innerHTML += "z-index: 9999;", e.innerHTML += "display: none;", e.innerHTML += "margin-right: 0px;}", e.innerHTML += ".a-enter-ar-button:active,.a-enter-ar-button:hover {opacity: 0.5}", e.innerHTML += ".a-enter-vr-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTYwOS4xMDcsNjI1Ljc2OGg0MDIuOTY4djc0LjcwN0g2NzYuNzgzdjI4My40NDdoLTY3LjY3NlY2MjUuNzY4eiIvPjwvZz48Zz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQzOC44OTMsMTQyMi4yMzJoLTQwMi45Njl2LTc0LjcwN2gzMzUuMjkzdi0yODMuNDQ2aDY3LjY3NlYxNDIyLjIzMnoiLz48L2c+PC9nPjwvc3ZnPg==) 100% 100%/100% 100% no-repeat;", e.innerHTML += "border: 0;", e.innerHTML += "bottom: 0;", e.innerHTML += "cursor: pointer;", e.innerHTML += "min-width: 40px;", e.innerHTML += "min-height: 40px;", e.innerHTML += "padding-right: 5%;", e.innerHTML += "padding-top: 4%;", e.innerHTML += "position: absolute;", e.innerHTML += "right: 0;", e.innerHTML += "z-index: 9999;", e.innerHTML += "margin-right: 5px;}", e.innerHTML += ".a-enter-vr-button:active,.a-enter-vr-button:hover {background-color: rgba(0,0,0,0);opacity: 0.5}", document.body.appendChild(e), this.hasVRDisplays && this.replaceVRIcon(), this.el.sceneEl.renderer.xr.totalSupportedDisplays && this.showVRIcon()
            }
        },
        hideVRIcon: function() {
            var e = document.createElement("style");
            e.innerHTML = ".a-enter-vr {display: none;}", document.body.appendChild(e)
        },
        showVRIcon: function() {
            var e = document.createElement("style");
            e.innerHTML = ".a-enter-vr {display: block;}", document.body.appendChild(e)
        },
        replaceVRIcon: function() {
            var e = document.createElement("style");
            e.innerHTML = ".a-enter-vr-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwMDMuNDYsODAyLjYwMmwtMjEwLjU5OSw1MTMuODk2aC02Mi4xMDFMNTIxLjA2Miw4MDIuNjAyaC01Ni42OTl2LTcxLjEwMWgyMTkuNTk5djcxLjEwMWgtNzIuODk5bDE1MywzOTAuNTk3aDUuMzk4TDkxOS43Niw4MDIuNjAyaC03NS42di03MS4xMDFoMjEzLjI5OXY3MS4xMDFIMTAwMy40NnoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQ4My4xNTcsMTMxNi40OThsLTEyMy4zLTIzOC40OTloLTExMS42djE2Ny4zOTloNzMuODAxdjcxLjFIMTA5NS4yNnYtNzEuMWg3MS4xMDFWODAyLjYwMmgtNzEuMTAxdi03MS4xMDFoMjU2LjQ5OWMxNDQuODk4LDAsMjA5LjY5OCw2Ny41LDIwOS42OTgsMTY5LjE5OWMwLDc2LjUtNDQuMSwxMzguNTk5LTEyMS40OTksMTYxLjA5OWw5Ny4xOTksMTgzLjYwMWg3Mi44OTl2NzEuMUwxNDgzLjE1NywxMzE2LjQ5OEwxNDgzLjE1NywxMzE2LjQ5OHogTTEzMzkuMTU4LDgwMi42MDJoLTkwLjg5OXYyMDguNzk4aDkxLjhjOTguMTAxLDAsMTM0LjEtNDAuNSwxMzQuMS0xMDguODk5QzE0NzQuMTU3LDgzMS40MDEsMTQzNi4zNTcsODAyLjYwMiwxMzM5LjE1OCw4MDIuNjAyeiIvPjwvZz48L3N2Zz4=) 100% 100%/100% 100% no-repeat;", e.innerHTML += "border: 0;", e.innerHTML += "bottom: 0;", e.innerHTML += "cursor: pointer;", e.innerHTML += "min-width: 40px;", e.innerHTML += "min-height: 40px;", e.innerHTML += "padding-right: 5%;", e.innerHTML += "padding-top: 4%;", e.innerHTML += "position: absolute;", e.innerHTML += "right: 0;", e.innerHTML += "z-index: 9999;", e.innerHTML += "margin-right: 5px;}", e.innerHTML += ".a-enter-vr-button:active,.a-enter-vr-button:hover {background-color: rgba(0,0,0,0);opacity: 0.5}", document.body.appendChild(e)
        },
        planeDetected: function() {
            this.pinSelected ? this.showARUI() : this.pinDetected ? this.reticle.addEventListener("touched", this.touched) : (this.pinDetected = !0, document.querySelector("#arui-step1").style.display = "none", document.querySelector("#arui-step2").style.display = "block")
        },
        touched: function(e) {
            "submit" !== e.detail.target.type && (this.pinSelected = !0, this.reticleParent = this.reticle.parentNode, this.reticle.parentNode.removeChild(this.reticle), this.meshContainer.setAttribute("visible", !0), this.meshContainer.setAttribute("position", this.reticle.getAttribute("position")), this.showARUI()), this.reticle.removeEventListener("touched", this.touched)
        },
        showARUI: function() {
            document.getElementById("arui").style.display = "none", document.getElementById("header").style.display = "block", document.getElementById("productOptions").style.display = "flex", document.getElementById("buttonCart").style.display = "block", document.getElementById("container").classList.add("ar")
        }
    })
}]);