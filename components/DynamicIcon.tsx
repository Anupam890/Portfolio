"use client";

import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

export function DynamicIcon({
  iconName,
  className = "h-full w-full text-neutral-500 dark:text-neutral-300",
}: DynamicIconProps) {
  // Dynamically look up the icon component by name from the Tabler Icons library
  // This allows us to load any icon based on CMS data without importing each one individually
  // The type cast is necessary because TypeScript can't infer the dynamic lookup at compile time
  const Icon = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[iconName];

  // If the icon exists, render it; otherwise show a fallback question mark icon
  return Icon ? (
    <Icon className={className} />
  ) : (
    <HelpCircle className={className} />
  );
}
