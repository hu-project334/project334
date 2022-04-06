<template>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <!-- Container wrapper -->
    <div class="container-fluid">
      <a class="navbar-brand mt-2 mt-lg-0" href="#">
        <img
          src="@/assets/beeldmerk.png"
          height="40"
          alt="duo-run Logo"
          loading="lazy"
        />
      </a>
      <!-- Left links -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#">{{ debt }}</a>
        </li>
      </ul>
      <!-- Left links -->
      <!-- </div> -->
      <!-- Collapsible wrapper -->

      <!-- Right elements -->
      <div class="d-flex align-items-center">
        <!-- Icon -->
        <a class="text-reset me-3" href="#">
          <i class="fas fa-shopping-cart"></i>
        </a>

        <p class="nav-text userName">
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
              :src="getProfileImage"
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
              <a class="dropdown-item" href="#">My profile</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Settings</a>
            </li>
            <li>
              <a @click="logOut()" class="dropdown-item" href="#">Logout</a>
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
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "NavBarTop",

  data() {
    return {
      user: {},
    };
  },
  computed: {
    getProfileImage() {
      console.log(this.$store.getters.getUser.photoURL);
      return this.$store.getters.getUser.photoURL || "@/assets/blackImage.jpg";
    },
  },
  methods: {
    // getProfileImage() {
    //   try {
    //     // console.log(this.$store.getters.getUser);

    //     let photoURL = this.$store.getters.getUser.photoURL;
    //     photoURL = this.$store.getters.getUser.photoURL;
    //     if (!photoURL) throw "error";
    //     return photoURL;

    //     // return photoURL;
    //     // }
    //   } catch {
    //     let image = require("@/assets/" + "blackImage.jpg");
    //     console.log("catch");
    //     return image;
    //   }
    // },
    logOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$store.dispatch("logOutUser");
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          console.log(error);
        });
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
  mounted() {},
};
</script>

<style scoped>
/* dropdown for the logout en user settings */
.dropdown-menu.show {
  right: 20px;
}
/* notification button */
.badge {
  font-size: 1em;
}

/* pages dropdown */
.navbar-dark .navbar-toggler {
  border: 2px solid #a19797;
}

.userName {
  margin-right: 10px;
  margin-top: 10px;
  color: red;
}

.navbar {
  position: sticky;
  top: 0;
}
</style>
