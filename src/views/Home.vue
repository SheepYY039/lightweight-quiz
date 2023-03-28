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
          :model-value="(answered / 3) * 100"
          color="primary"
        >
          <h6 class="text-h6">{{ answered }}/3</h6>
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
        v-for="choice in this.question.choices"
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
import { useFirestore, useCollection } from "vuefire";
import {
  collection,
  documentId,
  FieldPath,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";

const db = useFirestore();
const questionCollection = collection(db, "questions");
const questions = useCollection(questionCollection);
console.log(questions);
export default {
  data: function () {
    return {
      value: 33.3,
      answered: 0,
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
    this.getQuestion();
    /*this.timerFunction();*/
  },
  methods: {
    rand: function () {
      const cryp = window.crypto || window.msCrypto;
      var tab = new Uint8Array(1);
      return cryp.getRandomValues(tab)[0] / 256;
    },
    shuffle: function (array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(this.rand() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    getQuestion: async function () {
      if (this.answered == 3) {
        this.endGame();
      }
      const db = useFirestore();
      const questionsRef = collection(db, "questions");
      var count = 0;
      var q;
      while (count <= 0) {
        const random = this.rand();
        console.log(random);
        q = query(questionsRef, where("random", ">=", random), limit(1));
        const snapshot = await getCountFromServer(q);
        count = snapshot.data().count;
        console.log(count);
      }

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data());
        this.question = doc.data();
      });

      console.log(this.question);
      await this.$nextTick(function () {});
      this.question.choices = [...this.question.options, this.question.answer];
      /*this.question.choices.push(this.question.answer);*/
      this.question.choices = this.shuffle(this.question.choices);
      this.answered++;
      this.timerFunction();
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
      /*this.nextQuestion();*/
    },
    nextQuestion: function () {
      console.log("next");
      this.getQuestion();
    },
  },
};
</script>
