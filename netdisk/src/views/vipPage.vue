<!-- eslint-disable vue/no-parsing-error -->
<template>
    <body>
        <div class="app"><!-- cashier-nommal -->
    <div class="top-show"><!-- cashier-header-wrap normal -->
        <img src="../assets/pay_Center.png" style="padding-left: 350px;padding-top: 30px;">
    </div>
    <div class="cashier" style="display: flex;"><!-- guide-cashier-wrap -->
        <div class="big"><!-- data-v-d841eb90 data-v-2b34799d -->
            <div class="top"><!-- navbar-user-wrap is-new-cashier -->
                <div class="user_info"><!-- left -->
                    <img src="../assets/avatar.png" class="avatar">
                    <span style="color: #000;font-size: 14px;font-weight: 500;line-height: 100%;margin-left: 20px;margin-top: 18px;" v-if="username">Hi, {{ username }}</span>
                    <span style="color: #9A9A9A;font-size: 14px;font-weight: 500;line-height: 100%;margin-left: 20px;margin-top: 18px;" v-if="endTime">会员至：{{ endTime }}</span>
                </div>
            </div>
            <div class="fianl" style="display: none;">
            </div>
        </div>
        <!-- 主要内容区域 -->
        <div class="main-area"><!-- guide-cashier-main-area no-top -->
            <div class="left-part"><!-- guide-cashier-tab-split -->
                <div class="column-out"><!-- guide-main-tab-container-placeholder double -->
                    <div class="column"><!-- guide-main-tab-container -->
                        <div class="column1"><!-- tab-item active left_4 -->
                            <img src="../assets/Svip.png" alt="" width="77" height="35" style="display: block;">
                            <span style="color: #6b2d00;display: inline-block;font-size: 14px;font-weight: 400;margin-top: 4px;text-align: center;">享多项专属特权</span>
                        </div>
                        <div class="column2" style="margin-top: 10px;"><!-- tab-item after normal middle_4 -->
                            <span style="color: rgb(107, 45, 0);font-size: 28px;font-weight: 600;line-height: 16px;margin-top: 10px;">空间扩容</span>
                            <br>
                            <span style="color: rgb(107, 45, 0);color: #6b2d00;display: inline-block;font-size: 14px;font-weight: 400;margin-top: 4px;text-align: center;">享低价扩容</span>
                        </div>
                    </div>
                </div>
                <div class="left-inner"><!-- guide-cashier-inner-left -->
                    <div class="privilege-guide"><!-- privilege-guide -->
                        <span class="guide-text" style="font-size: 20px;padding-top: 35px;padding-left: 110px">
                            SVIP专享超大容量,极速下载特权
                        </span>
                    </div>
                    <div class="productList svip"><!-- productList svip -->
                        <div class="scrollInstance productListScroll"><!-- scrollInstance productListScroll -->
                            <div class="item" @click="rechargeOneYear"><!-- item -->
                                <div class="flex-item first-sku is-active svip main"><!-- flex-item first-sku is-active svip main -->
                                    <div class="data-v-13a4ca74"><!-- data-v-13a4ca74 -->
                                        <div class="product-name">一年</div><!-- product-name -->
                                        <div class="cost-info" style="padding-top: 10px;"><!-- cost-info -->
                                            <span class="rmb">￥</span>
                                            <span class="price" style="font-size: 40px;">360</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="item" @click="rechargeThreeMonths"><!-- item -->
                                <div class="flex-item first-sku is-active svip main"><!-- flex-item first-sku is-active svip main -->
                                    <div class="data-v-13a4ca74"><!-- data-v-13a4ca74 -->
                                        <div class="product-name">三个月</div><!-- product-name -->
                                        <div class="cost-info" style="padding-top: 10px;"><!-- cost-info -->
                                            <span class="rmb">￥</span>
                                            <span class="price" style="font-size: 40px;">120</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="item" @click="rechargeOneMonth"><!-- item -->
                                <div class="flex-item first-sku is-active svip main"><!-- flex-item first-sku is-active svip main -->
                                    <div class="data-v-13a4ca74"><!-- data-v-13a4ca74 -->
                                        <div class="product-name">一个月</div><!-- product-name -->
                                        <div class="cost-info" style="padding-top: 10px;"><!-- cost-info -->
                                            <span class="rmb">￥</span>
                                            <span class="price" style="font-size: 40px;">40</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tequan" style="text-align: center;padding-top: 20px;padding-right: 100px;">
                                <img src="../assets/解锁特权.png" alt="">
                                <img src="../assets/tequan.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-part">
                <div class="code-con">
                    <div class="pay-con">
                        <div class="pay-content">
                            <div class="QRcode" style="padding-top: 150px;text-align: center;">
                                <img src="../assets/QRcode.png" alt="" width="150" height="150">
                                <img src="../assets/paymethod.png" style="margin-top: 20px;">
                            </div>
                        </div>
                    </div>
                    <div class="agreement"></div>
                </div>
            </div>
        </div>
        </div>
    </div>
</body>
  </template>
<script>
export default {
  data () {
    return {
      username: '', // 初始化用户名为空
      endTime: '', // 初始化会员到期时间为空
      Authorization: this.$store.state.usertoken, // 设置认证信息
      userId: ''
    }
  },
  mounted () {
    // 在组件挂载后，调用接口获取用户信息
    this.fetchUserInfo()
  },
  methods: {
    async fetchUserInfo () {
      try {
        const response = await fetch('http://47.97.32.241:8080/user/info', {
          method: 'GET',
          headers: {
            Authorization: this.$store.state.usertoken
          }
        })

        const data = await response.json()
        console.log(data)
        // 检查返回的数据是否包含 username 和 endTime 属性
        if (data.data && data.data.username && data.data.vipVO && data.data.vipVO.endTime) {
          this.username = data.data.username
          this.endTime = data.data.vipVO.endTime
          this.userId = data.data.userId
        } else {
          console.error('User info data is incomplete:', data)
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    },

    async rechargeVIP (userId, money, duration) {
      try {
        const response = await fetch('http://47.97.32.241:8080/user/vip', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.$store.state.usertoken
          },
          body: JSON.stringify({
            userId: userId, // 用户ID
            money: money, // 充值金额
            duration: duration // VIP期限
          })
        })

        const data = await response.json()

        // 检查返回的数据
        if (response.ok) {
          this.$message({
            message: ('VIP充值成功!'),
            type: 'success',
            duration: 2000
          })
          this.endTime = data.data
          console.log('VIP充值成功，VIP结束时间：', data.data)
        // 在这里可以更新页面上的VIP结束时间显示
        } else {
          this.$message({
            message: ('VIP充值失败!'),
            type: 'error',
            duration: 2000
          })
          console.error('VIP充值失败:', data)
        // 在这里可以处理充值失败的情况
        }
      } catch (error) {
        console.error('VIP充值请求失败:', error)
      }
    },

    // 点击一年充值区域触发的方法
    rechargeOneYear () {
      this.rechargeVIP(this.userId, 360, 365) // 一年充值，期限为12个月，金额为360元
      this.fetchUserInfo()
    },
    // 点击三个月充值区域触发的方法
    rechargeThreeMonths () {
      this.rechargeVIP(this.userId, 120, 90) // 三个月充值，期限为3个月，金额为120元
      this.fetchUserInfo()
    },
    // 点击一个月充值区域触发的方法
    rechargeOneMonth () {
      this.rechargeVIP(this.userId, 40, 30) // 一个月充值，期限为1个月，金额为40元
      this.fetchUserInfo()
    }
  }
}
</script>
<style>
.cashier{
    background-image: url(../assets/vip_background.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 14px;
    margin: 0 auto;
    width: 850px;
    height: 600px;
    display: flex;
}
.big{
    height: 50px;
}

.top{
    height: 80px;
    width:100%;
    padding-left: 20px;
    display: flex;
}

.user_info{
    position: relative;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    line-height: 36px;
    padding: 14px 24px 0;
    width: 100%;
    text-align: center;
    padding-left: 20px;
}
.avatar{
    border: .75px solid rgba(3, 8, 26, .102);
    border-radius: 50%;
    height: 36px;
    margin-right: 8px;
    width: 36px;
    display: flex;
}
.main-area{
    height: 534px;
    border-radius: 8px;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    height: 500px;
    margin: 0 8px 8px;
    overflow: hidden;
    position: absolute;
    top: 10%;
    left: 30%;
    width: auto;
    padding-top: 70px;
}
.final{
    background: #000;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    left: 50%;
    margin: auto;
    opacity: .7;
    padding: 15px 20px;
    position: fixed;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%,-50%);
    width: -webkit-max-content;
    width: max-content;
    z-index: 4000;
}

.left-part{
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    width: 500px;
}
.right-part{
    backdrop-filter: blur(19px);
    background-color: hsla(0, 0%, 100%, .8);
    margin-left: 1px;
    width: 212px;
    background-color: #FFFAF7;
}
.column-out{
    height: 70px;
}
.column{
    background-color: hsla(0, 0%, 100%, .4);
    border: 1px solid hsla(0, 0%, 100%, .2);
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    height: 60px;
    left: 0;
    position: absolute;
    width: 500px;
    z-index: 1;
}
.column1{
    -webkit-align-items: center;
    align-items: center;
    cursor: pointer;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-user-select: none;
    user-select: none;
    width: 50%;
    background-color:white;
}
.column1.active{
    padding-right: 16px;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: unset;
}
.column2{
    padding-left: 50px;
    width: 30%;
    text-align: center;
}
.column2.normal{
    background-image: none;
    opacity: .7;
}
.column2.after{
    padding-left: 0;
}
.left-inner{
    background-color: #fff;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    width: 621px;
}
.guide-text{
    -webkit-align-items: center;
    align-items: center;
    color: #6b2d00;
    display: -webkit-flex;
    display: flex;
    font-size: 12px;
    line-height: 12px;
}
.productList{
    height: 126px;
    margin-bottom: 14px;
    padding-top: 22px;
    width: 100%;
}
.scrollInstance{
    height: 200px;
    z-index: 11;
    position: relative;
}
.item{
    display: inline-block;
    padding-left: 30px;
}
.flex-item.main.is-active.svip{
    background: linear-gradient(101.37deg, #fff9c6 1.05%, #ffe1c2 97.37%);
    border-radius: 12px;
    box-shadow: inset 0 0 0 3px #ffb66d;
}
.flex-item.main.is-active {
    background: linear-gradient(135deg, #fffaf7, #fff9f7 .01%, #fff4f4);
    border-radius: 12px;
    box-shadow: inset 0 0 0 3px #ff8845;
}
.flex-item.main.first-sku {
    width: 126px;
}
.flex-item.main {
    width: 126px;
}
.flex-item {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(135, 143, 158, .21);
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    height: 126px;
    margin-right: 8px;
    position: relative;
    text-align: center;
    -webkit-user-select: none;
    user-select: none;
}
.product-name{
    color: #6b2d00;
    font-weight: 700;
    padding-top: 14px;
}
.cost-info{
    color: #f60;
    width: 100%;
    height:150px;
}
.rmb{
    font-size: 16px;
    line-height: 20px;
    vertical-align: baseline;
}
.price{
    font-family: NDUX Medium;
    font-size: 30px;
    line-height: 42px;
    vertical-align: baseline;
    font-weight: 700;
}
.monthly-cost{
    background-color: white;
    width: 50%;
    border-radius: 20%;
    font-family: NDUX Medium;
    font-size: 300;
}
.code-con{
    height: 100%;
    position: relative;
}
.pay-con{
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
}
.pay-content{
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
}
</style>
