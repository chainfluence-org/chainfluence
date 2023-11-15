import React from "react";

function ConnectWithXButton() {
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
        <span>Connect with Twitter</span>
      </label>
    </div>
  );
}

export default ConnectWithXButton;
