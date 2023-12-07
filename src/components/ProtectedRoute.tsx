import { useAuthStore } from "@/store/store";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuthStore();

  //  const navigate = useNavigate();
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      // navigate('/unauthorized');
      navigate("/unauthorized");
    }
  }, [navigate, accessToken]);

  return <div>{accessToken ? children : null}</div>;
};

export default ProtectedRoute;
