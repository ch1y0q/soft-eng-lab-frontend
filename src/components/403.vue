<template>
  <div id="not-found-msg">
    不好意思，您没有权限进入此页面。也许，换一个身份再试试？
  </div>
  <div>
    <a-button @click="$router.go(-2)">返回上一页</a-button>
  </div>
</template>

<script>
export default {
  name: "403Forbidden"
}
</script>

<style scoped>
div {
  text-align: center;
}

#not-found-msg {
  font-size: x-large;
}
</style>