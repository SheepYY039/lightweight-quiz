<template>
  <v-container v-if="this.question.question != null || this.showDialog">
    <v-dialog
      fullscreen
      persistent
      v-model="showDialog"
      class="fill-height fill-width"
    >
      <v-card class="px-auto" height="auto" color="secondary">
        <div class="py-12 text-center">
          <v-icon
            class="mb-6"
            color="primary"
            icon="mdi-rocket"
            size="128"
          ></v-icon>

          <div class="text-h2 font-weight-bold">{{ this.dialogTitle }}</div>
          <div class="text-h4 font-weight-bold">{{ this.dialogText }}</div>
        </div>
        <v-btn
          rounded="lg"
          size="x-large"
          class="mx-auto"
          color="primary"
          @click="showDialog = false"
          >开始游戏</v-btn
        >
      </v-card>
    </v-dialog>

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
          @click="checkAnswer"
        >
          <h5 class="text-h5">
            {{ choice }}
          </h5>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
      showDialog: true,
      dialogText: "Start Game Now!",
      dialogTitle: "Start Game Now!",
    };
  },
  mounted() {
    // this.getQuestion();
    /*this.timerFunction();*/
    this.showDialog = true;
  },
  watch: {
    showDialog: function (value) {
      // If show Dialog == game finish, either time up or wrong
      //stop timer
      // If close Dialog, start game, activate timer
      if (!value) {
        this.getQuestion();
        this.timerFunction();
      }
    },
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
      // this.timerFunction();
    },
    timerFunction: function () {
      this.interval = setInterval(() => {
        if (this.timer === 0) {
          // Times up, reset timer
          //this.timer = this.timeLimit;
          /*clearInterval(this.interval);*/
          this.dialogTitle="Time's UP!"
          this.endGame();
        } else {
          // decrement timer
          this.timer--;
        }
      }, 1000);
    },
    checkAnswer: function (event) {
      console.log(event.target.innerText);
      const response = event.target.innerText;
      if (response == this.question.answer) {
        //answered correct
        if (this.answered >= 3) {
          // answered 3 questions
          this.dialogTitle="All Correct!"
          this.endGame();
        } else {
          // continue next question
          this.nextQuestion();
        }
      } else {
        //Answer wrong
        this.endGame();
          this.dialogTitle="Oops!"
      }
    },
    endGame: function () {
      console.log("end game");
      //Stop interval
      clearInterval(this.interval);
      this.answered = 0;
      this.showDialog = true;
      //reset timer
      this.timer = this.timeLimit;
      /*this.nextQuestion();*/
    },
    nextQuestion: function () {
      console.log("next");
      this.getQuestion();
    },
  },
};
</script>
