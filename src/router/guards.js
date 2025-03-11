import { usePermissionStore } from "@/stores/permissionStore";

// دالة لحماية المسارات بالصلاحيات
export function requirePermission(permission) {
  return (to, from, next) => {
    const permissionStore = usePermissionStore();

    if (permissionStore.hasPermission(permission)) {
      next();
    } else {
      next(from.fullPath);
    }
  };
}
