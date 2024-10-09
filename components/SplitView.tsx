"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Pin } from "@/lib/types";
import GoogleMap from "./GoogleMap";
import { columns } from "@/app/pins/columns";
import { DataTable } from "./data-table/data-table";

interface SelectedPinContextType {
  selectedPin: Pin | null;
  setSelectedPin: (pin: Pin | null) => void;
}

const SelectedPinContext = createContext<SelectedPinContextType | undefined>(
  undefined,
);
export const SelectedPinProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  return (
    <SelectedPinContext.Provider value={{ selectedPin, setSelectedPin }}>
      {children}
    </SelectedPinContext.Provider>
  );
};

export const useSelectedPin = (): SelectedPinContextType => {
  const context = useContext(SelectedPinContext);
  if (!context) {
    throw new Error("useSelectedPin must be used within a SelectedPinProvider");
  }
  return context;
};

interface SplitViewClientProps {
  pins: Pin[];
}

export default function SplitViewClient({ pins }: SplitViewClientProps) {
  return (
    <div className="flex flex-row">
      <GoogleMap pins={pins} />
      <div className="w-1/2 px-2">
        <DataTable columns={columns} data={pins} />
      </div>
    </div>
  );
}
