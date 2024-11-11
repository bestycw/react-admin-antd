import { createContext, useContext } from "react";
import menuStore from "./MenuStore";
import userStore from "./UserStore";

class RootStore {
    MenuStore = menuStore
    UserStore = userStore
}
const rootStore = new RootStore();

const rootContext = createContext(rootStore);
export const useStore = () => useContext(rootContext); 