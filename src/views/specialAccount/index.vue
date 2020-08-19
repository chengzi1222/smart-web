<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import * as storage from "utils/sessionStorage";
  export default {
    methods: {

    },
    data() {
      return {

      };
    },
    mounted() {
      this.$store.dispatch("login", {login: "18100000000",password: "111111"}).then(result => {
        storage.setCookie("system", 'FOOD');
        this.$store.dispatch('getMenus', 'FOOD');
        setTimeout(() => {
          this.$router.push('/yb/main/monitoring');
        }, 1000);
      });
    }
  }
</script>

<style scoped lang="sass">

</style>