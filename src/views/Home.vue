<template>
    <v-container>
        <v-row justify="space-between">
            
            <v-col>
     <h1>以下哪种情况会使人类感觉呼吸较困难？</h1>   
            </v-col>
     <v-col cols="1">

        <v-progress-circular
      :rotate="360"
      :size="100"
      :width="15"
      :model-value="value"
      color="teal"
    >
      {{ value == 33.3 && "1/3"}}
    </v-progress-circular>
            
            </v-col>
        </v-row>
    <v-progress-linear model-value="20" stream></v-progress-linear>
        <v-row>
 <v-col v-for="choice in choices" :key="choice" cols="auto">
        <v-btn
          :ripple="false"
          min-height="72"
                    height="25vh"
                    max-height="45vh"
          min-width="35vw"
                    width="100%"
        >
                    {{choice}}
        </v-btn>
                </v-col>
        </v-row>
    </v-container>
    
</template>

<script lang="ts" >
  /*import HelloWorld from '@/components/HelloWorld.vue'*/
export default {
data(){
return {
value: 33.3,
choices: ["天气比平日冷时", "患上伤风感冒时", "做了热身运动后", "喝了热的饮料后"]
}
},
}
</script>
