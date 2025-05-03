import {panelHttp} from "@/http/axios";

class MyServ {
    async GetList() {
        return await panelHttp.get("community/my-communities");
    }
}

export default new MyServ();
