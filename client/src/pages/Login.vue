<script>
import {useVuelidate} from "@vuelidate/core";
import {required, minLength, maxLength} from "@vuelidate/validators";
export default {
    setup() {
        return {v$: useVuelidate()};
    },
    data() {
        return {
            isDataLoaded: false,
            isPasswordType: "password",
        };
    },
    validations() {
        return {
            LoginPayload: {
                username: {
                    required,
                    minLength: minLength(6),
                },
                password: {required, minLength: minLength(6), maxLength: maxLength(20)},
            },
        };
    },
    computed: {
        AuthModule() {
            return this.$store.state.Auth;
        },
        LoginPayload() {
            return this.AuthModule.LoginPayload;
        },
    },
    methods: {
        async MakeLogin() {
            this.v$.$validate();
            let isValid = !this.v$.$error;
            if (isValid) {
                this.isDataLoaded = true;
                const response = await this.$store.dispatch("Auth/Login");
                if (response == true) {
                    this.$toast.success("You have successfully logged in!");
                    this.$root.UserLoggedIn();
                    this.$router.push("/");
                    return;
                }
            } else {
                this.isDataLoaded = false;
                this.$toast.error("Please enter valid username or password!");
            }
        },
    },
    async mounted() {},
};
</script>
<template>
    <div class="grid align__item">
        <div class="register">
            <svg xmlns="http://www.w3.org/2000/svg" class="site__logo" width="56" height="84" viewBox="77.7 214.9 274.7 412">
                <defs>
                    <linearGradient id="a" x1="0%" y1="0%" y2="0%">
                        <stop offset="0%" stop-color="#4b0082" />
                        <stop offset="100%" stop-color="#800080" />
                    </linearGradient>
                </defs>
                <path fill="url(#a)" d="M215 214.9c-83.6 123.5-137.3 200.8-137.3 275.9 0 75.2 61.4 136.1 137.3 136.1s137.3-60.9 137.3-136.1c0-75.1-53.7-152.4-137.3-275.9z" />
            </svg>
            <h2>Login</h2>
            <div class="form">
                <div class="input-group input-group-pd gap-0 mb-2">
                    <span class="btn border-0">
                        <i class="bi bi-person lh-0 align-middle" />
                    </span>
                    <InputText
                        class="form-control flex-grow-1 ps-0 h-100"
                        placeholder="Username"
                        v-model="LoginPayload.username"
                        id="username"
                        maxlength="255"
                        :class="{
                            'is-invalid': v$.LoginPayload.username.$error,
                        }"
                        autocomplete="off"
                    />
                </div>

                <div class="input-group input-group-pd gap-0 mb-4">
                    <span class="btn border-0">
                        <i class="bi bi-lock lh-0 align-middle" />
                    </span>
                    <input
                        :type="isPasswordType"
                        class="form-control flex-grow-1 ps-0 h-100"
                        id="password"
                        placeholder="Password"
                        v-model="LoginPayload.password"
                        :class="{
                            'is-invalid': v$.LoginPayload.password.$error,
                        }"
                    />
                    <button type="button" class="btn btn-form" style="border: unset !important" @click="isPasswordType == 'password' ? (isPasswordType = 'text') : (isPasswordType = 'password')">
                        <i v-if="isPasswordType == 'password'" class="vr-ic_fluent_eye_off_24_regular align-middle lh-0 fs-5"></i>
                        <i v-if="isPasswordType == 'text'" class="vr-ic_fluent_eye_24_regular align-middle lh-0 fs-5"></i>
                    </button>
                </div>

                <div class="form__field">
                    <input type="submit" value="Login" @click="MakeLogin" />
                </div>
            </div>
            <p>
                Don,t have an account?
                <router-link to="/register">Register</router-link>
            </p>
            <p>
                <a href="/forgot-password">Forgot your password?</a>
            </p>
        </div>
    </div>
</template>
