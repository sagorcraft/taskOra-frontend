import { createContext, useContext, useState } from "react";
import { DEMO_OTP, KEYS, read, remove, write } from "../utils/storage.js";
import { createSalt, hashPassword, verifyPassword } from "../utils/password.js";

const AuthContext = createContext(null);

const normalizeEmail = email => email.trim().toLowerCase();
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const toSession = user => ({ id: user.id, fullname: user.fullname, email: user.email, avatar: user.avatar || "" });
const readUsers = () => read(localStorage, KEYS.users, []);
const saveUsers = users => write(localStorage, KEYS.users, users);

// "Remember me" sessions live in localStorage; everything else ends with the browser tab.
function saveSession(session, remember) {
  remove(localStorage, KEYS.session);
  remove(sessionStorage, KEYS.session);
  write(remember ? localStorage : sessionStorage, KEYS.session, session);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(localStorage, KEYS.session) || read(sessionStorage, KEYS.session));
  const [pending, setPending] = useState(() => read(sessionStorage, KEYS.pending));

  // Demo only: replace the bodies below with API calls (see src/services/api.js) when a backend exists.
  const register = async ({ fullname, email, password }) => {
    await wait(500);
    const normalized = normalizeEmail(email);
    if (readUsers().some(item => item.email === normalized)) throw new Error("An account with this email already exists.");
    const salt = createSalt();
    const next = { fullname: fullname.trim(), email: normalized, salt, passwordHash: await hashPassword(password, salt) };
    // The account is only created after the OTP is verified.
    write(sessionStorage, KEYS.pending, next);
    setPending(next);
    return DEMO_OTP;
  };

  const verifyRegistration = async code => {
    if (!pending) throw new Error("No pending registration was found.");
    if (code !== DEMO_OTP) throw new Error(`Incorrect demo OTP. Use ${DEMO_OTP}.`);
    const users = readUsers();
    if (users.some(item => item.email === pending.email)) throw new Error("An account with this email already exists.");
    const record = { id: crypto.randomUUID(), ...pending, avatar: "" };
    saveUsers([...users, record]);
    const session = toSession(record);
    saveSession(session, false);
    setUser(session);
    setPending(null);
    remove(sessionStorage, KEYS.pending);
  };

  const login = async (email, password, remember) => {
    await wait(500);
    const users = readUsers();
    const found = users.find(item => item.email === normalizeEmail(email));
    let valid = false;
    if (found?.passwordHash) {
      valid = await verifyPassword(password, found.salt, found.passwordHash);
    } else if (found && found.password !== undefined) {
      // Account created before passwords were hashed: accept it once, then upgrade the record.
      valid = found.password === password;
      if (valid) {
        found.salt = createSalt();
        found.passwordHash = await hashPassword(password, found.salt);
        delete found.password;
        saveUsers(users);
      }
    }
    if (!valid) throw new Error("Email or password is incorrect. Register first if this is a new account.");
    const session = toSession(found);
    saveSession(session, remember);
    setUser(session);
  };

  const requestPasswordReset = async email => {
    await wait(400);
    // Always succeed so the form cannot be used to discover which emails are registered.
    write(sessionStorage, KEYS.reset, normalizeEmail(email));
  };

  const resetPassword = async (password, code) => {
    const email = read(sessionStorage, KEYS.reset);
    if (!email) throw new Error("Reset session expired. Request a new reset code.");
    if (code !== DEMO_OTP) throw new Error(`Incorrect demo OTP. Use ${DEMO_OTP}.`);
    const users = readUsers();
    const index = users.findIndex(item => item.email === email);
    if (index < 0) throw new Error("Reset session expired. Request a new reset code.");
    const salt = createSalt();
    const { password: _legacy, ...rest } = users[index];
    users[index] = { ...rest, salt, passwordHash: await hashPassword(password, salt) };
    saveUsers(users);
    remove(sessionStorage, KEYS.reset);
  };

  const updateProfile = updates => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    [localStorage, sessionStorage].forEach(store => {
      if (store.getItem(KEYS.session)) write(store, KEYS.session, updated);
    });
    const users = readUsers();
    const index = users.findIndex(item => item.id === user.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
    }
  };

  const logout = () => {
    setUser(null);
    remove(localStorage, KEYS.session);
    remove(sessionStorage, KEYS.session);
  };

  return (
    <AuthContext.Provider value={{ user, pending, register, verifyRegistration, login, requestPasswordReset, resetPassword, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
