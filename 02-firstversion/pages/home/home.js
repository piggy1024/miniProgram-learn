// pages/home/home.js
Page({
  data: {
    titles: ["clothes", "裤子", "shoes"]
  },
  handleBtnClick() {
    console.log("按钮发生点击！");
  },
  handleTouchStart() {
    console.log("handleTouchStart");
  },
  handleTouchMove() {
    console.log("handleTouchMove");
  },
  handleTouchEnd() {
    console.log("handleTouchEnd");
  },
  handleTap() {
    console.log("handleTap");
  },
  handleLongpress() {
    console.log("handleLongpress");
  },
  handleEventClick(event) {
    console.log("-----", event);
  },
  handleInner(event) {
    console.log(event);
  },
  handleOuter(event) {
    console.log(event);
  },
  handleItemClick(event) {
    console.log(event);
    //取出title - index
    const dataset = event.currentTarget.dataset;
    const title = dataset.item;
    const index = dataset.index;
    console.log(title, index);
  }
});
