import { createApp } from "vue";
import "./styles.scss";
import App from "./App.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faUserSecret,
  faUserPlus,
  faGear,
  faPaperPlane,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret, faGear, faUserPlus, faPaperPlane, faDeleteLeft);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
