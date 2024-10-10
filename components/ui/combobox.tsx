"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  items,
  searchLabel,
  onSelect,
}: {
  items: { value: string; label: string }[];
  searchLabel: string;
  onSelect?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? items.find((item) => item.value === value)?.label
              : `Select ${searchLabel}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <ItemList
              items={items}
              searchLabel={searchLabel}
              value={value}
              setOpen={setOpen}
              setValue={setValue}
              onSelect={onSelect}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between mx-1"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : `Select ${searchLabel}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ItemList
          items={items}
          searchLabel={searchLabel}
          value={value}
          setOpen={setOpen}
          setValue={setValue}
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

function ItemList({
  items,
  searchLabel,
  value,
  setOpen,
  setValue,
  onSelect,
}: {
  items: { value: string; label: string }[];
  searchLabel: string;
  value: string;
  setOpen: (open: boolean) => void;
  setValue: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder={`Search ${searchLabel}...`} />
      <CommandList>
        <CommandEmpty>No {searchLabel} found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                onSelect?.(currentValue);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === item.value ? "opacity-100" : "opacity-0",
                )}
              />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
