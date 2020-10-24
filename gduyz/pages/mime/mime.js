// pages/mime/mime.js
const db = wx.cloud.database()
const util = require('../../utils/util.js');
const app = getApp();
let baseUrl = app.globalData.URL;
let testUrl = 'http://localhost'
const tool = require('../../utils/tool.js');
let com = require("../../utils/common")
import {$wuxActionSheet, $wuxToptips} from '../../components/lib/index.js'
const uploadFileUrl = 'https://seldom.zq1024.cn:8443/gdu'

const ch = require('../data.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        noData: true,
        userId: getApp().globalData.userId,
        isReviseSignature: false,
        UseFriendsTotal: 0,
        pageError: false,
        showSkeleton: true,
        isreviseName: false,
        reviseNamePlay: '起个好听的昵称吧',
        buttons: [{
            openType: 'share',
            label: '分享一下',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEwVDE1OjU0OjI1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMFQxNTo1Njo0NiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMFQxNTo1Njo0NiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYmMwMTA4MS02YjAy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'
        },
            {
                openType: 'contact',
                label: '联系作者',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAACACAYAAADgZTAeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEwVDE1OjQyOjE4KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMFQxNTo0NTowOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMFQxNTo0NTowOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3N2E4ZDBkYS02YmM0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',
            },
            {
                label: '修改背景',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAB/CAYAAAAn+soHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEwVDE1OjQ4OjU1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMFQxNTo1MDoyMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMFQxNTo1MDoyMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiM2VlMTU1Yi1kZmNhLWI4NDgtODMwNS03MDNjMDc2NzQ1YWMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YjNlZTE1NWItZGZjYS1iODQ4LTgzMDUtNzAzYzA3Njc0NWFjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YjNlZTE1NWItZGZjYS1iODQ4LTgzMDUtNzAzYzA3Njc0NWFjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiM2VlMTU1Yi1kZmNhLWI4NDgtODMwNS03MDNjMDc2NzQ1YWMiIHN0RXZ0OndoZW49IjIwMjAtMDItMTBUMTU6NDg6NTUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz51sTOnAAADAElEQVR42u3dPYoUQRgG4DrCHsBTKHgFwWuYe48NRTFYBTcSDM3En0R2wUREJ51AZUX0CJuUbmAgzO5291TX71PwRh3MdNUzPdXT9dWEGGOQcaMTANAJAAgAAsB1abn9f9KDtqUAemoAzATQYwNgIoAIAAAEDApgZ7v/5kW89flJvLk5qjtfjuLdk+O42W4BSAXg3tvn8eD8sKnc+P0AgFQALj5VrQG4yPbbdwCSANgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABANwAyPxK/ft0eAEUAFFuzCEB5AMUXrgIAAAAAADDKHACASu8C1ggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUCeD2p6dNAvh69gOAFACenb5rbvDvnB4v2h8AgEva2c9f8fHJ6/jo/auq8/BvXn78sHiLGAAG3yMIgMF3CQOgXwQhI4DLBnYKgFnvd00AobfBzwTgqtePc4+XBtAyhkWX1JUv87OP1QSg6HdhqqwMIP+kBYCqAAQAAABgcAChwvEvBiBL8USFAEKq820VQPYKmgoBhBTnCUDbAMK+5whAYgSFfgpefG4AtH8FmNonoScAAYBGHwaN3jLfGdW3R5A2DmwAAAAAAAAAAAAAAABIC+Dg/HBK/q3jD2tnZgd1tQwuzvn7+IwAdhV01ACgy8WwtQG4qqqnJIBul8PXBGBKaRcAnQKYU9+XG0DvrTiAJUWeAHQCYJ9K39IAQmOpDkCKcm8AGgWQsuYfgMYARAAAqAYBAPUAWHoMgA4AhAkAgq+APieBYQaA4C6gn9vAOT8KlXwYBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADASsWhqywmBWBsABEAAAAAAIBaAAQAAAgmgR0DaHAXLQAAsEEEAAAMC8AmUQCMM/gA7AYQRhl8AC4H0AuEAMB+ALr6x1QAAAAAAAAAAAAAANYFkH02D0A9AIrd0gEAAAAAAAAAACaBewGQcaITANAJAAgAMmb+AO6q2pMEOfkGAAAAAElFTkSuQmCC',
            },
            {
                label: '修改昵称',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAAB/CAYAAADrY/DsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF7GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEwVDE1OjM4OjA5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMFQxNTo0OTo1NyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMFQxNTo0OTo1NyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjZTNkMDlkZi0yNDlk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'
            },
            {
                label: '修改头像',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEyVDE0OjUxOjMwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMlQyMzoyMzo1OCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMlQyMzoyMzo1OCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyYTA5NWZkMy0xYzA3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'
            }, {
                label: '个性签名',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAEAYAAACTrr2IAAAACXBIWXMAACcQAAAnEAGUaVEZAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTE4VDE3OjIwOjQ3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xOFQxNzoyNTo0OCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xOFQxNzoyNTo0OCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMzQzYmJlOS01N2Ri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'
        }],
        CustomBar: app.globalData.CustomBar,
        scrollTop: 0,
        handleCommentIndex: -1,
        replayId: '',
        commentContent: '',
        commentPlaceholder: '评论',
        keyboardHeight: 0,
        wantComment: false,
        feedbackMsg: '',
        feedback: false,
        checkbox: ch.checkbox,
        friends: wx.getStorageSync("userContent") || [],
        page: 1,
        userIn: wx.getStorageSync("userIn") || ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let that = this
        if (options.userId > 0) {
            wx.navigateTo({
                url: '../user/user?userId=' + options.userId,
            })
        } else {
        }
        that.getUserFriends(1, true)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log(this.data.userIn)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            userId:  getApp().globalData.userId,
            userIn: wx.getStorageSync("userIn") || ''
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this
        setTimeout(() => {
            that.setData({
                page: 1
            })
            that.getUserFriends(1, true)
            wx.stopPullDownRefresh()
        }, 2500)
    },
    /**
     * 页面滑动
     * @param e
     */
    onPageScroll(e) {
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this
        const page = that.data.page;
        that.setData({
            page: page + 1
        })
        this.getUserFriends(page + 1, false);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        let that = this
        if (res.from === 'button') {
            if (res.target.dataset.articleid > 0) {
                return {
                    title: res.target.dataset.content,
                    path: '/pages/index/index?viewArticle=' + res.target.dataset.articleid,
                    imageUrl: 'https://www.zq1024.cn:8443/upload/bg/836612.jpg'
                }
            } else {
                return {
                    title: that.data.userIn.afterName,
                    path: 'pages/mime/mime?userId=' + that.data.userIn.userId,
                    imageUrl: 'https://www.zq1024.cn:8443/upload/bg/836612.jpg'
                }
            }
        }
        return {
            title: that.data.userIn.afterName,
            path: 'pages/mime/mime?userId=' + that.data.userIn.userId
        }
    },
    /**
     * bar跳转
     * @param e
     * @constructor
     */
    NavChange(e) {
        wx.switchTab({
            url: '/pages/' + e.currentTarget.dataset.cur + '/' + e.currentTarget.dataset.cur
        })
    },
    /**
     * 获取
     * @param page
     * @param refresh
     */
    getUserFriends(page, refresh) {
        let that = this
        if (!(getApp().globalData.userId > 0)) {
            that.setData({
                showSkeleton: false
            })
            that.showInfoTop('您还没登陆！')
            that.showInfoTop("正在为你跳转...")
            wx.navigateTo({
                url: '../login/login?from=../mime/mime',
            })
            return
        }
        const oldFriends = that.data.friends
        if (that.data.UseFriendsTotal <= oldFriends.length && !refresh) {
            return;
        }
        wx.request({
            url: baseUrl.concat('/user/getUserInfo'),
            data: {
                userId: getApp().globalData.userId,
                others: false,
                currentPage: page
            },
            success: result => {
                let nodata = false;
                if (result.data.userContent.friends.length < 10|| result.data.userContent.friends.length + oldFriends.length >= that.data.UseFriendsTotal) {
                    nodata = true
                }
                if (refresh) {
                    wx.setStorageSync("userContent", result.data.userContent.friends)
                    wx.setStorageSync("userIn", result.data.userIn)
                    that.setData({
                        noData: nodata,
                        showSkeleton: false,
                        UseFriendsTotal: result.data.userContent.total,
                        friends: result.data.userContent.friends,
                        userIn: result.data.userIn,
                    })
                } else {
                    that.setData({
                        noData: nodata,
                        friends: oldFriends.concat(result.data.userContent.friends),
                        userIn: result.data.userIn
                    })
                }
            },
            fail: res => {
                that.setData({
                    showSkeleton: false
                })
                that.showErrorTop('网络出错！')
            }
        })
    },

    /**
     * 捕获点赞事件,渲染数据
     * @param e
     */
    supportCapture: function (e) {
        let that = this
        const friendsList = that.data.friends;
        const temp = [];
        friendsList.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                item.hashMap.supports = e.detail
            }
            temp.push(item)
        })
        wx.setStorageSync("userContent", temp)
        that.setData({
            friends: temp
        })
    },

    /**
     * 捕获评论事件
     */
    commentCapture(e) {
        this.setData({
            wantComment: true
        })
    },
    /**
     * 删除文章
     * @param articleId
     */
    deleteFriend(articleId) {
        const deleteId = articleId.detail;
        let that = this
        const oldFriends = that.data.friends;
        const newFriends = [];
        oldFriends.forEach(function (item) {
            if (item.friends.contentId !== deleteId) {
                newFriends.push(item)
            }
        })
        wx.setStorageSync("userContent", newFriends)
        that.setData({
            friends: newFriends
        })
    },

    /**
     * 捕获子事件
     */
    TDD(e) {
        this.setData({
            mask: {
                handleId: e.detail[0],
                commenting: e.detail[1]
            }
        })
    },

    /**
     * 捕获举报事件
     */
    feedbackCapture() {
        this.setData({
            feedback: true
        })
    },

    /**
     * 捕获
     * @param e
     */
    commentTapCapture(e) {
        if (e.detail[0] === 'tap') {
            if (getApp().globalData.userId === e.detail[2]) {
                this.setData({
                    commentContent: '',
                    mask: {
                        handleId: e.detail[1],
                        commenting: false
                    },
                    replayId: '',
                    commentPlaceholder: '评论',
                    wantComment: true
                })
            } else {
                this.setData({
                    commentContent: '',
                    mask: {
                        handleId: e.detail[1],
                        commenting: false
                    },
                    replayId: e.detail[2],
                    replayName: e.detail[3],
                    commentPlaceholder: '回复:'.concat(e.detail[3]),
                    wantComment: true
                })
            }
        } else {
            this.showActionSheet(getApp().globalData.userId === e.detail[2])
            this.setData({
                copyContent: e.detail[6],
                feedbackCommentId: e.detail[5],
                handleCommentIndex: e.detail[4],
                mask: {
                    handleId: e.detail[1],
                    commenting: false
                },
                replayId: '',
                commentPlaceholder: '评论',
                commentContent: '',
                replayName: '',
            })
        }
    },

    /**
     *
     * @returns {boolean}
     */
    showActionSheet(own) {
        let that = this
        $wuxActionSheet().showSheet({
            buttons: [{
                text: '举报'
            }, {
                text: '复制'
            },
            ],
            buttonClicked(index, item) {
                if (index === 0) {
                    that.setData({
                        isFeedbackComment: true,
                        feedback: true
                    })
                    this.cancel()
                }
                if (index === 1) {
                    that.copyComment();
                    this.cancel()
                }
                return true
            },
            cancelText: '取消',
            cancel() {

            },
            destructiveText: own ? '删除' : '',
            destructiveButtonClicked() {
                that.deleteComment()
                this.cancel()
            },
        })
    },

    /**
     * 复制
     */
    copyComment() {
        let that = this
        wx.setClipboardData({
            data: that.data.copyContent,
            success: res => {
                that.showSuccessTop('copy success')
            },
            fail: res => {
                that.showErrorTop('copy fail')
            }
        })
    },
    /**
     * 同步评论
     */
    feedbackComment(e) {
        let that = this
        that.setData({
            isFeedbackComment: false
        })
        const db = wx.cloud.database();
        that.showInfoTop('正在加急处理...')
        db.collection('feedbackComment').add({
            data: {
                commentId: that.data.feedbackCommentId,
                feedbackMsg: e,
                time: util.formatTime(new Date())
            },
            success: res => {
                that.showSuccessTop('谢谢您的举报！')
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            },
        })
    },
    /**
     * 删除评论,渲染数据
     */
    deleteComment() {
        let that = this
        const friends = that.data.friends;
        const tem = [];
        friends.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                that.deleteCommentPush(item.hashMap.comments[that.data.handleCommentIndex].commentId)
                item.hashMap.comments.splice(that.data.handleCommentIndex, 1)
            }
            tem.push(item)
        })
        wx.setStorageSync("userContent", tem)
        that.setData({
            friends: tem
        })
    },


    /**
     *  推送数据
     * @param commentId
     */
    deleteCommentPush(commentId) {
        let that = this
        wx.request({
            url: baseUrl.concat('/comment/deleteComment'),
            data: {
                commentId: commentId,
                isDelete: true
            },
            success: result => {
                that.showSuccessTop('success')
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            }
        })
    },

    /**
     * 解决键盘遮掩问题
     * 获取高度 设置高度
     */
    inputFocus(e) {
        this.setData({
            keyboardHeight: e.detail.height,
            isInput: true
        })
    },
    inputBlur() {
        this.setData({
            keyboardHeight: 0,
            isInput: false
        })
    },

    /**
     * 监听评论输入框
     */
    commentTextarea(e) {
        this.setData({
            commentContent: e.detail.value,
        })
    },

    /**
     * 提交评论
     */
    confirmComment() {
        let that = this
        if (that.data.commentContent === '') {
            that.showInfoTop('内容为空');
            return
        }
        if (that.data.isreviseName) {
            that.reviseName()
            return;
        }
        if (that.data.isReviseSignature){
            that.reviseSignature()
            return;
        }
        this.setData({
            wantComment: false
        })
        wx.request({
            url: baseUrl + '/comment/postComment',
            data: {
                contentId: that.data.mask.handleId,
                comment: that.data.commentContent,
                userId: getApp().globalData.userId,
                replayUserId: that.data.replayId
            },
            success: result => {
                that.showSuccessTop('success')
                that.applyComment(result.data)
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            }
        })
    },

    /**
     * 把评论渲染到页面
     */
    applyComment(commentId) {
        let that = this
        const friendsList = that.data.friends;
        const newComment = [{
            commentId: commentId,
            contentId: that.data.mask.handleId,
            comment: that.data.commentContent,
            commentUserId: getApp().globalData.userId,
            commentName: getApp().globalData.userName,
            replayUserId: that.data.replayId,
            replayName: that.data.replayName,
            commentTime: util.formatTime(new Date())
        },];
        const temList = [];
        friendsList.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                item.hashMap.comments = newComment.concat(item.hashMap.comments)
            }
            temList.push(item)
        })

        wx.setStorageSync("userContent", temList)
        that.setData({
            friends: temList,
            mask: {
                handleId: '',
            },
            replayId: '',
            commentPlaceholder: '评论',
            commentContent: '',
            replayName: '',
        })
    },

    /**
     * 关闭举报窗口
     */
    hideModal2() {
        let that = this
        that.setData({
            feedback: false
        })
    },

    /**
     * 提交举报
     */
    affirm(e) {
        let that = this;
        let msg = '';
        let items = that.data.checkbox;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            if (items[i].checked === true) {
                msg += items[i].name + ';'
            }
        }
        if (msg.length === 0) {
            this.showErrorTop('您未选择!')
        } else {
            if (that.data.isFeedbackComment) {
                that.feedbackComment(msg)
            } else {
                that.feedback(msg)
            }
            that.hideModal2()
        }
    },

    /**
     * 同步举报
     */
    feedback: function (e) {
        let that = this
        const db = wx.cloud.database();
        that.showInfoTop('正在处理...')
        db.collection('feedback').add({
            data: {
                articleId: that.data.mask.handleId,
                feedbackMsg: e,
                time: util.formatTime(new Date())
            },
            success: res => {
                that.showSuccessTop('谢谢您的举报！')
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            },
        });
    },

    /**
     * 选择举报
     */
    ChooseCheckbox(e) {
        let items = this.data.checkbox;
        let values = e.currentTarget.dataset.value;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            if (items[i].value === values) {
                items[i].checked = !items[i].checked;
                break
            }
        }
        this.setData({
            checkbox: items
        })
    },
    /**
     * 关闭评论框
     */
    hideCommentModal() {
        this.setData({
            wantComment: false
        })
    },
    /**
     * 顶部
     */
    showTop(Title) {
        $wuxToptips().show({
            icon: 'cancel',
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showSuccessTop(Title) {
        $wuxToptips().success({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showInfoTop(Title) {
        $wuxToptips().info({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showWarnTop(Title) {
        $wuxToptips().warn({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showErrorTop(Title) {
        $wuxToptips().error({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },

    /**
     * 用户授权
     */
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //插入登录的用户的相关信息到数据库
            this.userRegistry(e.detail.userInfo)
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进行其他操作!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    if (res.confirm) {
                    }
                }
            })
        }
    },
    /**
     * 获取用户信息接口
     * @param e
     */
    userRegistry: function (e) {
        let that = this
        wx.login({
            success: result => {
                const data = {
                    nickName: e.nickName,
                    gender: e.gender,
                    avatarUrl: e.avatarUrl,
                    code: result.code
                };
                wx.request({
                    url: baseUrl + '/user/registry',
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: data,
                    success: function (res) {
                        that.setData({
                            userId: res.data.userId,
                            userIn: {
                                bgUrl: 'https://www.zq1024.cn:8443/upload/bg/836612.jpg',
                                afterName: res.data.userName,
                                afterAvatarUrl: res.data.avatar,
                                signature: res.data.signature
                            }
                        })
                        that.showSuccessTop('欢迎:'.concat(res.data.userName))
                        wx.setStorageSync('userId', res.data.userId)
                        wx.setStorageSync('userName', res.data.userName)
                        getApp().globalData.userName = res.data.userName
                        getApp().globalData.userId = res.data.userId
                        wx.setStorageSync("avatar", res.data.avatar)
                    },
                    fail: res => {
                        that.showErrorTop('网络错误！')
                    }
                });
            }
        })
    },

    /**
     * 点击事件
     * @param e
     */
    onClick(e) {
        let that = this
        if (e.detail.index === 3) {
            that.setData({
                isreviseName: true,
                wantComment: true
            })
        }
        if (e.detail.index === 2) {
            that.reviseBg(true)
        }
        if (e.detail.index === 4) {
            that.reviseBg(false)
        }
        if (e.detail.index === 5) {
            that.setData({
                isReviseSignature: true,
                wantComment: true
            })
        }
    },
    /**
     * 同步数据库背景
     * @param file
     */
    pushAvatar(file) {
        let that = this
        wx.request({
            url: baseUrl.concat('/user/reviseName'),
            data: {
                userId: getApp().globalData.userId,
                afterAvatarUrl: file
            },
            success: result => {
                that.setData({
                    userIn: {
                        afterAvatarUrl: file,
                        afterName: that.data.userIn.afterName,
                        bgUrl: that.data.userIn.bgUrl,
                        signature: that.data.userIn.signature
                    }
                })
                wx.setStorageSync("userIn", that.data.userIn)
                that.showSuccessTop('修改成功');
            },
            fail: res => {
                that.showErrorTop('网络出错！')
            }
        })
    },

    /**
     * 个性签名
     */
    reviseSignature(){
        let that = this
        const signature = that.data.commentContent;
        wx.request({
            url: baseUrl.concat('/user/reviseName'),
            data: {
                userId: getApp().globalData.userId,
                signature: signature
            },
            success: result => {
                that.setData({
                    isReviseSignature: false,
                    wantComment: false,
                    commentContent: '',
                    userIn: {
                        afterAvatarUrl: that.data.userIn.afterAvatarUrl,
                        afterName: that.data.userIn.afterName,
                        bgUrl: that.data.userIn.bgUrl,
                        signature: signature
                    }
                })
                wx.setStorageSync("userIn", that.data.userIn)
                that.showSuccessTop('修改成功');
            },
            fail: res => {
                that.setData({
                    isReviseSignature: false,
                    wantComment: false,
                    commentContent: '',
                })
                that.showErrorTop('网络出错！')
            }
        })
    },

    /**
     * 修改用户信息
     */
    reviseName() {
        let that = this
        const name = that.data.commentContent;
        wx.request({
            url: baseUrl.concat('/user/reviseName'),
            data: {
                userId: getApp().globalData.userId,
                afterName: name
            },
            success: result => {
                that.setData({
                    isreviseName: false,
                    wantComment: false,
                    commentContent: '',
                    userIn: {
                        afterAvatarUrl: that.data.userIn.afterAvatarUrl,
                        afterName: name,
                        bgUrl: that.data.userIn.bgUrl,
                        signature: that.data.userIn.signature
                    }
                })
                wx.setStorageSync("userName", that.data.userIn.afterName)
                wx.setStorageSync("userIn", that.data.userIn)
                that.showSuccessTop('修改成功');
            },
            fail: res => {
                that.setData({
                    isreviseName: false,
                    wantComment: false,
                    commentContent: '',
                })
                that.showErrorTop('网络出错！')
            }
        })
    },
    /**
     * 修改背景
     */
    reviseBg(isBg) {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: isBg ? ['compressed'] : ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                that.uploadBg(res.tempFilePaths[0], isBg)
            }
        });
    },
    /**
     * 上传背景
     * @param file
     * @param isBg
     */
    uploadBg(file, isBg) {
        let that = this
        wx.uploadFile({
            url: uploadFileUrl + (isBg ? '/imgUpLoadBg' : '/imgUpLoadAvatar'),
            filePath: file,
            name: 'file',
            success: result => {
                if (isBg) {
                    that.pushBg(result.data)
                } else {
                    that.pushAvatar(result.data)
                }
            }
        })
    },
    /**
     * 同步数据库背景
     * @param file
     */
    pushBg(file) {
        let that = this
        wx.request({
            url: baseUrl.concat('/user/reviseName'),
            data: {
                userId: getApp().globalData.userId,
                bgUrl: file
            },
            success: result => {
                that.setData({
                    userIn: {
                        afterAvatarUrl: that.data.userIn.afterAvatarUrl,
                        afterName: that.data.userIn.afterName,
                        bgUrl: file,
                        signature: that.data.userIn.signature
                    }
                })
                wx.setStorageSync("userIn", that.data.userIn)
                that.showSuccessTop('修改成功');
            },
            fail: res => {
                that.showErrorTop('网络出错！')
            }
        })
    },
    /**
     *
     * @param e
     */
    concealCapture(e){
        let that = this
        const friendsList = that.data.friends;
        const temList = [];
        friendsList.forEach(item => {
            if (item.friends.contentId === arid) {
                item.Friends.conceal = e.detail[1]
            }
            temList.push(item)
        })
        wx.setStorageSync("userContent", temList)
        that.setData({
            friends: temList
        })
    }
})
