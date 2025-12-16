import React from "react";

export const rainbowText = (text: string) => {
  const colors = [
    "text-red-400",
    "text-orange-400",
    "text-yellow-400",
    "text-green-400",
    "text-blue-400",
    "text-indigo-400",
    "text-purple-400",
    "text-pink-400",
  ];

  return (
    <>
      {text.split("").map((char, index) => (
        <span key={index} className={colors[index % colors.length]}>
          {char}
        </span>
      ))}
    </>
  );
};
