/**
 * bar跳转
 * @param e
 * @constructor
 */
function NavChange(e) {
    wx.switchTab({
        url: '/pages/' + e.currentTarget.dataset.cur + '/' + e.currentTarget.dataset.cur
    })
}
module.exports = {
    timeHandle: NavChange
}
