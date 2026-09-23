import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state changes for real-time session sync
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase session is active — load user profile from Firestore
        try {
          const dbUser = await userService.getUser(firebaseUser.uid);
          if (dbUser) {
            const authUser = { id: firebaseUser.uid, ...dbUser };
            localStorage.setItem("shree_mangalam_current_user", JSON.stringify(authUser));
            setUser(authUser);
          } else {
            // User exists in Firebase Auth but not Firestore — use localStorage cache
            const cached = authService.getCurrentUser();
            setUser(cached);
          }
        } catch {
          // Firestore error — fall back to localStorage cache
          const cached = authService.getCurrentUser();
          setUser(cached);
        }
      } else {
        // No active Firebase session
        localStorage.removeItem("shree_mangalam_current_user");
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const authUser = await authService.login(email, password);
    setUser(authUser);
    return authUser;
  };

  const register = async (userData) => {
    const authUser = await authService.register(userData);
    setUser(authUser);
    return authUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isStaff = user?.role === "staff";
  const hasAdminAccess = isAdmin || isManager;
  const hasStaffAccess = isAdmin || isManager || isStaff;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isManager,
        isStaff,
        hasAdminAccess,
        hasStaffAccess,
        isLoadingAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
