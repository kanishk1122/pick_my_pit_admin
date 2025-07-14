const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Login failed");
  }

  return data;
};
