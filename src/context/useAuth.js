import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/utils";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${BASE_URL}/get-profile`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          if (response?.data?.success) {
            // toast.success(response?.data?.message);
            setUser(response?.data?.data);
          }
        })
        .catch((err) => {
          setUser(null)
          toast.error(err?.response?.data?.message);
          console.error("get-profile error: ", err)
        });
    }
  }, []);

  const login = async ({ email, password }) => {
    await axios
      .post(`${BASE_URL}/login`, { email, password })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("token", response?.data?.data?.token);
          setUser(response?.data?.data);
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error("login error", err);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
