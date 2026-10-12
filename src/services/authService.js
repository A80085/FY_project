import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { userService } from "./userService";

// Keep track of the current user in localStorage just for fast initial loads
const CURRENT_USER_KEY = "shree_mangalam_current_user";

const MASTER_ADMIN_EMAIL = import.meta.env.VITE_MASTER_ADMIN_EMAIL || "admin@mangalam.com";

const isMasterAdminEmail = (email) => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const configured = MASTER_ADMIN_EMAIL ? MASTER_ADMIN_EMAIL.trim().toLowerCase() : "";
  return (
    (configured && normalized === configured) ||
    normalized === "admin@mangalam.com" ||
    normalized === "admin1@mangalam.com"
  );
};

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
         const isMaster = isMasterAdminEmail(email);
         dbUser = {
           id: user.uid,
           name: isMaster ? "Admin User" : (user.displayName || "User"),
           email: user.email,
           role: isMaster ? "admin" : "customer",
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
      // Auto-assign admin role to the master admin email if configured
      const isMaster = isMasterAdminEmail(userData.email);
      
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
