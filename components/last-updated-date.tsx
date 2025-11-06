"use client";

export function LastUpdatedDate() {
  return <>{new Date().toLocaleDateString()}</>;
}
