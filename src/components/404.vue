<template>
  <div id="not-found-msg">
    不好意思，我们没有要找的页面。也许，检查一下网址再试试？
  </div>
  <div><router-link to="/">返回首页</router-link></div>
</template>

<script>
export default {
  name: "404NotFound"
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