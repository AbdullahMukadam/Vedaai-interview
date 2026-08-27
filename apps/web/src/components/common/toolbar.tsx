"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ToolbarProps {
  sidebarCollapsed: boolean;
}

export function Toolbar({ sidebarCollapsed }: ToolbarProps) {
  const router = useRouter()
  return (
    <header
      className={`hidden lg:flex items-center gap-2 rounded-2xl bg-white/75 px-6 h-14 transition-all duration-300 ${
        sidebarCollapsed ? "ml-[88px]" : "ml-[328px]"
      } mt-3 mx-3`}
    >
      <div onClick={() => router.push("/")} className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full bg-white">
        <Image src="/images/arrow-back.svg" alt="Back" width={24} height={24} />
      </div>
      <div className="flex items-center gap-2">
        <Image src="/icons/icon-clipboard.svg" alt="" width={20} height={20} />
        <span className="text-[16px] font-semibold tracking-[-0.04em] text-[#A9A9A9]">
          Exams
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6]">
        <Image src="/images/question-mark.svg" alt="Help" width={20} height={20} />
      </div>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6]">
        <Image src="/images/bell-desktop2.svg" alt="Notifications" width={24} height={24} />
        <span className="absolute right-[3px] top-[3px] h-2 w-2 rounded-full bg-[#FF5623]" />
      </div>
      <div className="h-9 w-9 rounded-full bg-[#F6F6F6]">
        <Image src="/images/user-avatar.png" alt="User" width={36} height={36} className="rounded-full object-cover" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[16px] font-semibold tracking-[-0.04em] text-[#303030]">
          Madhur Rastogi
        </span>
        <Image src="/images/chevron-down.svg" alt="" width={24} height={24} />
      </div>
    </header>
  );
}

export function MobileToolbar() {
  return (
    <header className="flex w-full px-[10px] py-2 lg:hidden">
      <div className="flex w-full items-center justify-between rounded-2xl bg-white px-3 h-[56px]">
        <div className="flex items-center gap-2">
          <Image src="/images/arrow-back.svg" alt="Back" width={24} height={24} />
          <span className="text-xl font-bold tracking-[-0.06em] text-[#303030]">
            VedaAI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F6F6]">
            <Image src="/images/bell.svg" alt="Notifications" width={24} height={24} />
            <span className="absolute right-[3px] top-[3px] h-2 w-2 rounded-full bg-[#FF5623]" />
          </div>
          <div className="h-8 w-8 rounded-full bg-[#F6F6F6]" />
          <Image src="/images/menu.svg" alt="Menu" width={24} height={24} />
        </div>
      </div>
    </header>
  );
}
