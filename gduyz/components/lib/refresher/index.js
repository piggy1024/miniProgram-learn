"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
    _classNames5 = _interopRequireDefault(require("../helpers/classNames"));

function _interopRequireDefault(t) {
    return t && t.__esModule ? t : {default: t}
}

function _defineProperty(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t
}

var defaultStyle = "transition: transform .4s; transform: translate3d(0px, 0px, 0px) scale(1);";
(0, _baseComponent.default)({
    properties: {
        prefixCls: {type: String, value: "wux-refresher"},
        pullingIcon: {type: String, value: ""},
        pullingText: {type: String, value: "下拉刷新"},
        refreshingIcon: {type: String, value: ""},
        refreshingText: {type: String, value: "正在刷新"},
        disablePullingRotation: {type: Boolean, value: !1},
        distance: {type: Number, value: 30},
        prefixLCls: {type: String, value: "wux-loader"},
        isShowLoadingText: {type: Boolean, value: !1},
        loadingText: {type: String, value: "正在加载"},
        loadNoDataText: {type: String, value: "没有更多数据"},
        scrollTop: {type: Number, value: 0, observer: "onScroll"}
    },
    data: {
        style: defaultStyle,
        visible: !1,
        active: !1,
        refreshing: !1,
        tail: !1,
        lVisible: !1,
        noData: !1,
        windowHeight: 0,
        newContentHeight: 0,
        oldContentHeight: 0,
        loading: !1
    },
    computed: {
        classes: ["prefixCls, pullingText, pullingIcon, disablePullingRotation, refreshingText, refreshingIcon, visible, active, refreshing, tail, prefixLCls, loading, noData", function (t, e, i, n, a, s, o, r, c, l, h, d, f) {
            var u, g;
            return {
                wrap: (0, _classNames5.default)(t, (_defineProperty(u = {}, "".concat(t, "--hidden"), !o), _defineProperty(u, "".concat(t, "--visible"), o), _defineProperty(u, "".concat(t, "--active"), r), _defineProperty(u, "".concat(t, "--refreshing"), c), _defineProperty(u, "".concat(t, "--refreshing-tail"), l), u)),
                cover: "".concat(t, "__cover"),
                content: (0, _classNames5.default)("".concat(t, "__content"), _defineProperty({}, "".concat(t, "__content--text"), e || a)),
                iconPulling: (0, _classNames5.default)("".concat(t, "__icon-pulling"), _defineProperty({}, "".concat(t, "__icon-pulling--disabled"), n)),
                textPulling: "".concat(t, "__text-pulling"),
                iconRefreshing: "".concat(t, "__icon-refreshing"),
                textRefreshing: "".concat(t, "__text-refreshing"),
                pIcon: i || "".concat(t, "__icon--arrow-down"),
                rIcon: s || "".concat(t, "__icon--refresher"),
                lWrap: (0, _classNames5.default)(h, (_defineProperty(g = {}, "".concat(h, "--hidden"), !d), _defineProperty(g, "".concat(h, "--visible"), d), _defineProperty(g, "".concat(h, "--end"), f), g)),
                lContent: "".concat(h, "__content"),
                loadingText: "".concat(h, "__text-loading")
            }
        }]
    },
    methods: {
        activate: function () {
            this.setData({style: defaultStyle, visible: !0})
        }, deactivate: function () {
            this.activated && (this.activated = !1), this.setData({
                style: defaultStyle,
                visible: !1,
                active: !1,
                refreshing: !1,
                tail: !1
            })
        }, refreshing: function () {
            this.setData({
                style: "transition: transform .4s; transform: translate3d(0, 50px, 0) scale(1);",
                visible: !0,
                active: !0,
                refreshing: !0,
                loading: !1,
                noData: !1,
                newContentHeight: 0,
                oldContentHeight: 0,
                lVisible: !1
            })
        }, tail: function () {
            this.setData({visible: !0, active: !0, refreshing: !0, tail: !0})
        }, hide: function () {
            this.setData({lVisible: !1})
        }, translate: function (t) {
            var e = "transition-duration: 0s; transform: translate3d(0, ".concat(t, "px, 0) scale(1);"),
                i = t < this.data.distance ? "visible" : "active";
            this.setData(_defineProperty({style: e}, i, !0))
        }, isRefreshing: function () {
            return this.data.refreshing
        }, isLoading: function () {
            return this.data.loading
        }, getTouchPoints: function (t, e) {
            var i = 1 < arguments.length && void 0 !== e ? e : 0, n = t.touches[i] || t.changedTouches[i];
            return {x: n.pageX, y: n.pageY}
        }, getSwipeDirection: function (t, e, i, n) {
            return Math.abs(t - e) >= Math.abs(i - n) ? 0 < t - e ? "Left" : "Right" : 0 < i - n ? "Up" : "Down"
        }, requestAnimationFrame: function (t) {
            var e = this, i = (new Date).getTime(), n = Math.max(0, 16 - (i - this.lastTime)),
                a = setTimeout(function () {
                    t.bind(e)(i + n)
                }, n);
            return this.lastTime = i + n, a
        }, cancelAnimationFrame: function (t) {
            clearTimeout(t)
        }, finishPullToRefresh: function () {
            var t = this;
            setTimeout(function () {
                t.requestAnimationFrame(t.tail), setTimeout(function () {
                    return t.deactivate()
                }, 200)
            }, 200)
        }, finishLoadmore: function (t) {
            var e = this;
            !0 === t ? setTimeout(function () {
                e.setData({noData: !0, loading: !1})
            }, 200) : setTimeout(function () {
                e.setData({noData: !1, loading: !1}), e.requestAnimationFrame(e.hide), setTimeout(function () {
                    return e.deactivate()
                }, 200)
            }, 200)
        }, onTouchStart: function (t) {
            this.isRefreshing() || this.isLoading() || (this.start = this.getTouchPoints(t), this.diffX = this.diffY = 0, this.isMoved = !1, this.direction = !1, this.activate())
        }, onTouchMove: function (t) {
            !this.start || this.isRefreshing() || this.isLoading() || (this.isMoved || (this.isMoved = !0), this.move = this.getTouchPoints(t), this.diffX = this.move.x - this.start.x, this.diffY = this.move.y - this.start.y, this.direction = this.getSwipeDirection(this.start.x, this.move.x, this.start.y, this.move.y), this.diffY < 0 || "Down" !== this.direction || (this.diffY = Math.pow(this.diffY, .8), this.triggerPull(this.diffY)))
        }, onTouchEnd: function (t) {
            this.isMoved && (this.start = !1, this.isMoved = !1, this.diffY <= 0 || "Down" !== this.direction || this.isRefreshing() || this.isLoading() || this.triggerRefresh(this.diffY))
        }, triggerPull: function (t) {
            var e = this.data.distance;
            !this.activated && e < t ? (this.activated = !0, this.triggerEvent("pulling")) : this.activated && t < e && (this.activated = !1), this.translate(t)
        }, triggerRefresh: function (t) {
            var e = 0 < arguments.length && void 0 !== t ? t : this.data.distance;
            this.triggerPull(e), this.deactivate(), Math.abs(e) >= this.data.distance && (this.refreshing(), this.triggerEvent("refresh"))
        }, onScroll: function (c) {
            var l = this;
            this.isMoved || wx.createSelectorQuery().select("#".concat(this.id)).boundingClientRect(function (t) {
                var e = t.height;
                l.data.newContentHeight !== e && l.setData({newContentHeight: e});
                var i = l.data, n = i.oldContentHeight, a = i.windowHeight, s = i.distance, o = i.loading, r = i.noData;
                a && !l.isRefreshing() && (e - a - 1.5 * s < c && !1 === o && !1 === r && e !== n ? (l.setData({
                    loading: !0,
                    refreshing: !1,
                    oldContentHeight: e
                }), l.triggerEvent("loadmore")) : !1 === o && !1 === r ? l.hide() : !0 === o && l.setData({oldContentHeight: e}), l.deactivate())
            }).exec()
        }, noop: function () {
        }
    },
    created: function () {
        this.lastTime = 0, this.activated = !1
    },
    attached: function () {
        var e = this;
        wx.getSystemInfo({
            success: function (t) {
                e.setData({windowHeight: t.windowHeight})
            }
        })
    }
});