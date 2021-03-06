import ActivityStore from "./activityStore";
import CommentStore from './commentStore';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import ProfileStore from './profileStore';
import UserStore from './userStore';
import { createContext, useContext } from "react";

interface Store {
    activityStore: ActivityStore,
    commentStore: CommentStore,
    commonStore: CommonStore,
    modalStore: ModalStore,
    profileStore: ProfileStore,
    userStore: UserStore
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commentStore: new CommentStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    userStore: new UserStore()
}

export const StoreContext = createContext(store);

// Hook for using the store.
export function useStore() {
    return useContext(StoreContext);
}