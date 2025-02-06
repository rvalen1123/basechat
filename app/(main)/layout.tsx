import { ReactNode } from "react";

import { AppLocation } from "./types";

interface MainProps {
  children: ReactNode;
  currentTenantId: string;
  name: string;
  appLocation: AppLocation;
}

export default function Main({ children, currentTenantId, name, appLocation }: MainProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header can be added here if needed */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
