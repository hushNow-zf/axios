<template>
  <div class="home"></div>
</template>
<script>
// import request from "../request/http";
export default {
  name: "Home",
  components: {},
  mounted() {
    this.$request.$post("/addList", { a: 1 }).then((res) => {
      console.log("post", res);
    });
    this.$request.$get("/getList", { b: 1 }).then((res) => {
      console.log("get", res);
    });
  },
};
</script>
