<template>
  <NavBarTop></NavBarTop>
  <h1 class="title">exercises</h1>

  <!-- button for creating a new exercise -->
  <link-button
    icon="bi bi-plus-lg"
    name="create exercise"
    navigate-to="/feed"
    class="addExerciseBtn"
    color="#0275d8"
  />

  <!-- for loop with exercises consist of : deleteExercise and see results -->
  <template v-for="exercise in exercises" :key="exercise">
    <div class="exercise">
      <div class="flex-wrapper-btn-icon">
        <div class="text-holder">
          <p class="text">Name: {{ exercise.name }}</p>
          <p class="text">Date: {{ exercise.date }}</p>
        </div>
        <!-- delete exercise -->
        <icon-button
          name="delete exercise"
          icon="bi bi-trash icon"
          color="text-primary"
          type="button"
          aria-label="deleteExercise"
          class="deleteExerciseBtn"
          @click="deleteExercise(exercise.id)"
        >
          <i class="bi bi-trash3 icons"></i>
        </icon-button>
      </div>

      <button
        class="seeResultsButton"
        @click="getExcersizeResults(exercise.id)"
      >
        exercise results
      </button>
    </div>
  </template>
</template>

<script>
import NavBarTop from "@/components/navbars/NavBarTop.vue";
import LinkButton from "../components/btns/LinkButton.vue";
import _ from "lodash";

export default {
  name: "exercise history",
  components: {
    NavBarTop,
    LinkButton,
  },
  data() {
    return {
      exercises: [
        {
          id: 1,
          date: "24-11-2021",
          name: "lumbale wervelkolom met 2 sensoren",
        },
        {
          id: 2,
          date: "24-04-2022",
          name: "li-re vergelijking 1 gewricht 4 sensoren",
        },
        {
          id: 3,
          date: "20-05-2021",

          name: "Loopanalyse (let op! Ander type bestand wat ingelezen moet worden!; data uit andere verzamelmethode beschikbaar)",
        },
      ],
    };
  },
  methods: {
    getExcersizeResults(exercise) {
      console.log(exercise.id, exercise.name);
      this.$router.push({ path: "/exerciseResults" });
    },

    deleteExercise(id) {
      console.log(id, "id");
      let index = _.findIndex(this.exercises, { id: id });
      this.exercises.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.title {
  color: white;
  margin-bottom: 3%;
  margin-top: 5%;
  margin-right: 25%;
  margin-left: 25%;
  width: 50%;
  text-align: center;
}
p {
  margin: 0;
}

.exercise {
  cursor: pointer;
  background: white;
  margin-right: 5%;
  margin-left: 5%;
  margin-bottom: 3%;
  width: 90%;
  padding: 1em;
  border: 1px solid white;
  color: black;
  border-radius: 1em;
}

.flex-wrapper-btn-icon {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1%;
}

/* seeing the exercise results */
.seeResultsButton {
  border: none;
  background: #0275d8;
  margin-left: 10%;
  margin-right: 10%;
  width: 80%;
  color: white;
  border: none;

  align-items: center;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
}

/* copy paste from patients */

/*Any Mobile Device*/
@media only screen and (max-width: 767px) {
  .text {
    padding: 0;
    font-size: 0.8em;
  }
  .addExerciseBtn {
    left: calc(100vw - 2.5em);
    top: calc(100vh - 3em);
    font-size: 3em;
  }
  .deleteExerciseBtn {
    font-size: 4em;
  }
}
/* everything in between */
@media only screen and (max-width: 1281px) and (min-width: 767px) {
  .text {
    padding: 0;
    font-size: 1.3em;
  }
  .addExerciseBtn {
    left: calc(100vw - 5em);
    top: calc(100vh - 4em);
    font-size: 3em;
  }
  .deleteExerciseBtn {
    font-size: 4em;
  }
}

/* desktops */
@media (min-width: 1281px) {
  .text {
    padding: 0;
    font-size: 1.3em;
  }
  .addExerciseBtn {
    left: calc(100vw - 3em);
    top: calc(100vh - 3em);
    font-size: 4em;
  }
  .deleteExerciseBtn {
    font-size: 4em;
  }
}

/* end copy paste from patients  */

/* for the exercise results button */
.seeResultsButton:focus,
.seeResultsButton:focus-within,
.seeResultsButton:hover {
  background: blue;
  border: none;
}

.addExerciseBtn {
  position: sticky;
  width: 1.9em;
  height: 1.9em;
  background: white;
  display: grid;
  justify-content: center;
  align-items: center;
  border-radius: 75%;
  border: 1px solid #707070;
  z-index: 1;
}
</style>
