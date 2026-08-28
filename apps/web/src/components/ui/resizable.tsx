"use client";

import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Group>) {
  return (
    <ResizablePrimitive.Group
      orientation={orientation}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" && "flex-col",
        className
      )}
      {...props}
    />
  );
}

const ResizablePanel = ResizablePrimitive.Panel;

function ResizableHandle({
  withHandle,
  orientation = "horizontal",
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        "group relative flex items-center justify-center outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#FF8D36]/50 focus-visible:ring-offset-1",
        orientation === "horizontal"
          ? "w-px after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 after:content-['']"
          : "h-px after:absolute after:inset-x-0 after:top-1/2 after:h-3 after:-translate-y-1/2 after:content-['']",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div 
          className="absolute left-1/2 top-1/2 z-10 h-14 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-transform duration-150 group-hover:scale-110" 
        />
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };