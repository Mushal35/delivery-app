export const hasRole = (userRoles: string[], allowedRoles: string[]): boolean => {
  if (allowedRoles.length === 0) return true;
  return userRoles.some((role) => allowedRoles.includes(role));
};