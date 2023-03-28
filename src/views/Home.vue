<template>
  <v-container>
    <v-row justify="space-between">
      <v-col>
        <h4 class="text-h4 color-primary" color="primary">
          以下哪种情况会使人类感觉呼吸较困难？
        </h4>
      </v-col>
      <v-col cols="1">
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="15"
          :model-value="value"
          color="primary"
        >
          <h6 class="text-h6">
            {{ value == 33.3 && "1/3" }}
          </h6>
        </v-progress-circular>
      </v-col>
    </v-row>
    <v-progress-linear class="my-2" color="primary" model-value="20" height="5" stream></v-progress-linear>
    <v-row align="center" justify="center">
      <v-col
        v-for="choice in choices"
        :key="choice"
        class="text-center"
        cols-lg="12"
        cols="auto"
      >
        <v-btn
          :ripple="false"
          min-height="72"
          height="25vh"
          max-height="45vh"
          min-width="35vw"
          width="100%"
          size="x-large"
          color="secondary"
          theme="primary"
        >
          <h5 class="text-h5">
            {{ choice }}
          </h5>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/*import HelloWorld from '@/components/HelloWorld.vue'*/
export default {
  data() {
    return {
      value: 33.3,
      choices: [
        "天气比平日冷时",
        "患上伤风感冒时",
        "做了热身运动后",
        "喝了热的饮料后",
      ],
    };
  },
};
</script>
