<template>
  <div id="page-user">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xl6>
          <v-widget title="Basic Usage">
            <div slot="widget-content">
              <div>
                <v-btn color="success" @click="onSuccess">Success</v-btn>
                <v-btn color="error">Error</v-btn>
                <v-btn color="warning">Warning</v-btn>
                <v-btn color="info">Info</v-btn>
              </div>
            </div>
          </v-widget>              
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { http } from '@/axios'
export default {
  data () {
    return {
      text: 'center',
      loading4: false      
    };
  },
  computed: {
  },  
  watch: {
    loader () {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => {
        this[l] = false;
      }, 3000);
      this.loader = null;
    }
  },  
  methods: {
    onSuccess() {
      // alert(JSON.stringify(this.$store.getters.menu))
      http.get('/users/me').then((res) => { 
        console.log(res.data.permissions)
        
        console.log(res.data.permissions.indexOf('Role.UPDATEx'))

        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
};
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
