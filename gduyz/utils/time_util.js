/**
 * 获取该周的所要显示的周和日期的对应数据，数据结构如下
 * var weekDay = {week: '',day: ''}
 * 参数：selectWeek  0为本周，数字代表前几周或者后几周，例如1是下一周
 */
function getWeekDayList(selectWeek) {
    // 1.获取周一对应得时间
    // 2.用循环七次添加周一到周日对应得周几和几号
    const selectWeekTime = getCurrentTimeStamp() + (selectWeek * 7) * 24 * 60 * 60 * 1000;
    const mondayTime = selectWeekTime - (getWeekNumber(selectWeekTime) - 1) * 24 * 60 * 60 * 1000;
    const timeBean = {
        selectDay: 0,
        yearMonth: '',
        weekDayList: []
    };

    for (let i = 0; i < 7; i++) {
        const weekDay = {
            week: '',
            day: ''
        };
        weekDay.week = getWeek(mondayTime + i * 24 * 60 * 60 * 1000)
        weekDay.day = getMyDay(mondayTime + i * 24 * 60 * 60 * 1000)
        timeBean.weekDayList.push(weekDay)
    }

    timeBean.yearMonth = getYearMonth(selectWeekTime);
    timeBean.selectDay = getCurrenrWeek();
    return timeBean;
}


//获取当前时间戳  --
function getCurrentTimeStamp() {
    const timestamp = new Date().getTime();
    return timestamp
}

//获取当前周几
function getCurrenrWeek() {
    const str = "6012345".charAt(new Date().getDay());
    return str;
}

//时间戳获得年月
function getYearMonth(res) {
    const time = new Date(res);
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    return y + "-" + m;
}

//时间戳转几号
function getMyDay(res) {
    const time = new Date(res);
    const d = time.getDate();
    return d;
}

//时间戳转周几
function getWeek(res) {
    const time = new Date(res);
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    return "日一二三四五六".charAt(new Date(y + '-' + m + '-' + d).getDay());
}

//时间戳转周几 0123456  --
function getWeekNumber(res) {
    const time = new Date(res);
    const y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return "0123456".charAt(new Date(y + '-' + m + '-' + d).getDay());
}
//两个时间相差天数 兼容firefox chrome
function weekOfSemester(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    let dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));

    return Math.ceil(iDays/7)
}

module.exports = {  //把方法共享，让引用的地方可以调用
    getWeekDayList: getWeekDayList,
    weekOfSemester: weekOfSemester
}
