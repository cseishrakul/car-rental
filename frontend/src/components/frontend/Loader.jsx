import React from "react";

const Loader = ({ size = 56, color = "var(--color-primary)", inline = false }) => {
  return (
    <div className={inline ? "flex justify-center items-center" : "flex justify-center items-center h-[80vh]"}>
      <div
        className="animate-spin rounded-full border-4 border-gray-300"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
        }}
      ></div>
    </div>
  );
};

export default Loader;
