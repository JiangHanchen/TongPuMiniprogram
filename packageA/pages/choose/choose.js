var app;
Page({
  data: {
    //避免绑定事件被连续点击的变量：是否可以点击
    isclicked: true,
    //结果：储存0/1序列
    result: [],
    //得分
    score: 0,
    //计时器
    timer: '',
    //判断是否有选项被选择
    isSelected: false,
    //选择的题
    answerSelected: [],
    //所有的题
    questions: [],
    //单个题目
    question: [],
    //初始题的索引
    amount: 1,
    //白色底部背景初始的高度，以便之后onLoad中js修改
    height: 0,
    //倒计时初始数值
    countDownNum: 20
  },
  onReady() {
    //在显示页面时用canvas画图
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        //获取canvas节点
        const canvas = res[0].node
        //获取绘图上下文
        const ctx = canvas.getContext('2d')
        //获取像素比
        const dpr = wx.getSystemInfoSync().pixelRatio;
        //以下三行为自适应屏幕(小bug：设置但是不能在不同机型中改变canvas大小  PS：也有可能是因为在 ctx.scale(dpr*2/3, dpr*2/3) 缩放中设置为2/3，因而效果不明显)
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr * 2 / 3, dpr * 2 / 3);
        //画最外圈白色背景圆
        ctx.fillStyle = "#f3f4f7"
        ctx.lineWidth = 5
        ctx.lineCap = "butt"
        ctx.beginPath()
        ctx.arc(50, 50, 45, 1.5 * Math.PI, 3.5 * Math.PI, false)
        ctx.fill()
        //画第二外蓝色背景圆 
        ctx.lineWidth = 4
        ctx.fillStyle = "#3893ef"
        ctx.lineCap = "butt"
        ctx.beginPath()
        ctx.arc(50, 50, 40, 1.5 * Math.PI, 3.5 * Math.PI, false)
        ctx.fill()
        //画最内侧白色背景圆
        ctx.lineWidth = 4
        ctx.fillStyle = "#f4f4f6"
        ctx.lineCap = "butt"
        ctx.beginPath()
        ctx.arc(50, 50, 32, 1.5 * Math.PI, 3.5 * Math.PI, false)
        ctx.fill()
        //先画固定文字'20'
        ctx.beginPath();
        ctx.font = 'bolder 25px serif'
        ctx.fillStyle = "#338de8" // 字体颜色
        ctx.textAlign = 'center' // 字体位置
        ctx.textBaseline = 'middle' // 字体对齐方式
        ctx.fillText(this.data.countDownNum, 50, 50); // 文字内容和文字坐标
      })
  },
  onLoad: function () {
    //加载页面时对 白色背景 高度进行设置
    //通过获取window窗高度和宽度实现不同机型自适应高度
    let screenHeight = wx.getSystemInfoSync().windowHeight;
    let screenWidth = wx.getSystemInfoSync().windowWidth;
    let cal = 750 / screenWidth;
    this.setData({
      height: cal * screenHeight - 150 + "rpx"
    });
    console.log('页面刚加载时用户选项', this.data.answerSelected)
    //把全局数据(题库)加载到页面数据中，即赋值questions
    wx.cloud.database().collection('questions')
      .where({})
      .get()
      .then(res => {
        console.log('题库数据', res)
        var question1 = res.data
        let question = question1[this.data.amount - 1]
        this.setData({
          questions: question1,
          question: question,
        })
        wx.setStorageSync('questions',question1)
        console.log('本地缓存题库：',this.data.questions)
      })
    //加载页面时要设置倒计时
    this.countDown()
  },
  onShow: function () {
    if (wx.canIUse('hideHomeButton')) {
      wx.hideHomeButton()
    }
  },
  //对点击选项的绑定事件
  answerSelected: function (e) {
    this.setData({
      isclicked: false
    })
    //获取索引，用于根据索引设置选项的选中状态
    let idx = e.currentTarget.dataset.idx
    //每次点击都进行遍历，先将所有选项的选中状态设置为未选中
    for (let item of this.data.question.options) {
      item.selected = false;
    }
    //对选定的选项，根据索引idx设置选中状态
    this.data.question.options[idx].selected = true
    //此时由于部分view组件的class类名发生变化，必须刷新数据，通过重设置question来刷新数据，得以切换选中状态
    this.setData({
      question: this.data.question
    })
    //对选择的选项的数据保存
    this.data.answerSelected.push(this.data.question.options[idx].index)
    console.log(this.data.answerSelected)
    //设置点击选项后计时器的清除
    clearInterval(this.data.timer)
    //重设countDownNum
    this.setData({
      countDownNum: 21
    })
    //判断数据是否进行到第十题，在第十题后amount不再增加，计时器不再启用
    if (this.data.amount != 10) {
      //点击后重启计时器
      this.countDown()
      //设置延时下一题数据渲染，延迟一秒(由于计时器的清除需要时间，而数据渲染很快)
      setTimeout(() => {
        //对题目索引加一
        this.data.question.options[idx].selected = false
        let num = this.data.amount + 1
        //把下一题数据赋值给question
        let question = this.data.questions[num - 1]
        //在页面的data数据进行修改
        this.setData({
          isclicked: true,
          amount: num,
          question
        })
      }, 1000)
    }
    if (this.data.amount == 10) {
      setTimeout(() => {
        this.data.question.options[idx].selected = false
        wx.redirectTo({
          url: '/packageA/pages/GotScore/GotScore',
        })
      }, 1000)
    }
    if (this.data.answerSelected.length == 10) {
      wx.setStorageSync('answerSelected', this.data.answerSelected)
    }
  },
  //倒计时的方法封装
  countDown: function () {
    let that = this
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //以下再次获取canvas的因为是：cover-view组件无法覆盖canvas组件，而需要倒计时每秒减一，只能在已绘画的图层上再画白色背景和文字，以实现动态的倒计时变化
        const query = wx.createSelectorQuery()
        query.select('#myCanvas')
          .fields({
            node: true,
            size: true
          })
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            //画白色背景
            ctx.lineWidth = 4
            ctx.fillStyle = "#f4f4f6"
            ctx.lineCap = "butt"
            ctx.beginPath()
            ctx.arc(50, 50, 32, 1.5 * Math.PI, 3.5 * Math.PI, false)
            ctx.fill()
            //绘制文字
            ctx.beginPath();
            ctx.font = 'bolder 25px serif'
            ctx.fillStyle = "#338de8" // 字体颜色
            ctx.textAlign = 'center' // 字体位置
            ctx.textBaseline = 'middle' // 字体对齐方式
            ctx.fillText(countDownNum, 50, 50); // 文字内容和文字坐标
          })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭

          //既然countDownNum为0必然为未选择选项状态，此时应该向 answerSelected 添加空
          that.data.answerSelected.push('')
          console.log(that.data.answerSelected)
          //先清空计时器，以便重启
          clearInterval(that.data.timer);
          //将倒计时初始值设置为21(如果设置为20，用户只能看到初始倒计时为19)
          that.data.countDownNum = 21;
          //判断是否是第10个题，不是的话重启计时器，索引加一，题目切换下一题
          if (that.data.amount != 10) {
            that.countDown()
            setTimeout(() => {
              let num = that.data.amount + 1
              let question = that.data.questions[num - 1]
              that.setData({
                amount: num,
                question
              })
            }, 1000)
            //关闭定时器之后，可作其他处理codes go here
          } else {
            if (that.data.answerSelected.length == 10) {
              
              wx.setStorageSync('answerSelected', that.data.answerSelected)
              console.log('为选择时传过来的用户选择',that.data.answerSelected)
            }
            setTimeout(() => {
              wx.redirectTo({
                url: '/packageA/pages/GotScore/GotScore',
              })
            }, 1000)
          }
        }
        that.data.countDownNum = 20;
      }, 1000)
    });
    
  },
  onUnload: function () {
    this.setData({
      amount: 1,
      answerSelected: []
    })
  }
})