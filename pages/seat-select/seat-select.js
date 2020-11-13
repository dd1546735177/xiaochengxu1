const app = getApp()
var jsonData = require('../../data/json.js');
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movieName: undefined,
    planDetail: undefined,
    seatList: [],
    selectedSeat: [],
    hallName: undefined,
    scaleValue: 1,
    hidden: "hidden",
    maxSelect: 1,
    totalPrice: 0,
    loadComplete: false,
    timer: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    let that = this;
    that.setData({
      seatArea: getApp().globalData.screenHeight - getApp().globalData.statusBarHeight - (500 * getApp().globalData.screenWidth / 750),
      rpxToPx: getApp().globalData.screenWidth / 750
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    //---这此替换成自己的接口请求成功后--start--
    //let result = db.collection('nanyuan-nv').get();
   // console.log(result.data[0].showTime);
   let result = jsonData.dataList;
    wx.hideLoading();
    if (result.errorCode == 0) {
      let seatList = that.prosessSeatList(result);
      that.setData({
        movieName: result.movieName,
        planDetail: result.showTime,
        hallName: result.name,
        seatList: seatList,
        seatTypeList: result.seatTypeList,
        selectedSeat: [],
        totalPrice: 0,
        hidden: "hidden",
        seatArea: this.data.seatArea
      });
      setTimeout(function() {
        wx.hideLoading()
      }, 1000)
      //计算X和Y坐标最大值
      that.prosessMaxSeat(seatList);
      //计算左侧澡间栏的数组
      that.seatToolArr()
      //按每排生成澡间数组对象
      that.creatSeatMap()
      //确认最佳坐标澡间
      that.creatBestSeat()
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '获取澡间图失败',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function() {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      }, 1000)
    }
    //---这此替换成自己的接口请求成功后--end--
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 顶级顶部返回按钮时候
   */
  prosessSeatList: function(response) {
    let resSeatList = response.seatList
    resSeatList.forEach(element => {
      // 获取澡间的类型的首字母
      let firstNumber = element.type.substr(0, 1)
      // 加载澡间的图标
      let seatType = response.seatTypeList;
      for (const key in seatType) {
        // 加载每个澡间的初始图标defautIcon 和 当前图标 nowIcon
        if (element.type === seatType[key].type) {
          element.nowIcon = seatType[key].icon
          element.defautIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-1' === seatType[key].type) {
          element.selectedIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-2' === seatType[key].type) {
          element.soldedIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-3' === seatType[key].type) {
          element.fixIcon = seatType[key].icon
        }
      }
      // 如果澡间是已经售出 和 维修澡间 加入属性canClick 判断澡间是否可以点击
      if (element.defautIcon === element.soldedIcon || element.defautIcon === element.fixIcon) {
        element.canClick = false
      } else {
        element.canClick = true
      }
    })
    return resSeatList
  },
  //计算最大间数,生成布局图大小
  prosessMaxSeat: function(value) {
    let seatList = value
    let maxY = 0;
    for (let i = 0; i < seatList.length; i++) {
      let tempY = seatList[i].gRow;
      if (parseInt(tempY) > parseInt(maxY)) {
        maxY = tempY;
      }
    }
    let maxX = 0;
    for (var i = 0; i < seatList.length; i++) {
      var tempX = seatList[i].gCol;
      if (parseInt(tempX) > parseInt(maxX)) {
        maxX = tempX;
      }
    }
    let seatRealWidth = parseInt(maxX) * 70 * this.data.rpxToPx
    let seatRealheight = parseInt(maxY) * 70 * this.data.rpxToPx
    let seatScale = 1;
    let seatScaleX = 1;
    let seatScaleY = 1;
    let seatAreaWidth = 630 * this.data.rpxToPx
    let seatAreaHeight = this.data.seatArea - 200 * this.data.rpxToPx
    if (seatRealWidth > seatAreaWidth) {
      seatScaleX = seatAreaWidth / seatRealWidth
    }
    if (seatRealheight > seatAreaHeight) {
      seatScaleY = seatAreaHeight / seatRealheight
    }
    if (seatScaleX < 1 || seatScaleY < 1) {
      seatScale = seatScaleX < seatScaleY ? seatScaleX : seatScaleY
    }
    this.setData({
      maxY: parseInt(maxY),
      maxX: parseInt(maxX),
      seatScale: seatScale,
      seatScaleHeight: seatScale * 70 * this.data.rpxToPx
    });
  },
  // 澡间左边栏的数组
  seatToolArr: function() {
    let seatToolArr = []
    let yMax = this.data.maxY
    let seatList = this.data.seatList
    for (let i = 1; i <= yMax; i++) {
      let el = ''
      for (let j = 0; j < seatList.length; j++) {
        if (parseInt(seatList[j].gRow) === i) {
          el = seatList[j].row
        }
      }
      seatToolArr.push(el)
    }
    this.setData({
      seatToolArr: seatToolArr
    })
  },
  back: function() {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },
  // 点击每个澡间触发的函数
  clickSeat: function(event) {
    let index = event.currentTarget.dataset.index;
    if (this.data.seatList[index].canClick) {
      if (this.data.seatList[index].nowIcon === this.data.seatList[index].selectedIcon) {
        this.processSelected(index)
      } else {
        this.processUnSelected(index)
      }
    }
    if (this.data.selectedSeat.length == 0) {
      this.setData({
        hidden: "hidden"
      });
    }

    let _selectedSeatList = this.data.selectedSeat
    let totalPrice = 0
    for (const key in _selectedSeatList) {
      let price = parseInt(_selectedSeatList[key].price);
      totalPrice += price;
    }
    this.setData({
      totalPrice: totalPrice
    })
  },
  // 处理已选的澡间
  processSelected: function(index) {
    let _selectedSeatList = this.data.selectedSeat
    let seatList = this.data.seatList
      // 改变这些澡间的图标为初始图标 并 移除id一样的澡间
      seatList[index].nowIcon = seatList[index].defautIcon
      for (const key in _selectedSeatList) {
        if (_selectedSeatList[key].id === seatList[index].id) {
          _selectedSeatList.splice(key, 1)
        }
      }
    this.setData({
      selectedSeat: _selectedSeatList,
      seatList: seatList
    })
  },
  // 处理未选择的澡间
  processUnSelected: function(index) {
    let _selectedSeatList = this.data.selectedSeat
    let seatList = this.data.seatList
      //  判断选择个数不大于 maxSelect
      if (_selectedSeatList.length >= this.data.maxSelect) {
        wx.showToast({
          title: '最多只能选择' + this.data.maxSelect + '间哦~',
          icon: 'none',
          duration: 2000
        })
        return
      }
      // 改变这些澡间的图标为已选择图标
      seatList[index].nowIcon = seatList[index].selectedIcon
      // 记录 orgIndex属性 是原seatList数组中的下标值
      seatList[index].orgIndex = index
      // 把选择的澡间放入到已选澡间数组中
      let temp = { ...seatList[index]
      }
      _selectedSeatList.push(temp)
    this.setData({
      selectedSeat: _selectedSeatList,
      seatList: seatList,
      hidden: ""
    })
  },
  confirmHandle: function() {
    let that = this
    let _this = this.data
    if (_this.selectedSeat.length === 0) {
      wx.showToast({
        title: '请至少选择一个位~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 开始计算是否留下空位 ------------ 开始
    let result = _this.selectedSeat.every(function(element, index, array) {
      return that.checkSeat(element, _this.selectedSeat)
    })
    // 开始计算是否留下空位 ------------ 结束
    if (result) {
      wx.redirectTo({
        url: '../pagetime/pagetime', //要跳转到的页面路径
      })
    }else{
      wx.redirectTo({
        url: '../pagetime/pagetime', //要跳转到的页面路径
      })
    }
  },
  // 检查每个澡间是否会留下空位
  checkSeat: function(element, selectedSeat) {
    // 标准为 1.左右侧都必须保留 两澡间 + 最大顺延澡间(也就是已选澡间减去自身)
    // 2.靠墙和靠已售的澡间一律直接通过
    const checkNum = 2 + selectedSeat.length - 1
    const gRowBasic = element.gRow
    const gColBasic = element.gCol
    // 检查澡间左侧
    let left = this.checkSeatDirection(gRowBasic, gColBasic, checkNum, '-', selectedSeat)
    // 如果左侧已经检查出是靠着过道直接 返回true
    if (left === 'special') {
      return true
    }
    // 检查澡间右侧
    let right = this.checkSeatDirection(gRowBasic, gColBasic, checkNum, '+', selectedSeat)
    if (right === 'special') {
      // 无论左侧是否是什么状态 检查出右侧靠着过道直接 返回true
      return true
    } else if (right === 'normal' && left === 'normal') {
      // 如果左右两侧都有富裕的澡间 返回true
      return true
    } else if (right === 'fail' || left === 'fail') {
      // 如果左右两侧都是不通过检测 返回false
      return false
    }
    return true
  },
  // 检查左右侧澡间满足规则状态
  checkSeatDirection: function(gRowBasic, gColBasic, checkNum, direction, selectedSeat) {
    // 空位个数
    let emptySeat = 0
    let x = 1 // 检查位置 只允许在x的位置出现过道,已售,停用
    for (let i = 1; i <= checkNum; i++) {
      let iter // 根据 gRow gCol direction 找出检查澡间左边按顺序排列的checkNum
      if (direction === '-') {
        iter = this.data.seatList.find(function(el) {
          return el.gRow === gRowBasic && el.gCol === gColBasic - i
        })
      } else if (direction === '+') {
        iter = this.data.seatList.find(function(el) {
          return el.gRow === gRowBasic && el.gCol === gColBasic + i
        })
      }
      if (x === i) {
        if (iter === undefined) {
          // 过道
          return 'special'
        }
        if (iter.nowIcon === iter.soldedIcon || iter.nowIcon === iter.fixIcon) {
          // 已售或者停用
          return 'special'
        }
        let checkSelect = false
        for (const index in selectedSeat) {
          if (selectedSeat[index].id === iter.id) {
            // 已选 顺延一位
            x++
            checkSelect = true
            break;
          }
        }
        if (checkSelect) {
          continue
        }
      } else {
        if (iter === undefined) {
          // 过道
          return 'fail'
        }
        if (iter.nowIcon === iter.soldedIcon ||
          iter.nowIcon === iter.fixIcon) {
          // 已售或者停用
          return 'fail'
        }
        let checkSelect = false
        for (const index in selectedSeat) {
          if (selectedSeat[index].id === iter.id) {
            return 'fail'
          }
        }
      }
      emptySeat++
      if (emptySeat >= 2) {
        return 'normal'
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return app.globalData.share;
  },
  /**
   * 点击确认选择开始生成订单
   */
  createOrder: function() {
    let _this = this.data
    var seatIds = [];
    let selectSeatInfo = _this.selectedSeat;
    if (selectSeatInfo) {
      for (var i = 0; i < selectSeatInfo.length; i++) {
        seatIds.push(selectSeatInfo[i].id);
      }
    }
    //这里编写开始创建订单逻辑
    wx.showToast({
      title: '这里编写开始创建订单逻辑~',
      icon: 'none',
      duration: 2000
    })
    return
  },
  //生成最佳澡间
  creatBestSeat: function() {
    // 优先左侧
    var bestX = parseInt(this.data.maxX / 2) + 1
    // 四舍五入  0.618为黄金分割比例
    var bestY = Math.round(this.data.maxY * 0.618)
    this.setData({
      bestX: bestX,
      bestY: bestY,
      loadComplete: true
    })
  },
  // 根据seatList 生成一个类map的对象 key值为gRow坐标 value值为gRow为key值的数组
  creatSeatMap: function() {
    let seatList = this.data.seatList
    var obj = {}
    for (let index in seatList) {
      let seatRowList = seatList[index].gRow
      if (seatRowList in obj) {
        // 原本数组下标
        seatList[index].orgIndex = index
        obj[seatRowList].push(seatList[index])
      } else {
        let seatArr = []
        // 原本数组下标
        seatList[index].orgIndex = index
        seatArr.push(seatList[index])
        obj[seatRowList] = seatArr
      }
    }
    this.setData({
      seatMap: obj
    })
  },
  // 快速选择澡间函数
  quickSeat: function(event) {
    let value = parseInt(event.currentTarget.dataset.num);
    let _self = this.data
    let that = this
    // 最优澡间数组 里面包含了每排的最佳澡间组
    let bestSeatList = []
    let bestRowSeat
    for (let i = _self.maxY; i > 0; i--) {
      // bestRowSeat为 gRow 为 i 的的所有澡间对象
      bestRowSeat = _self.seatMap[i]
      if (bestRowSeat === undefined) {
        continue
      } else {
        // 找到每排的最佳早间
        let bestSeat = that.seachBestSeatByRow(bestRowSeat, value)
        if (bestSeat != null) {
          bestSeatList.push(bestSeat)
        }
      }
    }
    if (bestSeatList.length <= 0) {
      wx.showToast({
        title: '没有合适的澡间~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let bestSeatListIndex = 0
    // 递归每排的最优澡间组 找出离中心点最近的最优澡间组
    bestSeatList.reduce(function(prev, cur, index, arr) {
      if (Array.isArray(prev)) {
        // 取中心点离 最好坐标 绝对值
        let n = Math.abs((prev[0].gCol + prev[value - 1].gCol) / 2 - _self.bestX)
        let m = Math.abs(prev[0].gRow - _self.bestY)
        // 勾股定理
        prev = Math.sqrt(Math.pow(n, 2) + Math.pow(m, 2))
      }
      // 取中心点离 最好坐标 绝对值
      let x = Math.abs((cur[0].gCol + cur[value - 1].gCol) / 2 - _self.bestX)
      let y = Math.abs(cur[0].gRow - _self.bestY)
      // 勾股定理
      let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
      if (z >= prev) {
        return prev
      } else {
        bestSeatListIndex = index
        return z
      }
    })
    // 发送选择事件
    for (const iterator of bestSeatList[bestSeatListIndex]) {
      that.processUnSelected(iterator.orgIndex)
    }
    let _selectedSeatList = _self.selectedSeat
    let totalPrice = 0
    for (const key in _selectedSeatList) {
      let price = parseInt(_selectedSeatList[key].price);
      totalPrice += price;
    }
    this.setData({
      totalPrice: totalPrice
    })
  },
  // 找寻每排的最佳澡间数组
  seachBestSeatByRow: function(rowSeatList, value) {
    let effectiveSeatLeft = []
    let effectiveSeatRight = []
    let effectiveSeatMiddle = []
    // 检查居中对齐包含最佳澡间的
    effectiveSeatMiddle = this.checkSeatMiddle(rowSeatList, value)
    // 左边检查开始
    effectiveSeatLeft = this.checkSeatWithDirection(rowSeatList, value, '-')
    // 右边检查开始
    effectiveSeatRight = this.checkSeatWithDirection(rowSeatList, value, '+')
    // 如果这排中 包含最佳坐标有澡间数满足 返回这批澡间数组
    if (effectiveSeatMiddle.length === value) {
      return effectiveSeatMiddle
    }
    // 如果这排中 不包含最佳澡间 但是左右两侧都有满足澡间数 取离中心点近的方向澡间数组
    if (effectiveSeatLeft.length === value && effectiveSeatRight.length === value) {
      return Math.abs(effectiveSeatLeft[0].gCol - this.data.bestX) > Math.abs(effectiveSeatRight[0].gCol - this.data.bestX) ? effectiveSeatRight : effectiveSeatLeft
    } else {
      // 否则 返回 左右两侧 某一侧满足的澡间数组
      if (effectiveSeatLeft.length === value) {
        return effectiveSeatLeft
      }
      if (effectiveSeatRight.length === value) {
        return effectiveSeatRight
      }
      return null
    }
  },
  // 找到次排是否有快速选择澡间数有效的数组 寻找的坐标为 最佳澡间根据快速选择澡间数 取左右两边正负澡间数
  checkSeatMiddle: function(rowSeatList, value) {
    let effectiveSeat = []
    // 从负到整的值动态值
    let activeValue = value > 2 ? value - 2 : value - 1
    if (value === this.data.maxX) {
      activeValue = activeValue - 1
    } else if (value > this.data.maxX) {
      // 快速选择澡间数 大于影厅横向左边值 直接返回没有有效澡间
      return effectiveSeat
    }
    // 最佳澡间根据快速选择澡间数 取左右两边正负澡间数
    for (let j = -activeValue; j <= activeValue; j++) {
      // 确认最佳澡间状态
      let iter = rowSeatList.find((el) => (parseInt(el.gCol) === this.data.bestX + j))
      // 最佳澡间
      if (iter === undefined) {
        break
      }
      if (iter.nowIcon === iter.soldedIcon || iter.nowIcon === iter.fixIcon) {
        effectiveSeat = []
        continue
      } else {
        effectiveSeat.push(iter)
      }
    }
    if (effectiveSeat.length > value) {
      // 最后找出居中澡间数组后 由于会有已售和维修和过道的影响 在数组中 先删除后面的位置值 再删除前面位置值 直到值为value(快速选择澡间数)
      for (let i = 0; i < activeValue; i++) {
        effectiveSeat.pop()
        if (effectiveSeat.length === value) {
          break
        }
        effectiveSeat.shift()
        if (effectiveSeat.length === value) {
          break
        }
      }
      //预检
      if (this.preCheckSeatMakeEmpty(effectiveSeat)) {
        return []
      }
    } else if (effectiveSeat.length < value) {
      return []
    } else {
      //预检
      if (this.preCheckSeatMakeEmpty(effectiveSeat)) {
        return []
      }
    }
    return effectiveSeat
  },
  // 找到次排是否有快速选择澡间数有效的数组
  checkSeatWithDirection: function(rowSeatList, value, direction) {
    let activeValue = value
    // 最多允许过道等于3 由于某些影厅 居中的位置不是澡间 存在大部分的过道 导致无法选择到最佳澡间
    let roadDistance = 3
    let effectiveSeat = []
    for (let j = 0; j < activeValue; j++) {
      let iter
      if (direction === '-') {
        iter = rowSeatList.find((el) => (parseInt(el.gCol) === this.data.bestX - j))
      } else if (direction === '+') {
        iter = rowSeatList.find((el) => (parseInt(el.gCol) === this.data.bestX + j))
      }
      if (iter === undefined) {
        activeValue++
        roadDistance--
        if (roadDistance <= 0) {
          break
        } else {
          continue
        }
      }
      if (iter.nowIcon === iter.soldedIcon || iter.nowIcon === iter.fixIcon) {
        activeValue++
        effectiveSeat = []
        continue
      } else {
        effectiveSeat.push(iter)
      }
      if (effectiveSeat.length === value) {
        //预检
        if (this.preCheckSeatMakeEmpty(effectiveSeat)) {
          activeValue++
          effectiveSeat.shift()
          continue
        }
      }
    }
    return effectiveSeat
  },
  //预检澡间
  preCheckSeatMakeEmpty(arr) {
    let that = this
    // 开始计算是否留下空位 ------------ 开始
    let result = arr.every(function(element, index, array) {
      return that.checkSeat(element, arr)
    })
    // 开始计算是否留下空位 ------------ 结束
    return !result
  }
})