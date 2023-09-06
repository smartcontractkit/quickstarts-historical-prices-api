import React from "react";

function BackgroundSVG() {
  return (
    <svg
      style={{
        position: "absolute",
        zIndex: -1,
        width: "870",
        height: "655",
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="a"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="1440"
        height="682"
      >
        <path fill="#C4C4C4" d="M0 0h1440v682H0z"></path>
      </mask>
      <g mask="url(#a)">
        <path
          d="M165.257-879.762c7.294-4.092 16.192-4.092 23.486 0l668.82 375.215c7.57 4.247 12.257 12.251 12.257 20.931v749.249c0 8.681-4.687 16.684-12.257 20.931l-668.82 375.215c-7.294 4.092-16.192 4.092-23.486 0l-668.82-375.215c-7.57-4.247-12.257-12.25-12.257-20.931v-749.249c0-8.68 4.687-16.684 12.257-20.931l668.82-375.215Z"
          fill="url(#b)"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="b"
          x1="27.5"
          y1="361"
          x2="866"
          y2="361"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EFF3FD"></stop>
          <stop offset=".802083" stopColor="#F5F7FD" stopOpacity="0"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default BackgroundSVG;
