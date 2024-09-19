<template>
  <div class="login">
    <!-- 手机号登录 -->
    <el-form v-if="loginType === 'phone'" ref="phoneLoginForm" :model="phoneLoginForm" :rules="phoneLoginRules" class="login-form">
      <h3 class="fz-font title">中后台管理系统</h3>
      <el-form-item prop="phone">
        <el-input v-model="phoneLoginForm.phone" type="text" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input v-model="phoneLoginForm.verifyCode" auto-complete="off" placeholder="验证码">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          <div v-if="!computeTime" class="pointer" slot="append" @click="getVerify">获取验证码</div>
          <div v-if="computeTime" class="pointer login-verify-code" slot="append">{{ computeTime }} S</div>
        </el-input>
      </el-form-item>
      <div v-if="loginType === 'account'" class="flex-space-between mb20">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        <div class="pointer text-blue login-forget">忘记密码？</div>
      </div>

      <el-form-item style="width: 100%">
        <el-button class="login-btn" :loading="loading" size="medium" style="width: 100%" @click.native.prevent="handleSMSLogin">
          <span v-if="!loading" native-type="submit">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <div class="flex-space-around mb20">
        <div class="pointer box" @click.prevent="switchLoginType('account')">账号密码</div>
        <div class="pointer box" @click.prevent="switchLoginType('register')">注册</div>
      </div>
      <el-divider>其他方式登录</el-divider>
      <div class="flex-space-around mb20">
        <svg-icon class="pointer" style="width: 30px; height: 30px" icon-class="github" @click="getGithubCode" />
        <svg-icon class="pointer" style="width: 30px; height: 30px" icon-class="gitee" @click="getGiteeCode" />
      </div>
    </el-form>

    <!-- 账号密码登录 -->
    <el-form v-if="loginType === 'account'" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="fz-font title">中后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="手机号">
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

      <div v-if="loginType === 'account'" class="flex-space-between mb20">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        <div class="pointer text-blue login-forget">忘记密码？</div>
      </div>

      <el-form-item style="width: 100%">
        <el-button class="login-btn" :loading="loading" size="medium" style="width: 100%" @click.native.prevent="handleLogin">
          <span v-if="!loading" native-type="submit">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <div class="flex-space-around mb20">
        <div class="pointer box" @click.prevent="switchLoginType('phone')">手机号登录</div>
        <div class="pointer box" @click.prevent="switchLoginType('register')">注册</div>
      </div>
      <el-divider>其他方式登录</el-divider>
      <div class="flex-space-around mb20">
        <svg-icon class="pointer" style="width: 30px; height: 30px" icon-class="github" @click="getGithubCode" />
        <svg-icon class="pointer" style="width: 30px; height: 30px" icon-class="gitee" @click="getGiteeCode" />
      </div>
    </el-form>

    <!-- 账号注册 -->
    <el-form v-if="loginType === 'register'" ref="SMSRegisterForm" :model="SMSRegisterForm" :rules="SMSRegisterFormRules" class="login-form">
      <h3 class="fz-font title">中后台管理系统</h3>
      <el-form-item prop="phone">
        <el-input v-model="SMSRegisterForm.phone" type="text" auto-complete="off" placeholder="手机号">
          <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input v-model="SMSRegisterForm.verifyCode" auto-complete="off" placeholder="验证码">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          <div v-if="!computeTime" class="pointer" slot="append" @click="getRegisterVerify">获取验证码</div>
          <div v-if="computeTime" class="pointer login-verify-code" slot="append">{{ computeTime }} S</div>
        </el-input>
      </el-form-item>
      <div v-if="loginType === 'account'" class="flex-space-between mb20">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        <div class="pointer text-blue login-forget">忘记密码？</div>
      </div>

      <el-form-item style="width: 100%">
        <el-button class="login-btn" :loading="loading" size="medium" style="width: 100%" @click.prevent="handleSMSRegister">
          <span v-if="!loading" native-type="submit">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form-item>
      <el-button class="register-btn" size="medium" style="width: 100%" @click.prevent="switchLoginType('phone')"> 返回登录 </el-button>
      <el-divider>其他方式登录</el-divider>
      <div class="flex-space-around mb20">
        <svg-icon class="pointer" style="width: 30px; height: 30px" icon-class="github" @click="getGithubCode" />
        <svg-icon class="pointer" style="width: 30px; height: 30px" icon-class="gitee" @click="getGiteeCode" />
      </div>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-{{ new Date().getFullYear() }} gavin All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, getGiteeCodeApi, getGithubApi, getRegisterCode, getSmsCode } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { getUrlParams } from '@/utils/index'

export default {
  name: 'Login',
  data() {
    return {
      loginType: 'phone',
      codeUrl: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      phoneLoginForm: {
        phone: '18826078154',
        uuid: '',
        verifyCode: ''
      },
      SMSRegisterForm: {
        phone: '18826078154',
        uuid: '',
        verifyCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      phoneLoginRules: {
        phone: [{ required: true, trigger: 'blur', message: '请输入您的手机' }],
        verifyCode: [{ required: true, trigger: 'trigger', message: '请输入验证码' }]
      },
      SMSRegisterFormRules: {
        phone: [{ required: true, trigger: 'blur', message: '请输入您的手机' }],
        verifyCode: [{ required: true, trigger: 'trigger', message: '请输入验证码' }]
      },
      registerLoginForm: {},
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

      if (code && res.source !== 'github') this.handleGiteeLogin(code, uuid)
      if (code && res.source === 'github') this.handleGithubLogin(code, uuid)
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
        if (this.phoneLoginForm.phone) {
          getSmsCode(this.phoneLoginForm.phone).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '验证码已发送',
                type: 'success'
              })
              this.phoneLoginForm.uuid = res.uuid
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
      }
    },
    getRegisterVerify() {
      if (!this.computeTime) {
        if (this.SMSRegisterForm.phone) {
          getRegisterCode(this.SMSRegisterForm.phone).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '验证码已发送',
                type: 'success'
              })
              this.SMSRegisterForm.uuid = res.uuid
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

    switchLoginType(type) {
      this.loginType = '' // 清空当前的 loginType
      this.$nextTick(() => {
        this.loginType = type // 在下一个 DOM 更新周期中设置新的 loginType
      })
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
      const { authorizeUrl } = await getGiteeCodeApi()
      console.log('authorizeUrl', authorizeUrl)
      window.location.href = authorizeUrl
    },

    async getGithubCode() {
      const { authorizeUrl } = await getGithubApi()
      console.log('authorizeUrl', authorizeUrl)
      window.location.href = authorizeUrl
    },

    handleSMSLogin() {
      this.$refs.phoneLoginForm.validate(valid => {
        if (valid) {
          this.loading = true

          const smsLoginForm = {
            phone: this.phoneLoginForm.phone,
            smsCode: this.phoneLoginForm.verifyCode,
            uuid: this.phoneLoginForm.uuid
          }

          this.$store
            .dispatch('SmsLogin', smsLoginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    handleSMSRegister() {
      this.$refs.SMSRegisterForm.validate(valid => {
        if (valid) {
          this.loading = true

          const SMSRegisterForm = {
            phone: this.SMSRegisterForm.phone,
            smsCode: this.SMSRegisterForm.verifyCode,
            uuid: this.SMSRegisterForm.uuid
          }

          this.$store
            .dispatch('SMSRegister', SMSRegisterForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    handleGithubLogin(code, uuid) {
      const loading = this.$loading({
        lock: true,
        text: ' 正在登录...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const data = { code, uuid, source: 'github' }
        this.$store.dispatch('GithubLogin', data).then(res => {
          console.log('ThirdLogin success will go homePage', JSON.stringify(res))
          this.$router.push({ path: this.redirect || '/' })
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
      }
    },

    handleGiteeLogin(code, uuid) {
      const loading = this.$loading({
        lock: true,
        text: ' 正在登录...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const data = { code, uuid, source: 'gitee' }
        this.$store.dispatch('ThirdLogin', data).then(res => {
          console.log('ThirdLogin success will go homePage', JSON.stringify(res))
          this.$router.push({ path: this.redirect || '/' })
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
  background-image: url('../assets/images/login-background.png');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 13px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
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

.login-btn {
  background-color: #3c76c8;
  color: #fff;
  &:hover {
    background-color: lighten(#3c76c8, 10%);
    color: #fff;
  }
}

.register-btn {
  background-color: #fefefe;
  color: #000;
  &:hover {
    background-color: lighten(#fefefe, 10%);
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

.login-type {
  margin-bottom: 20px;
}

.login-forget {
  font-size: 14px;
  &:hover {
    color: lighten(#46a0ff, 10%);
  }
}

.box {
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid #cececd;
  border-radius: 6px;
  &:hover {
    color: #437ecb;
    border: 1px solid #437ecb;
  }
}

.login-verify-code {
  width: 100px;
  white-space: nowrap;
  text-align: center;
}
</style>
