var city_data = {
  表白: {},
  二手交易: {
    // 上海市: ["黄浦区", "卢湾区"]
  },
  学习交流: {},
  吐槽解答: {},

  其它: {}
};

var commanders = [
  "不限车长",
  "≤4.2",
  "5",
  "6.2",
  "6.8",
  "7.2",
  "7.7",
  "7.8",
  "8.2",
  "8.7",
  "9.6",
  "12.5",
  "13",
  "15",
  "16",
  "17.5"
];
var models = [
  "不限车型",
  "高栏",
  "平板",
  "厢式",
  "高低板",
  "自卸",
  "保温",
  "冷藏",
  "危险品",
  "其他"
];
//获取和设置车长
function getcommanders() {
  return commanders;
}
function setcommanders(commanders) {
  this.commanders = commanders;
}
// 获取车型
function getmodels() {
  return models;
}
//获取城市所有列表
function getCity() {
  return city_data;
}

module.exports.getcommanders = getcommanders;
module.exports.setcommanders = setcommanders;
module.exports.getmodels = getmodels;
module.exports.getCity = getCity;
