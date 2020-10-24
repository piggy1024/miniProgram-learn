"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames2 = _interopRequireDefault(require("../helpers/classNames")),
    _styleToCssString = _interopRequireDefault(require("../helpers/styleToCssString")), _index = require("../index");

function _interopRequireDefault(t) {
    return t && t.__esModule ? t : {default: t}
}

function _defineProperty(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t
}

function _slicedToArray(t, e) {
    return _arrayWithHoles(t) || _iterableToArrayLimit(t, e) || _nonIterableRest()
}

function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArrayLimit(t, e) {
    var o = [], r = !0, l = !1, i = void 0;
    try {
        for (var n, a = t[Symbol.iterator](); !(r = (n = a.next()).done) && (o.push(n.value), !e || o.length !== e); r = !0) ;
    } catch (t) {
        l = !0, i = t
    } finally {
        try {
            r || null == a.return || a.return()
        } finally {
            if (l) throw i
        }
    }
    return o
}

function _arrayWithHoles(t) {
    if (Array.isArray(t)) return t
}

var getPlacements = function (t, e) {
    var o = _slicedToArray(0 < arguments.length && void 0 !== t ? t : rects, 3), r = o[0], l = o[1], i = o[2];
    switch (1 < arguments.length && void 0 !== e ? e : "top") {
        case"topLeft":
            return {top: l.scrollTop + r.top - i.height - 4, left: l.scrollLeft + r.left};
        case"top":
            return {top: l.scrollTop + r.top - i.height - 4, left: l.scrollLeft + r.left + (r.width - i.width) / 2};
        case"topRight":
            return {top: l.scrollTop + r.top - i.height - 4, left: l.scrollLeft + r.left + r.width - i.width};
        case"rightTop":
            return {top: l.scrollTop + r.top, left: l.scrollLeft + r.left + r.width + 4};
        case"right":
            return {top: l.scrollTop + r.top + (r.height - i.height) / 2, left: l.scrollLeft + r.left + r.width + 4};
        case"rightBottom":
            return {top: l.scrollTop + r.top + r.height - i.height, left: l.scrollLeft + r.left + r.width + 4};
        case"bottomRight":
            return {top: l.scrollTop + r.top + r.height + 4, left: l.scrollLeft + r.left + r.width - i.width};
        case"bottom":
            return {top: l.scrollTop + r.top + r.height + 4, left: l.scrollLeft + r.left + (r.width - i.width) / 2};
        case"bottomLeft":
            return {top: l.scrollTop + r.top + r.height + 4, left: l.scrollLeft + r.left};
        case"leftBottom":
            return {top: l.scrollTop + r.top + r.height - i.height, left: l.scrollLeft + r.left - i.width - 4};
        case"left":
            return {top: l.scrollTop + r.top + (r.height - i.height) / 2, left: l.scrollLeft + r.left - i.width - 4};
        case"leftTop":
            return {top: l.scrollTop + r.top, left: l.scrollLeft + r.left - i.width - 4};
        default:
            return {left: 0, top: 0}
    }
};
(0, _baseComponent.default)({
    properties: {
        prefixCls: {type: String, value: "wux-popover"},
        classNames: {type: null, value: "wux-animate--fadeIn"},
        theme: {type: String, value: "light"},
        title: {type: String, value: ""},
        content: {type: String, value: ""},
        placement: {type: String, value: "top"},
        trigger: {type: String, value: "click"},
        bodyStyle: {
            type: [String, Object], value: "", observer: function (t) {
                this.setData({extStyle: (0, _styleToCssString.default)(t)})
            }
        },
        defaultVisible: {type: Boolean, value: !1},
        visible: {
            type: Boolean, value: !1, observer: function (t) {
                this.data.controlled && this.updated(t)
            }
        },
        controlled: {type: Boolean, value: !1},
        mask: {type: Boolean, value: !1},
        maskClosable: {type: Boolean, value: !0}
    },
    data: {extStyle: "", popoverStyle: "", popoverVisible: !1},
    computed: {
        classes: ["prefixCls, theme, placement", function (t, e, o) {
            var r;
            return {
                wrap: (0, _classNames2.default)(t, (_defineProperty(r = {}, "".concat(t, "--theme-").concat(e), e), _defineProperty(r, "".concat(t, "--placement-").concat(o), o), r)),
                content: "".concat(t, "__content"),
                arrow: "".concat(t, "__arrow"),
                inner: "".concat(t, "__inner"),
                title: "".concat(t, "__title"),
                innerContent: "".concat(t, "__inner-content"),
                element: "".concat(t, "__element")
            }
        }]
    },
    methods: {
        updated: function (t) {
            this.data.popoverVisible !== t && (this.setData({popoverVisible: t}), this.setBackdropVisible(t))
        }, getPopoverStyle: function () {
            var r = this, t = this.data, e = t.prefixCls, l = t.placement, o = wx.createSelectorQuery().in(this);
            o.select(".".concat(e, "__element")).boundingClientRect(), o.selectViewport().scrollOffset(), o.select(".".concat(e)).boundingClientRect(), o.exec(function (t) {
                if (!t.filter(function (t) {
                    return !t
                }).length) {
                    var e = getPlacements(t, l), o = (0, _styleToCssString.default)(e);
                    r.setData({popoverStyle: o})
                }
            })
        }, onEnter: function () {
            this.getPopoverStyle()
        }, onChange: function () {
            var t = this.data, e = !t.popoverVisible;
            t.controlled || this.updated(e), this.triggerEvent("change", {visible: e})
        }, onClick: function () {
            "click" === this.data.trigger && this.onChange()
        }, setBackdropVisible: function (t) {
            this.data.mask && this.$wuxBackdrop && this.$wuxBackdrop[t ? "retain" : "release"]()
        }, onMaskClick: function () {
            var t = this.data, e = t.maskClosable, o = t.popoverVisible;
            e && o && this.onChange()
        }
    },
    ready: function () {
        var t = this.data, e = t.defaultVisible, o = t.visible, r = t.controlled ? o : e;
        this.data.mask && (this.$wuxBackdrop = (0, _index.$wuxBackdrop)("#wux-backdrop", this)), this.updated(r)
    }
});
