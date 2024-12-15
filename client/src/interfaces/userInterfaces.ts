import { createContext, Dispatch } from "react";

export interface userState {
    token: string;
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
    } | null;
}

export interface userAction {
    type: "login" | "logout";
    payload?: { token: string; user: userState["user"] };
}

export interface UserContextType {
    userState: userState;
    userDispatch: Dispatch<userAction>;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);