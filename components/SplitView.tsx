"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Pin } from "@/lib/types";
import GoogleMap from "./GoogleMap";
import { DataTable } from "./data-table/data-table";
import { truncatedColumns } from "@/app/split/columns";

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
    <div className="flex flex-col md:flex-row h-screen">
      <GoogleMap pins={pins} className="h-1/2 md:h-auto md:w-2/3" />
      <div className="h-1/2 md:h-auto md:w-1/3 px-1 pt-1">
        <DataTable
          columns={truncatedColumns}
          data={pins}
          columnToFilter="name"
        />
      </div>
    </div>
  );
}
