import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full p-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
