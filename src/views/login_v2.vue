<template>
  <div class="login">
    <!-- 账号密码登录 -->
    <el-form v-if="!isMobile" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">admin后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
          <span v-if="!loading" native-type="submit">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right">
          <button class="link-type" @click.prevent="getGiteeCode">Github授权登录</button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 手机号登录 -->
    <el-form v-if="isMobile" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">admin后台管理系统</h3>
      <el-form-item prop="mobile">
        <el-input v-model="loginForm.mobile" type="text" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input v-model="loginForm.verifyCode" auto-complete="off" placeholder="验证码" style="width: 63%">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <button type="button" @click="getVerify" class="pointer login-verify-code">获取验证码</button>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleSMSLogin">
          <span v-if="!loading" native-type="submit">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right">
          <button class="link-type" @click.prevent="getGiteeCode">Github授权登录</button>
        </div>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2022 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, getGiteeCode, getSmsCode } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { getUrlParams } from '@/utils/index'

export default {
  name: 'Login',
  data() {
    return {
      isMobile: true,
      codeUrl: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        rememberMe: false,
        code: '',
        uuid: '',
        mobile: '',
        verifyCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        mobile: [{ required: true, trigger: 'blur', message: '请输入您的手机' }]
      },
      computeTime: false,
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCookie()
    this.getCode()

    try {
      const res = getUrlParams()
      const code = res?.code
      const uuid = res?.state
      console.log('🚀 >> created >> res:', res)

      if (code) this.handleCodeLogin(code, uuid)
    } catch (error) {}
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getVerify() {
      if (!this.computeTime) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            getSmsCode(this.loginForm.mobile).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '验证码已发送',
                  type: 'success'
                })
                this.loginForm.uuid = res.uuid
                this.computeTime = 60
                this.timer = setInterval(() => {
                  this.computeTime--
                  if (this.computeTime <= 0) {
                    clearInterval(this.timer)
                  }
                }, 1000)
              }
            })
          }
        })
      } else {
        getSmsCode(this.loginForm.mobile).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '验证码已发送',
              type: 'success'
            })
            this.loginForm.uuid = res.uuid
            this.computeTime = 60
            this.timer = setInterval(() => {
              this.computeTime--
              if (this.computeTime <= 0) {
                clearInterval(this.timer)
              }
            }, 1000)
          }
        })
      }
    },

    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
              if (this.captchaOnOff) {
                this.getCode()
              }
            })
        }
      })
    },

    async getGiteeCode() {
      const { authorizeUrl } = await getGiteeCode()
      console.log('authorizeUrl', authorizeUrl)
      window.location.href = authorizeUrl
    },

    handleSMSLogin() {
      this.loading = true
      if (this.loginForm.rememberMe) {
        Cookies.set('mobile', this.loginForm.mobile, { expires: 30 })
        Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
      } else {
        Cookies.remove('mobile')
        Cookies.remove('rememberMe')
      }

      const smsLoginForm = {
        mobile: this.loginForm.mobile,
        smsCode: this.loginForm.verifyCode,
        uuid: this.loginForm.uuid
      }

      this.$store
        .dispatch('SmsLogin', smsLoginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || '/' }).catch(() => {})
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleCodeLogin(code, uuid) {
      const loading = this.$loading({
        lock: true,
        text: ' 正在登录...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const data = { code, uuid, source: 'gitee' }
        this.$store.dispatch('ThirdLogin', data).then(res => {
          console.log('ThirdLogin sucess will go homePage', JSON.stringify(res))
          this.$router.push({ path: '/' })
        })
      } catch (error) {
        this.$message({
          message: '授权登录失败,请重试',
          type: 'error'
        })
        setTimeout(() => {
          window.location = '/login'
        }, 500)
      } finally {
        loading.close()
        // window.location = '/'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}

.login-verify-code {
  height: 38px;
  border: none;
  background-color: #fefefe;
}
</style>
