import { createContext, useContext } from "react";
import menuStore from "./MenuStore";
import userStore from "./UserStore";
import configStore from "./ConfigStore";
class RootStore {
    MenuStore = menuStore
    UserStore = userStore
    ConfigStore = configStore
}
const rootStore = new RootStore();

const rootContext = createContext(rootStore);
export const useStore = () => useContext(rootContext); 