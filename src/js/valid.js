Function.prototype.after = function(afterfn) {
    var self = this;
    return function() {
      var ret = self.apply(this, arguments);
      afterfn.call(this, ret);
      return ret;
    }
  }
  // 策略对象
var strategies = {
    isNonEmpty: function(value, errMsg) {
      if (value == "") {
        return errMsg
      }
    },
    minLength: function(value, len, errMsg) {
      if (value.length < len) {
        return errMsg;
      }
    },
    length: function(value, len, errMsg) {
      if (value.length != len) {
        return errMsg;
      }
    },
    isMobile: function(value, errMsg) {
      if (!/1[3|5|9][0-9]{9}/.test(value)) {
        return errMsg;
      }
    }
  }
  //Validator 对象
  /*
  add 定义规则 返回一个规则执行函数的数组
  start 执行规则 返回一个错误信息的结果
  都将具体的逻辑委托给了strategies 对象
  符合了单一职责和开放封闭原则
  开放算法的扩展
  封闭了Validator的修改
  */
var Validator = function() {
    this.cache = [];
  }
  // 为了做验证拼参数
Validator.prototype.add = function(dom, rules) {
    for (var i = 0, rule; rule = rules[i++];) {
      // 闭包利用的非常合理 把每个规则都封装到闭包里面真是神来之笔
      // 验证的函数是相对于规则来说的 其中公有的部分是对应的dom
      (function(rule) {
        // 私有的部分是规则内部的解析参数
        var strategArr = rule.stratege.split(":");
        var errMsg = rule.errMsg;
        var result;
        var ifInit = true;
        var stra;
        // 将验证的函数放到cache里面
        this.cache.push(function() {
          // 组装参数列表 这里的function都是闭包 里面的变量都不会被销毁
          if (ifInit) {
            stra = strategArr.shift();
            strategArr.push(errMsg);
            ifInit = false;
          }
          strategArr.unshift(dom.value);
          // console.log(stra, strategArr)
          return result = strategies[stra].apply(dom, strategArr);

        }.after(function(result) {
          console.log(errMsg, result)
          if (result == undefined) {
            dom.nextSibling.innerHTML = "";
          } else {
            dom.nextSibling.innerHTML = result;
          }
          strategArr.shift()
        }))
      }.bind(this))(rule)
    }
  }
  // 验证开始
Validator.prototype.start = function() {
    var ifValidate = false;
    for (var j = 0, validaFuncc; validaFuncc = this.cache[j++];) {
      var err = validaFuncc();
      // console.log(err)
      if (err) {
        // ifValidate = true;
        return err;
      }
    }
    // return ifValidate;
  }
  // 客户端调用
var registerForm = document.getElementById('registerForm');
var validator = new Validator();
var userName = document.getElementById('userName');
var phone = document.getElementById('phone');
var submit = document.getElementById('submit');
// validator.add(userName, [{
//   stratege: 'isNonEmpty',
//   errMsg: '用户名不能为空'
// }, {
//   stratege: 'minLength:10',
//   errMsg: '用户名长度不能小于10 位'
// }]);
validator.add(userName, [{
  stratege: 'isNonEmpty',
  errMsg: '用户名不能为空'
}]);

validator.add(phone, [{
  stratege: 'isNonEmpty',
  errMsg: '手机号不能为空'
}, {
  stratege: 'length:11',
  errMsg: '手机号为11位'
}]);


// validator.add(registerForm.passWord, [{
//   stratege: 'minLength:7',
//   errMsg: '密码长度不能小于7 位'
// }]);
// validator.add(registerForm.phoneNumber, [{
//   stratege: 'isMobile',
//   errMsg: '手机号码格式不正确'
// }]);

var validataFunc = function() {
  var errorMsg = validator.start();
  return errorMsg;
}
submit.onclick = function() {
  var errorMsg = validataFunc();
  if (errorMsg) {
    return false;
  }
};
// 策略模式
// 组合 不同类之间的组合
// 委托 将具体的实现委托给算法类
// 多态 发出同一个请求 参数不同 返回的结果也就不同 add start 等等函数
