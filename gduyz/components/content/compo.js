/**
 *
 * @param e
 * @private
 */
function _viewUserInfo(e) {
    console.log(e.detail)
}
module.exports = { //必须在这里暴露接口，以便被外界访问，不然就不能访问
    _viewUserInfo: _viewUserInfo,
}
