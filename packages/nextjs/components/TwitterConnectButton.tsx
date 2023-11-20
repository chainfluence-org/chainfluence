import React from "react";
import { useAuth } from "~~/services/providers/AuthProvider";

function TwitterConnectButton() {
  const { user } = useAuth();

  const handleLogin = async () => {
    try {
      window.open("/api/auth/twitter/login", "_blank");
    } catch (error) {
      console.error("Failed to connect with X:", error);
    }
  };

  return (
    <div className="dropdown dropdown-end" onClick={handleLogin}>
      <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
        <span>{user?.twitter ? user?.twitter : `Connect with Twitter`}</span>
      </label>
    </div>
  );
}

export default TwitterConnectButton;
