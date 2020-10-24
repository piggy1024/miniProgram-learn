//发起请求，得到用户实体
const uploadFileUrl = 'https://seldom.zq1024.cn:8443/gdu/imgUpLoad'
const uploadFileUrl2 = 'https://zq1024.cn:8443/gdu/imgUpLoad'
function uploadImg(file) {
    return new Promise(function (resolve, reject) {
        wx.uploadFile({
            url: uploadFileUrl,
            filePath: file,
            name: 'file',
            success: (res) => {
                let result = res.data;
                resolve(result);
            },
            fail: () => {
                reject("系统异常，请重试！");
                wx.showToast({
                    title: '正在抢修...'
                })
            }
        })
    })
}

function uploadImgs(files) {
    let that = this
    return new Promise(function (resolve, reject) {
        files.forEach(function (value, index, array) {
            that.uploadImg(value).then((res) => {
                files[index] = res
            }).catch((res) => {
                reject(res)
            })
        })
        resolve(files)
    })
}

function transform(original) {
    original = String(original)
    const dir = '/thumbnail';
    const thumbnail = original.substr(0, original.lastIndexOf('/'))
        .concat(dir).concat(original.substr(original.lastIndexOf('/')));
    return thumbnail;
}


module.exports.transform = transform;
module.exports.uploadImg = uploadImg;
module.exports.uploadImgs = uploadImgs;
