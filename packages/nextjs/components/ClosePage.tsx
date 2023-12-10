"use client";

import { useEffect } from "react";

export const ClosePage = () => {
  useEffect(() => {
    window.close();
  }, []);

  return (
    <div>
      <p>Processing... You may close this window if it does not close automatically.</p>
    </div>
  );
};
