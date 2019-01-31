<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import LayoutAdmin from './layouts/Admin'
import LayoutDefault from './layouts/Default'

export default {
  components: {
    'layout-admin': LayoutAdmin,
    'layout-default': LayoutDefault
  },
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  },
  beforeCreate: function() {
    console.log('beforeCreate')
    if(!this.$store.getters.token){
      this.$store.dispatch("autoSignIn")
    }
  }
}
</script>

<style lang="stylus" scoped>
  .setting-fab 
    top:50%!important; 
    right:0;
    border-radius:0  
  .page-wrapper
    min-height:calc(100vh - 64px - 50px - 81px );  

</style>
