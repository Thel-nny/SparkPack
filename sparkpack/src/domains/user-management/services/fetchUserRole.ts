export async function fetchUserRole(userId: string) {
  const response = await fetch(`/api/users/${userId}/role`);
  if (!response.ok) {
    throw new Error("Failed to fetch user role");
  }
  const json = await response.json();
  return json.role;
}
