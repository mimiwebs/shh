import AuthServ from "./auth.service";
import {panelHttp} from "@/http/axios";
export const Auth = {
    namespaced: true,
    state: {
        RegisterPayload: {
            username: "",
            password: "",
            email: "",
            latitude: "",
            longitude: "",
        },
        LoginPayload: {
            username: "",
            password: "",
        },
    },
    mutations: {
        logout(state) {
            state.LoginPayload = {
                username: "",
                password: "",
            };
        },
    },
    actions: {
        async Register({commit, state}) {
            try {
                let err = "";
                const payload = state.RegisterPayload;
                const response = await AuthServ.RegisterUser(payload).catch((error) => {
                    err = error.response.data;
                });

                if (err) return err;

                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
        async Login({commit, state}) {
            try {
                let err = "";
                const payload = state.LoginPayload;
                const response = await AuthServ.LoginUser(payload).catch((error) => {
                    err = error.response.data;
                });

                if (err) return err;
                const {data} = response.data;
                const token = data.token;
                panelHttp.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                localStorage.setItem("token", token);
                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
        Logout({commit}) {
            localStorage.removeItem("token");
            commit("logout");
        },
    },
};
