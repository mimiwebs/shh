<script>
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength, maxLength} from "@vuelidate/validators";
export default {
    setup() {
        return {
            v$: useVuelidate(),
        };
    },
    data() {
        return {
            isPermissionDenied: false,
            isLocationUnavailable: false,
            isTimeOut: false,
            isUnknownError: false,
            isDataLoaded: false,

            isPasswordType: "password",
        };
    },
    validations() {
        return {
            RegisterPayload: {
                username: {required},
                email: {required, email},
                password: {required, minLength: minLength(6), maxLength: maxLength(20)},
                is_agreed: {required},
            },
        };
    },
    computed: {
        isLocationError() {
            return this.isPermissionDenied || this.isLocationUnavailable || this.isTimeOut || this.isUnknownError;
        },
        AuthModule() {
            return this.$store.state.Auth;
        },
        RegisterPayload() {
            return this.AuthModule.RegisterPayload;
        },
    },
    methods: {
        showPosition(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.RegisterPayload.latitude = lat;
            this.RegisterPayload.longitude = lon;
        },
        showErrorCallback(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    this.isPermissionDenied = true;
                    break;
                case error.POSITION_UNAVAILABLE:
                    this.isLocationUnavailable = true;
                    break;
                case error.TIMEOUT:
                    this.isTimeOut = true;
                    break;
                case error.UNKNOWN_ERROR:
                    this.isUnknownError = true;
                    break;
            }
        },
        GetLocationOfCurrentUser() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition, this.showErrorCallback);
            }
        },
        async MakeRegister() {
            this.v$.$validate();
            let isValid = !this.v$.$error;
            if (isValid) {
                this.isDataLoaded = true;
                const response = await this.$store.dispatch("Auth/Register");
                if (response == true) {
                    this.$toast.success("You have successfully registered!");
                    this.$router.push("/login");
                    return;
                }
            } else {
                this.isDataLoaded = false;
                this.$toast.error("Please fill the required areas!");
            }
        },
    },
    async mounted() {
        this.GetLocationOfCurrentUser();
    },
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
            <h2>Register</h2>
            <template v-if="!isLocationError && RegisterPayload.latitude && RegisterPayload.longitude">
                <div class="form">
                    <div class="input-group input-group-pd gap-0 mb-2">
                        <span class="btn border-0">
                            <i class="bi bi-envelope-at lh-0 align-middle" />
                        </span>
                        <InputText
                            class="form-control flex-grow-1 ps-0 h-100"
                            placeholder="Email"
                            v-model="RegisterPayload.email"
                            id="email"
                            maxlength="255"
                            :class="{
                                'is-invalid': v$.RegisterPayload.email.$error,
                            }"
                            autocomplete="off"
                        />
                    </div>
                    <div class="input-group input-group-pd gap-0 mb-2">
                        <span class="btn border-0">
                            <i class="bi bi-person lh-0 align-middle" />
                        </span>
                        <InputText
                            class="form-control flex-grow-1 ps-0 h-100"
                            placeholder="Username"
                            v-model="RegisterPayload.username"
                            id="username"
                            maxlength="255"
                            :class="{
                                'is-invalid': v$.RegisterPayload.username.$error,
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
                            v-model="RegisterPayload.password"
                            :class="{
                                'is-invalid': v$.RegisterPayload.password.$error,
                            }"
                        />
                        <button type="button" class="btn btn-form" style="border: unset !important" @click="isPasswordType == 'password' ? (isPasswordType = 'text') : (isPasswordType = 'password')">
                            <i v-if="isPasswordType == 'password'" class="vr-ic_fluent_eye_off_24_regular align-middle lh-0 fs-5"></i>
                            <i v-if="isPasswordType == 'text'" class="vr-ic_fluent_eye_24_regular align-middle lh-0 fs-5"></i>
                        </button>
                    </div>
                    <div class="input-group mb-4">
                        <div class="form-check form-check-border">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="pricingType"
                                id="isIncluded"
                                v-model="RegisterPayload.is_agreed"
                                :class="{'form-control': true, 'is-invalid': v$.RegisterPayload.is_agreed && v$.RegisterPayload.is_agreed.$errors.length}"
                            />
                            <label class="form-check-label" for="isIncluded">
                                I agree to the
                                <a href="#">Terms of Service</a>
                                and
                                <a href="#">Privacy Policy</a>
                            </label>
                        </div>
                    </div>

                    <div class="form__field">
                        <input type="submit" value="Register" @click="MakeRegister" />
                    </div>
                </div>
                <p>
                    Already have an accout?
                    <router-link to="/login">Login</router-link>
                </p>
            </template>
            <template v-if="isLocationError">
                <p>Location Error</p>
                <template v-if="isPermissionDenied">
                    <p>Permission denied, please allow location access to continue.</p>
                </template>
                <template v-if="isLocationUnavailable">
                    <p>Location unavailable, please enable location access to continue.</p>
                </template>
                <template v-if="isTimeOut">
                    <p>Location request timed out, please try again.</p>
                </template>
                <template v-if="isUnknownError">
                    <p>Unknown error occurred, please try again.</p>
                </template>
            </template>
        </div>
    </div>
</template>
<style scoped>
.agreementCheck {
    margin-right: 0px;
}
.agreement {
    margin-right: 150px;
    padding-right: 150px;
    font-size: smaller;
}
</style>
