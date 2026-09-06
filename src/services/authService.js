const USERS_KEY = "shree_mangalam_users";
const CURRENT_USER_KEY = "shree_mangalam_current_user";

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_USERS = [
  {
    id: "usr_admin",
    name: "Admin User",
    email: "admin@mangalam.com",
    password: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123
    role: "admin",
    phone: "+91 98250 00000",
  },
  {
    id: "usr_customer",
    name: "Rahul Sharma",
    email: "user@mangalam.com",
    password: "e606e38b0d8c19b24cf0ee3808183162ea7cd63ff7912dbb22b5e803286b4446", // user123
    role: "customer",
    phone: "+91 98765 43210",
  }
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users:", e);
  }
}

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
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const hashedPassword = await hashPassword(password);
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === hashedPassword);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return authUser;
  },

  async register(userData) {
    const users = getStoredUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists");
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: userData.name,
      email: cleanEmail,
      password: await hashPassword(userData.password),
      role: userData.role || "customer",
      phone: userData.phone || "",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const authUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
    return authUser;
  },

  async logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  },

  async resetPassword(email, newPassword) {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (index === -1) {
      throw new Error("No account found with this email address");
    }
    users[index].password = await hashPassword(newPassword);
    saveUsers(users);
    return true;
  }
};
