import {
  forgotPassword,
  login,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  register,
} from "@/service/auth.service";
import { getNextAvailableUserName, getUser } from "@/service/db.service";
// import store from "@/store";

function initialState() {
  return {
    uid: "",
    firstName: "",
    lastName: "",
    userName: "",
    profileImage: "",
    isAdmin: false,
    showSignIn: false,
  };
}

export default {
  state: initialState,
  mutations: {
    AUTH_SUCCESS(state, user) {
      state.uid = user.uid;
      state.profileImage = user.profileImage;
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.userName = user.userName;
      state.isAdmin = user.isAdmin || false;
    },
    AUTH_LOGOUT(state) {
      state.uid = null;
      state.displayName = null;
    },
    OPEN_FORM(state) {
      state.showSignIn = true;
    },
    CLOSE_FORM(state) {
      state.showSignIn = false;
    },
    UPDATE__PROFILE(state, profile){
      state.profileImage = profile
    },
    reset(state) {
      // acquire initial state
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },
    initializeUserState(state, user) {
      if (user) {
        state.uid = user.uid;
        state.profileImage = user.profileImage;
        state.firstName = user.firstName;
        state.lastName = user.lastName;
        state.userName = user.userName;
        state.isAdmin = user.isAdmin || false;
      }
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async register(context, [email, password, firstName, lastName]) {
      const result: any = {};
      try {
        const userName = firstName?.toLowerCase() + "-" + lastName?.toLowerCase();
        const availableUserName = await getNextAvailableUserName(userName);
        const registerResult = await register(
          email,
          password,
          firstName,
          lastName,
          availableUserName
        );
        const userData = {
          uid: registerResult.uid,
          firstName: firstName,
          lastName: lastName,
          userName: availableUserName,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        context.commit("AUTH_SUCCESS", userData);
        result.user = userData;
      } catch (err) {
        result.errorMsg = err.message;
      }
      return result;
    },
    async login(context, [email, password]) {
      const result: any = {};
      try {
        const loginResult = await login(email, password);
        // localStorage.setItem("user", JSON.stringify(loginResult));
        // context.commit("AUTH_SUCCESS", loginResult);
        result.user = loginResult;
      } catch (err) {
        result.errorMsg = err.message;
      }
      return result;
    },
    async loginWithGoogle(context){
      const result: any = {};
      try{
        const loginResult = await loginWithGoogle();
        context.commit("AUTH_SUCCESS", loginResult);
        result.user = loginResult;
      }catch(err){
        result.errorMsg = err.message
      }
      return result;
    },
    async loginWithFacebook(context){
      const result: any = {};
      try{
        const loginResult = await loginWithFacebook();
        // context.commit("AUTH_SUCCESS", loginResult);
        result.user = loginResult;
      }catch(err){
        result.errorMsg = err.message
      }
      return result;
    },
    async logout(context) {
      try {
        const result = await logout();
        // store.dispatch("clearAll", null, { root: true });
        localStorage.removeItem("user");
        context.commit("AUTH_LOGOUT");
        return result;
      } catch (err) {
        return false;
      }
    },
    async forgotPassword(context, [email]) {
      const result: any = {};
      try {
        await forgotPassword(email);
        return true;
      } catch (err) {
        result.errorMsg = err.message;
      }
    },
    openForm(context) {
      context.commit("OPEN_FORM");
    },
    closeForm(context) {
      context.commit("CLOSE_FORM");
    },
    updateProfile(context, profile){
      context.commit('UPDATE__PROFILE', profile)
    },
    onAuthStateChanged: async (context, payload) => {
      if (!payload.user) {
        // claims = null
        // Perform logout operations
        context.commit("initializeUserState", null);
      } else {
        // Do something with the authUser and the claims object...
        const loginResult = await getUser(payload.user.uid)
        localStorage.setItem("user", JSON.stringify(loginResult));
        context.commit("initializeUserState", loginResult);
      }
    },
  },
  getters: {
    getUser: (state) => {
      return {
        uid: state.uid,
        firstName: state.firstName,
        lastName: state.lastName,
        userName: state.userName,
        profileImage:state.profileImage,
      };
    },
    getUid: (state) => {
      return state.uid;
    },
    getIsAdmin: (state) => {
      return state.isAdmin;
    },
    getFirstName: (state) => {
      return state.firstName;
    },
    getLastName: (state) => {
      return state.lastName;
    },
    getUserName: (state) => {
      return state.userName;
    },
    getSignInFormState: (state) => {
      return state.showSignIn;
    },
  },
  namespaced: true,
};
