import { userAction, userState } from "../interfaces/userInterfaces";

export const userReducer = (state: userState, action: userAction): userState => {
  const { type, payload } = action;
  switch (type) {
    case 'login':
      return payload ? { ...state, token: payload.token, user: payload.user } : state;
    case 'logout':
      return { ...state, token: "", user: null };
    default:
      return state;
  }
};
