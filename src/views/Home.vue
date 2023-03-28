<template>
  <v-container v-if="this.question.question != null">
    <v-row justify="space-between">
      <v-col>
        <h4 class="text-h4 color-primary" color="primary">
          {{ this.question.question }}
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
    <v-progress-linear
      class="my-2"
      color="primary"
      :model-value="(timer / timeLimit) * 100"
      height="5"
      stream
    ></v-progress-linear>
    <v-row align="center" justify="center">
      <v-col
        v-for="question in this.question.options"
        :key="question"
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
            {{ question }}
          </h5>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useFirestore, useCollection } from "vuefire";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";

const db = useFirestore();
const questionCollection = collection(db, "questions");
const questions = useCollection(questionCollection);
console.log(questions);
export default {
  data: function () {
    return {
      value: 33.3,
      question: {
        quertion: null,
        choices: [],
        answer: null,
        unit: null,
        id: null,
      },
      timeLimit: 20,
      timer: 20,
      interval: null,
    };
  },
  mounted() {
    this.getCount();
    this.timerFunction();
  },
  methods: {
    randomNumber: function (min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getCount: async function () {
      const db = useFirestore();
      const questionsRef = collection(db, "questions");
      /*const count = useCollection(questionsRef);*/
      const rand = await getCountFromServer(questionsRef).then((result) => {
        const count = result.data().count;
        console.log(count);

        const rand = this.randomNumber(0, count);
        console.log(questionsRef);
        console.log(rand);
        return rand;
      });
      const q = query(
        questionsRef,
        orderBy("question"),
        limit(1),
        startAt(rand)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data());
        this.question = doc.data();
      });

      console.log(this.question);
      await this.$nextTick(function () {});
    },
    timerFunction: function () {
      this.interval = setInterval(() => {
        if (this.timer === 0) {
          this.timer = this.timeLimit;
          clearInterval(this.interval);
                   this.endGame(); 
        } else {
          this.timer--;
        }
      }, 1000);
    },
    endGame: function () {
      console.log("end game");
    },
  },
};
</script>
