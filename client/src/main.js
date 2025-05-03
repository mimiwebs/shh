import "bootstrap/dist/css/bootstrap.min.css";

import "@/assets/scss/index.scss";
import moment from "moment";
import CustomDateFunctions from "@apsisxcoder/custom-functions";

import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import {toast} from "vue3-toastify";
import State from "./static/State.vue";
const app = createApp(App);
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
});
app.config.globalProperties.$toast = toast;
app.config.globalProperties.Community = store.state.My.Community;
app.component("Dialog", Dialog);
app.component("Textarea", Textarea);
app.component("State", State);
app.component("InputText", InputText);

app.use(CustomDateFunctions);

app.use(PrimeVue, {
    theme: "saga-blue",
});
app.use(router);
app.use(store);
/* import {setupCommunityExtension} from "./store/plugins/community-plugin";
setupCommunityExtension(app); */

app.mount("#app");
