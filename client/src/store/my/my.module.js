import MyServ from "./my.service";
import {Community} from "./modules/community/community.module";
export const My = {
    namespaced: true,
    modules: {
        Community,
    },
    state: {
        Id: null,
        List: [],
    },
    mutations: {
        SET_MY_LIST(state, data) {
            state.List = data;
        },
    },
    actions: {
        async GetList({commit}) {
            try {
                let err = null;
                const response = await MyServ.GetList().catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                const {data} = response.data;
                const list = data.communityList;
                commit("SET_MY_LIST", list);
                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
    },
};
