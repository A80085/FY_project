import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { userService } from "./userService";

// Keep track of the current user in localStorage just for fast initial loads
const CURRENT_USER_KEY = "shree_mangalam_current_user";

export const authService = {
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      let dbUser = await userService.getUser(user.uid);
      if (!dbUser) {
         dbUser = {
           id: user.uid,
           name: email === "admin@mangalam.com" ? "Admin User" : "User",
           email: user.email,
           role: email === "admin@mangalam.com" ? "admin" : "customer",
         };
         await userService.createUser(user.uid, dbUser);
      }
      
      const authUser = {
        id: user.uid,
        ...dbUser
      };
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
      return authUser;
    } catch (error) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        throw new Error("Invalid email or password");
      }
      throw new Error("Authentication failed: " + error.message);
    }
  },

  async register(userData) {
    try {
      const newUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      // Auto-assign admin role to the master admin email so you aren't locked out
      const isMaster = userData.email === "admin@mangalam.com";
      
      const dbUser = {
        name: userData.name,
        email: newUser.user.email,
        role: isMaster ? "admin" : "customer",
      };

      if (!isMaster && userData.requestedRole) {
        dbUser.requestedRole = userData.requestedRole;
      }

      await userService.createUser(newUser.user.uid, dbUser);
      
      const authUser = {
        id: newUser.user.uid,
        ...dbUser
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
      return authUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async logout() {
    await signOut(auth);
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  }
};
