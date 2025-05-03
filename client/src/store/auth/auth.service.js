import {panelHttp} from "@/http/axios";

class AuthServ {
    async RegisterUser(payload) {
        return panelHttp.post("auth/register", payload);
    }
    async LoginUser(payload) {
        return panelHttp.post("auth/login", payload);
    }
}

export default new AuthServ();
