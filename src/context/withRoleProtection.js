import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "./useAuth";

const withRoleProtection = (Component, allowedRoles) => {
  return (props) => {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
        router.push("/unauthorized");
      } else {
        const token = localStorage.getItem("token");
        if (token) {
          router.push("/dashboard");
        }
      }
    }, [user, router]);

    if (!user || (allowedRoles && !allowedRoles.includes(user?.role))) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};

export default withRoleProtection;
