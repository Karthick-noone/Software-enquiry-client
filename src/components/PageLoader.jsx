import React from "react";
import { Headset, Orbit } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-mark">
        <Headset size={22} strokeWidth={2} />
      </div>
      <div className="page-loader-bar">
        <div className="page-loader-fill" />
      </div>
    </div>
  );
}
