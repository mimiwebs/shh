import {panelHttp} from "@/http/axios";

class NearByServ {
    async GetList() {
        return await panelHttp.get("community/nearby-communities");
    }

    async Follow(payload) {
        return await panelHttp.post(`community/follow-community`, payload);
    }
}

export default new NearByServ();
