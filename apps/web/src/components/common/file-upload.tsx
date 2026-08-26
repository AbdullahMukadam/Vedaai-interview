"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  highlight?: string;
  accept?: string;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  label,
  highlight,
  accept = "application/pdf,image/*",
  onFileSelect,
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [disabled, onFileSelect]
  );

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  const renderLabel = () => {
    if (!highlight) return label;
    const idx = label.indexOf(highlight);
    if (idx === -1) return label;
    const before = label.slice(0, idx);
    const after = label.slice(idx + highlight.length);
    return (
      <>
        {before}
        <span className="text-[#FF5623]">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-1 items-center justify-center rounded-[20px] border-[1.5px] border-dashed border-[#CECECE] bg-white p-2.5 transition-[border-color,background-color] duration-150",
        isDragging && "border-[#FF5623] bg-[#FF5623]/5",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "cursor-pointer hover:border-[#FF5623]/50 active:scale-[0.98]",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F3F3F3] p-1">
          <Image src="/icons/upload-icon.svg" alt="" width={32} height={32} />
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[20px] font-semibold leading-[22px] tracking-[-0.06em] text-[#303030]">
            {renderLabel()}
          </span>
          <span className="text-[14px] leading-[22px] tracking-[-0.06em] text-[rgba(94,94,94,0.55)]">
            Max 10MB
          </span>
        </div>
      </div>
    </div>
  );
}
