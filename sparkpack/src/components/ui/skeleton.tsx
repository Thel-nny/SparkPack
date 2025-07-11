import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
