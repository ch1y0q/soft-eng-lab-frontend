<template>
  <div class="main-page">
    <div class="bg">
      <img :src="imgSrc" alt="Background image" />
    </div>
    <div class="front">
      <div class="login-box">
        <img alt="vCourse logo" :src="require('@/assets/logo.png')">
        <h1>vCourse</h1>
        <Login/>
      </div>
    </div>
  </div>
</template>

<script>

import Login from '@/components/Login'

export default {
  name: 'MainPage',
  components: {
    Login
  },
  data() {
    return {
      imgSrc:require('@/assets/bg.jpg')
    }
  },
  methods: {

  }
};
</script>

<style scoped>
.bg{
  width:100%;
  height:100%;  /**宽高100%是为了图片铺满屏幕 */
  z-index:-1;
  position: absolute;
}

.bg img{
  width:100%;
  height:100%;
  filter:blur(2px);
}

.front{
  width:100%;
  height:100%;
  z-index:1;
  position: absolute;
  font-size: large;
}

.front h1{
  transition: color 1s ease-out;
  color: #4CB648;
  text-transform: none;
  text-shadow: whitesmoke;
}

.front :hover{
  transition: color 3s ease-in;
  color: #2c3e50;
}

.login-box {
  margin-top: 10%;
  margin-left: 30%;
  padding: 35px;
  width: 40%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 4px 11px 35px -14px rgb(0 0 0 / 50%);

}
</style>