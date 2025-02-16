import React, { useEffect } from "react";
import { useAuthContext } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  useEffect(function () {
    if (!isAuthenticated) navigate("/");
  });
  return isAuthenticated ? children : null;
}
