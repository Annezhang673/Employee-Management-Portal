export const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLocaleLowerCase();
  return token && role ? { token, role } : null;
};
