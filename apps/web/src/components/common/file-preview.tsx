"use client";

import Image from "next/image";

interface FilePreviewProps {
  fileName: string;
  fileSize: string;
  pageCount?: string;
  onRemove: () => void;
}

export function FilePreview({
  fileName,
  fileSize,
  pageCount,
  onRemove,
}: FilePreviewProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center h-36 rounded-[20px] border-[2px] border-dashed border-[#CECECE] bg-white p-4">
      <div className="flex items-center gap-3 rounded-xl bg-[#F6F6F6] p-3 pr-5 relative">
        <div className="h-[35px] w-[40px] shrink-0 overflow-hidden rounded">
          <Image
            src="/images/pdf-icon.png"
            alt="PDF"
            width={35}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-1">
          <span className="max-w-[180px] truncate text-[16px] font-bold leading-[1.4em] tracking-[-0.04em] text-[#2B2B2B]">
            {fileName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[1.4em] tracking-[-0.04em] text-[rgba(94,94,94,0.8)]">
              {fileSize}
            </span>
            {pageCount && (
              <>
                <span className="h-[5px] w-[5px] rounded-full bg-[rgba(94,94,94,0.8)]" />
                <span className="text-[14px] leading-[1.4em] tracking-[-0.04em] text-[rgba(94,94,94,0.8)]">
                  {pageCount}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-[-10px] top-[-10px] flex h-[25.6px] w-[25.6px] items-center justify-center rounded-full bg-[rgba(43,43,43,0.8)] shadow-[0px_4px_11.4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80"
        >
          <Image
            src="/icons/close-icon.svg"
            alt="Remove"
            width={16}
            height={16}
          />
        </button>
      </div>
    </div>
  );
}
