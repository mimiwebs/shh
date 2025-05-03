import {createStore} from "vuex";
import {Auth} from "./auth/auth.module";

import {My} from "./my/my.module";
import {NearBy} from "./nearby/nearby.module";
import {Community} from "./my/modules/community/community.module";

function DeepObjectCopy(obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = DeepObjectCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = DeepObjectCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

const store = createStore({
    modules: {
        Auth,
        My,
        NearBy,
    },
});

export async function createCommunityModule(communityId) {
    const tabName = `C${communityId}`;

    if (!store.hasModule(["My", "Communities"])) {
        const module = {
            namespaced: true,
            modules: {},
        };

        store.registerModule(["My", "Communities"], module);
    }

    if (!store.hasModule(["My", "Communities", tabName])) {
        let copiedCommunityModule = DeepObjectCopy(Community);
        copiedCommunityModule.state.Id = communityId;
        /* 
        async function addStateToModules(modules) {
            await Promise.all(
                Object.keys(modules).map(async (moduleName) => {
                    const mod = modules[moduleName];
                    mod.state = {
                        ...mod.state,
                        CommunityId: communityId,
                    };

                    if (mod.modules) {
                        await addStateToModules(mod.modules);
                    }
                })
            );
        }

        await addStateToModules(copiedCommunityModule.modules); */

        store.registerModule(["My", "Communities", tabName], copiedCommunityModule);
    }
}
export default store;
