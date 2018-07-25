Vue.filter("money", function (value, type) {
  return "￥" + value.toFixed(2) + type
})
new Vue({
  el: "#app",
  data: {
    totalMoney: 0,
    productList: [],
    checkAllFlag: false,
    delFlag: false
  },
  filters: {
    formatMoney: function (value) {
      return "￥" + value.toFixed(2)//toFixed精度丢失
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.cartView()
    })
  },
  methods: {
    cartView: function () {
      var _this = this
      this.$http.get("data/cartData.json", { "id": 123 }).then(function (res) {
        _this.productList = res.data.result.list
      })

      //es6
			/*this.$http.get("data/cartData.json",{"id": 123}).then(res=>{
				this.productList = res.data.result.list
			})*/
    },
    changeMoney: function (product, index) {
      if (index > 0) {
        product.productQuantity++
      } else {
        product.productQuantity--
        if (product.productQuantity < 2) {
          product.productQuantity = 1
        }
      }
      this.calcTotalPrice()
    },
    selectedProduct: function (item) {
      if (typeof item.checked == 'undefined') {
        //Vue.set(item,"checked",true)//全局注册
        this.$set(item, "checked", true)//局部注册
      } else {
        item.checked = !item.checked
      }
      var k = 0
      this.productList.forEach(function (item, index) {
        if (item.checked) {
          k++
        }
      })
      if (k == this.productList.length) {
        this.checkAllFlag = true
      } else {
        this.checkAllFlag = false
      }
      this.calcTotalPrice()
    },
    checkAll: function (flag) {
      this.checkAllFlag = flag
      var _this = this
      this.productList.forEach(function (item, index) {
        if (typeof item.checked == 'undefined') {
          _this.$set(item, "checked", _this.checkAllFlag)
        } else {
          item.checked = _this.checkAllFlag
        }
      })
      this.calcTotalPrice()
    },
    calcTotalPrice: function () {
      var _this = this
      this.totalMoney = 0
      this.productList.forEach(function (item, index) {
        if (item.checked) {
          _this.totalMoney += item.productPrice * item.productQuantity
        }
      })
    },
    delProduct: function () {
      this.productList.splice(this.pindex, 1);
      this.delFlag = false;
    }
  }
})