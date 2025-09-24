import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { ElevatedCard, Button } from '../../shared/components';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

const UserManagementScreen = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const roles = [
    { id: 'All', name: 'All Users', count: 1250 },
    { id: 'Admin', name: 'Administrators', count: 5 },
    { id: 'Moderator', name: 'Moderators', count: 25 },
    { id: 'Premium', name: 'Premium Users', count: 450 },
    { id: 'User', name: 'Regular Users', count: 770 },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Premium', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive', joinDate: '2023-12-10' },
  ];

  const handleUserAction = (userId: number, action: string) => {
    Alert.alert(
      `${action} User`,
      `Are you sure you want to ${action.toLowerCase()} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: action, style: 'destructive', onPress: () => console.log(`${action} user ${userId}`) },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Typography variant="headlineMedium" color="onBackground" style={{ marginBottom: 8 }}>
            User Management
          </Typography>
          <Typography variant="bodyLarge" color="onSurfaceVariant">
            Manage users, roles, and permissions
          </Typography>
        </View>

        {/* Search and Filters */}
        <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="search" size={20} color={colors.onSurfaceVariant} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: colors.onSurface,
              }}
              placeholder="Search users..."
              placeholderTextColor={colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Role Filters */}
          <View style={{ marginBottom: 16 }}>
            <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 8 }}>
              Filter by Role
            </Typography>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 16,
                    backgroundColor: selectedRole === role.id ? colors.primaryContainer : colors.surfaceVariant,
                  }}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <Typography
                    variant="labelMedium"
                    color={selectedRole === role.id ? 'onPrimaryContainer' : 'onSurfaceVariant'}
                  >
                    {role.name} ({role.count})
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filters */}
          <View>
            <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 8 }}>
              Filter by Status
            </Typography>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["All", "Active", "Inactive", "Suspended"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 16,
                    backgroundColor: selectedStatus === status ? colors.primaryContainer : colors.surfaceVariant,
                  }}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Typography
                    variant="labelMedium"
                    color={selectedStatus === status ? "onPrimaryContainer" : "onSurfaceVariant"}
                  >
                    {status}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ElevatedCard>

        {/* Users List */}
        <ElevatedCard style={{ padding: 16 }}>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
            Users ({users.length})
          </Typography>
          
          {users.map((user) => (
            <View
              key={user.id}
              style={{
                padding: 16,
                marginBottom: 12,
                borderRadius: 12,
                backgroundColor: colors.surfaceVariant,
                borderWidth: 1,
                borderColor: colors.outline,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View>
                  <Typography variant="titleMedium" color="onSurface">
                    {user.name}
                  </Typography>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    {user.email}
                  </Typography>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Typography variant="labelMedium" color="primary">
                    {user.role}
                  </Typography>
                  <Typography variant="labelSmall" color={user.status === 'Active' ? 'primary' : 'error'}>
                    {user.status}
                  </Typography>
                </View>
              </View>
              
              <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginBottom: 12 }}>
                Joined: {user.joinDate}
              </Typography>
              
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  title="Edit"
                  variant="outlined"
                  size="small"
                  onPress={() => handleUserAction(user.id, 'Edit')}
                  style={{ flex: 1 }}
                />
                <Button
                  title="View"
                  variant="text"
                  size="small"
                  onPress={() => handleUserAction(user.id, 'View')}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Delete"
                  variant="text"
                  size="small"
                  color="error"
                  onPress={() => handleUserAction(user.id, 'Delete')}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ))}
        </ElevatedCard>
      </View>
    </ScrollView>
  );
};

export default UserManagementScreen;
