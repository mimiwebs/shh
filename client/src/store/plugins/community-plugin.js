import store from "@/store";

function createCommunityProxy() {
    return new Proxy(
        {},
        {
            get(target, prop) {
                if (prop === "Id") {
                    return target.Id;
                }

                if (prop === "dispatch") {
                    return function (action, payload) {
                        const namespacedAction = `My/Communities/C${target.Id}/${action.replace(/\//g, "/")}`;
                        return store.dispatch(namespacedAction, payload);
                    };
                }

                if (target.Id) {
                    let communityModule = store.state.My.Communities[`C${target.Id}`];
                    if (communityModule && communityModule[prop]) {
                        return communityModule[prop];
                    }
                }

                return undefined;
            },
            set(target, prop, value) {
                if (prop === "Id") {
                    target.Id = value;
                    return true;
                }
                return false;
            },
        }
    );
}

export function setupCommunityExtension(app) {
    app.config.globalProperties.$CommunityFactory = function (communityId) {
        return createCommunityProxy(communityId);
    };
    app.config.globalProperties.findCommunityId = function (instance) {
        let current = instance;
        while (current) {
            if (current.$props && current.$props.CommunityId) {
                return current.$props.CommunityId;
            }
            current = current.$parent;
        }
        return null;
    };

    app.mixin({
        created() {
            const communityId = this.findCommunityId(this);
            if (communityId !== null) {
                this.$Community = this.$CommunityFactory(communityId);
                this.$Community.Id = communityId;
            }
        },
    });
}
