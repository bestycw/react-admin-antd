import { createContext, useContext } from "react";
import authStore from "./AuthStore";
import userStore from "./UserStore";

class RootStore {
    AuthStore = authStore
    UserStore = userStore
}
const rootStore = new RootStore();

const rootContext = createContext(rootStore);
export const useStore = () => useContext(rootContext); 