export default function (from, to, next) {
    const localToken = localStorage.getItem("token");
    if (!localToken && to.name !== "Login") {
        next({name: "Login"});
    }
    next();
}
