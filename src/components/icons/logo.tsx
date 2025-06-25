import * as React from "react";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fa7e1e" />
          <stop offset="100%" stopColor="#d62976" />
        </linearGradient>
      </defs>
      <path
        d="M17.5 5H9.5L6.5 12H14.5L11.5 19H17.5"
        stroke="url(#logoGradient)"
      />
    </svg>
  );
}
