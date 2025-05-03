import axios from "axios";

import apiHttp from "./config/api-url";

const createAxiosInstance = (config) => {
    const instance = axios.create({
        baseURL: config.apiUrl,
        headers: {
            common: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );

    // catch errors

    return instance;
};

export const panelHttp = createAxiosInstance(apiHttp);
