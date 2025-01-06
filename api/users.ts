import { User } from "../types/user";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
