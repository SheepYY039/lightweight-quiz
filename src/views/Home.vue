<template>
  <video-background src="public/assets/lion.mp4" style="height: 100vh">
    <v-container>
      <audio
        ref="audio"
        src="https://music.163.com/song/media/outer/url?id=1901371647.mp3"
        autoplay
        loop
        preload="auto"
      ></audio>
      <v-dialog
        fullscreen
        persistent
        v-model="showDialog"
        class="fill-height fill-width"
      >
        <v-card class="px-auto" color="secondary">
          <div class="py-12 text-center">
            <v-icon
              class="mb-6"
              color="primary"
              icon="mdi-rocket"
              size="128"
            ></v-icon>

            <div class="text-h2 font-weight-bold">{{ this.dialogTitle }}</div>
            <div class="text-h4 mx-auto">{{ this.dialogText }}</div>
          </div>
          <v-btn
            rounded="lg"
            size="x-large"
            class="mx-auto"
            color="primary"
            @click="showDialog = false"
            >开始游戏</v-btn
          >
          <v-card
            v-if="this.wrongAnswer != ''"
            class="mx-auto my-2 mt-6"
            :flat="true"
            width="400"
            prepend-icon="mdi-close-thick"
            color="error"
            variant="elevated"
          >
            <template v-slot:title>
              <div class="text-h6 font-weight-bold">
                {{ this.wrongAnswer }}
              </div></template
            >
          </v-card>
          <v-card
            v-if="this.correctAnswer != ''"
            class="mx-auto my-2"
            width="400"
            :flat="true"
            prepend-icon="mdi-check-bold"
            color="success"
            variant="elevated"
          >
            <template v-slot:title>
              <div class="text-h6 font-weight-bold">
                {{ this.correctAnswer }}
              </div>
            </template>
          </v-card>
        </v-card>
      </v-dialog>
      <template v-if="this.questions[this.answered]">
        <v-row justify="space-between">
          <v-col>
            <h4 class="text-h4 color-primary" color="primary">
              {{ this.questions[this.answered].question }}
            </h4>
          </v-col>
          <v-col cols="1">
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :model-value="((answered + 1) / 3) * 100"
              color="primary"
            >
              <h6 class="text-h6">{{ answered + 1 }}/3</h6>
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
            v-for="choice in this.questions[this.answered].choices"
            :key="choice + answered"
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
      </template>
    </v-container>
  </video-background>
</template>

<script>
import { useFirestore, useCollection } from "vuefire";
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const db = useFirestore();
const questionCollection = collection(db, "questions");
const allQuestions = useCollection(questionCollection);
console.log(allQuestions);
export default {
  data: function () {
    return {
      value: 33.3,
      answered: 0,
      questions: [
        {
          question: null,
          choices: [],
          answer: null,
          unit: null,
          id: null,
        },
      ],
      timeLimit: 30,
      timer: 30,
      interval: null,
      showDialog: true,
      dialogText: "點擊按鈕開始遊戲",
      dialogTitle: "立刻開始！",
      correctAnswer: "",
      wrongAnswer: "",
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
        this.wrongAnswer = "";
        this.correctAnswer = "";
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
        q = query(
          questionsRef,
          where("random", ">=", random > 0.8 ? random - 0.2 : random),
          limit(3)
        );
        const snapshot = await getCountFromServer(q);
        count = snapshot.data().count;
        console.log(count);
      }

      const querySnapshot = await getDocs(q);
      var cleanQuestions = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data());
        cleanQuestions.push({
          ...doc.data(),
          _id: doc.id,
          choices: this.shuffle([...doc.data().options, doc.data().answer]),
        });
      });
      this.questions = cleanQuestions;

      console.log(this.questions);
      await this.$nextTick(function () {});
    },
    timerFunction: function () {
      this.interval = setInterval(() => {
        if (this.timer === 0) {
          // Times up, reset timer
          //this.timer = this.timeLimit;
          /*clearInterval(this.interval);*/
          this.dialogTitle = "時間到!正確回答 " + this.answered + " 題";
          this.correctAnswer = this.questions[this.answered].answer.trim();
          this.endGame();
        } else {
          // decrement timer
          this.timer--;
        }
      }, 1000);
    },
    checkAnswer: function (event) {
      console.log(event.target.innerText);
      const response = event.target.innerText.trim().replace(/&nbsp;/g, " ");
      const answer = this.questions[this.answered].answer.trim();
      //console.log("response"+ event.target);
      const rand = this.rand();
      updateDoc(doc(db, "questions", this.questions[this.answered]._id), {
        random: rand < 0.2 ? rand + 0.2 : rand,
      });
      if (response == answer) {
        //if (response == this.questions[this.answered].answer) {
        this.nextQuestion();
      } else {
        console.log(response, answer);
        //Answer wrong
        this.dialogTitle = "哎呀，錯了!";
        this.wrongAnswer = response;
        this.correctAnswer = answer;
        this.endGame();
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
      //      this.getQuestion();
      this.answered = this.answered + 1;
      //answered correct
      if (this.answered >= 3) {
        // answered 3 questions
        this.dialogTitle = "全部正確!";
        this.endGame();
      }
    },
  },
};
</script>
