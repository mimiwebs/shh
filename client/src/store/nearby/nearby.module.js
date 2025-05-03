import NearByServ from "./nearby.service";

export const NearBy = {
    namespaced: true,
    state: {
        List: [],
        FollowPayload: {
            communityId: "",
            status: "", // 1: follow, 0: unfollow
        },
    },
    mutations: {
        SET_LIST(state, data) {
            state.List = data;
        },
    },
    actions: {
        async GetList({commit}) {
            try {
                let err = null;
                const response = await NearByServ.GetList().catch((error) => {
                    err = error.response.data;
                });
                if (err) return err;

                const {data} = response.data;
                const list = data.communityList;
                commit("SET_LIST", list);
                return true;
            } catch (error) {
                console.log(error.message);
                return {
                    status: 999,
                };
            }
        },
        async Follow({commit, state}) {
            try {
                let err = null;
                const payload = state.FollowPayload;
                const response = await NearByServ.Follow(payload).catch((error) => {
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
    },
};
