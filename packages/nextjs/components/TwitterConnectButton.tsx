import React, { useEffect, useState } from "react";
import { useAuth } from "~~/services/providers/AuthProvider";

function TwitterConnectButton() {
  const { user, fetchUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogin = async () => {
    try {
      if (!user?.twitter) {
        window.open("/api/auth/twitter/login", "_blank");
        setIsRefreshing(true);
      }
    } catch (error) {
      console.error("Failed to connect with X:", error);
    }
  };

  useEffect(() => {
    let intervalId: any;

    if (isRefreshing) {
      intervalId = setInterval(() => {
        fetchUser().then((updatedUser: any) => {
          console.log({ updatedUser });

          if (updatedUser?.twitter) {
            setIsRefreshing(false);
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRefreshing, fetchUser]);

  return (
    <div className="dropdown dropdown-end" onClick={handleLogin}>
      <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
        <span>{user?.twitter ? user?.twitter : `Connect with Twitter`}</span>
      </label>
    </div>
  );
}

export default TwitterConnectButton;
