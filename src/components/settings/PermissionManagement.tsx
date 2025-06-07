
import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { usePermissions, useRolePermissions } from '../../hooks/useUserManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

const ROLE_ORDER = ['admin', 'manager', 'technician', 'user'] as const;

const PermissionManagement = () => {
  const { data: permissions = [], isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissions = [], isLoading: rolePermissionsLoading } = useRolePermissions();

  const hasPermission = (role: string, permissionId: string) => {
    return rolePermissions.some(
      rp => rp.role === role && rp.permission_id === permissionId
    );
  };

  const getPermissionCategory = (permissionName: string) => {
    const category = permissionName.split('_')[0];
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'technician':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'user':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (permissionsLoading || rolePermissionsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">Permission Management</h3>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    const category = getPermissionCategory(permission.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Permission Management</h3>
      </div>

      <div className="space-y-8">
        {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
          <div key={category} className="space-y-4">
            <h4 className="text-md font-medium text-foreground border-b border-border pb-2">
              {category} Permissions
            </h4>
            
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Description</TableHead>
                    {ROLE_ORDER.map(role => (
                      <TableHead key={role} className="text-center">
                        <Badge variant="secondary" className={getRoleColor(role)}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Badge>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium text-foreground">
                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {permission.description}
                      </TableCell>
                      {ROLE_ORDER.map(role => (
                        <TableCell key={role} className="text-center">
                          {hasPermission(role, permission.id) ? (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-600 dark:text-red-400 mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionManagement;
