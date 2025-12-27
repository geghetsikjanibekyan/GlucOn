import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE = "http://192.168.10.15:15000";

export const register = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getMe = async (token: string) => {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const getRecipes = async () => {
  const token : string | null = await AsyncStorage.getItem("token");
  if (token === null) {
    return [];
  }
  const res = await fetch(`${API_BASE}/recipes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  var data = res.json();
  console.log(data)
  return data;
};
