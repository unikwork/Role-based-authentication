"use client";
import withRoleProtection from "@/context/withRoleProtection";

const Home = () => {
  return (
    <div>
      
    </div>
  );
};

export default withRoleProtection(Home, ["admin", "user"]);
