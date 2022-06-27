<template>
  <!-- Navbar -->
  <nav class="navbar1">
    <!-- Container wrapper -->
    <div class="container-fluid1">
      <button @click="goBackToHome()">
        <img
          src="@/assets/beeldmerk.png"
          height="40"
          alt="hu logo"
          loading="lazy"
        />
      </button>
      <div class="item-left-side">
        <p class="userName">
          {{ getDisplayName() }}
        </p>
        <div class="dropdown">
          <a
            class="dropdown-toggle d-flex align-items-center hidden-arrow"
            href="#"
            id="navbarDropdownMenuAvatar"
            role="button"
            data-mdb-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="@/assets/blackImage.jpg"
              class="rounded-circle"
              height="30"
              alt="profile picture"
              loading="lazy"
            />
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdownMenuAvatar"
          >
            <li>
              <a class="dropdown-item">Mijn profiel</a>
            </li>
            <li>
              <a class="dropdown-item">Settings</a>
            </li>
            <li>
              <a @click="logOut()" class="dropdown-item">Log uit</a>
            </li>
            <li>
              <a @click="goToDevelop()" class="dropdown-item">Development</a>
            </li>
          </ul>
        </div>
      </div>
      <!-- Right elements -->
    </div>
    <!-- Container wrapper -->
  </nav>
  <!-- Navbar -->
</template>

<script>
import { logOut } from "@/db/firebaseAuth.js";

export default {
  name: "NavBarTop",

  data() {
    return {
      user: {},
    };
  },
  computed: {
 
  },
  methods: {
    logOut() {
      logOut();
    },
    goBackToHome() {
      this.$router.push({ name: "patients" });
    },
    goToDevelop() {
      this.$router.push({ name: "feed" });
    },
    getDisplayName() {
      // if registered with mail  -> mail is the displayName
      let email = this.$store.getters.getUser.email;
      let displayName = this.$store.getters.getUser.displayName;
      if (typeof displayName === "undefined") {
        return email;
      } else {
        return displayName;
      }
    },
  },
};
</script>

<style scoped>
.navbar1 {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.container-fluid1 {
  width: 100%;
  padding-right: var(--bs-gutter-x, 0.75rem);
  padding-left: var(--bs-gutter-x, 0.75rem);
  margin-right: auto;
  margin-left: auto;
}
.navbar1 > .container-fluid1 {
  display: flex;
  flex-wrap: inherit;
  align-items: center;
  justify-content: space-between;
}
.item-left-side {
  align-items: center !important;
  display: flex !important;
}

/* dropdown for the logout en user settings */
.dropdown-menu.show {
  right: 20px;
}
/* notification button */
.badge {
  font-size: 1em;
}

/* pages dropdown */

.userName {
  margin-right: 10px;
  margin-top: 10px;
  color: red;
}

button {
  border: none;
  background-color: #f8f9fa;
  color: red;
}

.navbar {
  position: sticky;
  top: 0;
}
</style>
