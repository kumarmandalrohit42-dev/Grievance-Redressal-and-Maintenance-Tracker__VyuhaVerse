import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { store, INITIAL_USERS } from '../services/store';

interface AuthContextType {
  currentUser: User;
  activeRole: UserRole;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('cc_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS[0]; // Default to Student Aarav Sharma
  });

  const [activeRole, setActiveRole] = useState<UserRole>(currentUser.role);

  useEffect(() => {
    localStorage.setItem('cc_current_user', JSON.stringify(currentUser));
    setActiveRole(currentUser.role);
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    const targetUser = store.getUsers().find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setActiveRole(role);
      store.logAudit(targetUser.name, role, 'DEMO_ROLE_SWITCH', 'System', `Switched view mode to ${role.toUpperCase()}`);
    }
  };

  const login = (email: string, role: UserRole): boolean => {
    const users = store.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (found) {
      setCurrentUser(found);
      setActiveRole(found.role);
      store.logAudit(found.name, found.role, 'USER_LOGIN', 'Auth System', `Logged in via email (${email})`);
      return true;
    }
    // Fallback switch to default user of that role
    switchRole(role);
    return true;
  };

  const logout = () => {
    store.logAudit(currentUser.name, activeRole, 'USER_LOGOUT', 'Auth System', 'User logged out');
    switchRole('student');
  };

  const updateProfile = (updated: Partial<User>) => {
    const newObj = { ...currentUser, ...updated };
    setCurrentUser(newObj);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        setCurrentUser,
        switchRole,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
