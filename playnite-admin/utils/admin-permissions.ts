// Admin Role-Based Access Control (RBAC) System
// Defines permissions and access levels for different admin roles

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support';

export type AdminPermission =
  | 'manage_users'
  | 'manage_content'
  | 'moderate_content'
  | 'view_analytics'
  | 'manage_revenue'
  | 'system_settings'
  | 'manage_notifications'
  | 'user_support'
  | 'content_approval'
  | 'financial_reports';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

// Role-based permission matrix
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'manage_users',
    'manage_content',
    'moderate_content',
    'view_analytics',
    'manage_revenue',
    'system_settings',
    'manage_notifications',
    'user_support',
    'content_approval',
    'financial_reports',
  ],
  admin: [
    'manage_users',
    'manage_content',
    'moderate_content',
    'view_analytics',
    'manage_notifications',
    'user_support',
    'content_approval',
  ],
  moderator: [
    'moderate_content',
    'user_support',
    'content_approval',
  ],
  support: [
    'user_support',
  ],
};

// Permission descriptions for UI display
export const PERMISSION_DESCRIPTIONS: Record<AdminPermission, string> = {
  manage_users: 'Create, edit, and delete user accounts',
  manage_content: 'Upload and manage platform content',
  moderate_content: 'Review and moderate user-generated content',
  view_analytics: 'Access platform analytics and reports',
  manage_revenue: 'Manage payments, subscriptions, and financial data',
  system_settings: 'Configure platform settings and preferences',
  manage_notifications: 'Create and manage notification templates',
  user_support: 'Provide support and assistance to users',
  content_approval: 'Approve or reject content submissions',
  financial_reports: 'Access detailed financial reports and analytics',
};

// Check if a user has a specific permission
export const hasPermission = (user: AdminUser, permission: AdminPermission): boolean => {
  return user.permissions.includes(permission);
};

// Check if a user has any of the specified permissions
export const hasAnyPermission = (user: AdminUser, permissions: AdminPermission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

// Check if a user has all of the specified permissions
export const hasAllPermissions = (user: AdminUser, permissions: AdminPermission[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

// Get all permissions for a specific role
export const getRolePermissions = (role: AdminRole): AdminPermission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Create a new admin user with default permissions for their role
export const createAdminUser = (
  id: string,
  name: string,
  email: string,
  role: AdminRole
): AdminUser => {
  return {
    id,
    name,
    email,
    role,
    permissions: getRolePermissions(role),
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

// Update user permissions (for super admin use)
export const updateUserPermissions = (
  user: AdminUser,
  permissions: AdminPermission[]
): AdminUser => {
  return {
    ...user,
    permissions,
  };
};

// Get role hierarchy level (higher number = more permissions)
export const getRoleLevel = (role: AdminRole): number => {
  const levels: Record<AdminRole, number> = {
    support: 1,
    moderator: 2,
    admin: 3,
    super_admin: 4,
  };
  return levels[role] || 0;
};

// Check if one role can manage another role
export const canManageRole = (managerRole: AdminRole, targetRole: AdminRole): boolean => {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole);
};

// Get role display information
export const getRoleInfo = (role: AdminRole) => {
  const roleInfo: Record<AdminRole, { name: string; description: string; color: string }> = {
    super_admin: {
      name: 'Super Admin',
      description: 'Full system access and management',
      color: '#d41173', // Primary pink
    },
    admin: {
      name: 'Administrator',
      description: 'Content and user management',
      color: '#ff9800', // Orange
    },
    moderator: {
      name: 'Moderator',
      description: 'Content moderation and user support',
      color: '#2196f3', // Blue
    },
    support: {
      name: 'Support',
      description: 'User assistance and basic support',
      color: '#4caf50', // Green
    },
  };

  return roleInfo[role] || { name: 'Unknown', description: 'No description available', color: '#666' };
};

// Validate admin session and permissions
export const validateAdminAccess = (
  user: AdminUser | null,
  requiredPermissions: AdminPermission[]
): { isValid: boolean; missingPermissions: AdminPermission[] } => {
  if (!user || !user.isActive) {
    return { isValid: false, missingPermissions: requiredPermissions };
  }

  const missingPermissions = requiredPermissions.filter(
    permission => !hasPermission(user, permission)
  );

  return {
    isValid: missingPermissions.length === 0,
    missingPermissions,
  };
};