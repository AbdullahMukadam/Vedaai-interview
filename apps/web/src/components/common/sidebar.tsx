"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const NAV_ITEMS = [
  { label: "Home", icon: "/icons/icon-grid.svg", active: false },
  { label: "My Classroom", icon: "/icons/icon-classroom.svg", active: false },
  { label: "Assignments", icon: "/icons/icon-file-text.svg", active: false },
  { label: "Exams", icon: "/icons/icon-clipboard.svg", active: true },
  { label: "My Library", icon: "/icons/icon-pie-chart.svg", active: false },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const sidebarEase = [0.32, 0.72, 0, 1] as const;

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const reduce = useReducedMotion();

  return (
    <aside
      className={`hidden lg:flex fixed left-3 top-3 bottom-3 flex-col justify-between bg-white z-20 ${
        isCollapsed ? "items-center py-6 px-[12px]" : "py-6 px-6"
      }`}
      style={{
        width: isCollapsed ? 64 : 304,
        borderRadius: 16,
        boxShadow: "0px 32px 48px 0px rgba(0,0,0,0.2), 0px 16px 48px 0px rgba(0,0,0,0.12)",
        transition: "width 300ms cubic-bezier(0.32, 0.72, 0, 1), padding 300ms cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >

      <div className={`flex flex-col items-center gap-14`}>

        <div className={`flex w-full items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {!isCollapsed && (
              <motion.div
                key="logo-full"
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <Image
                  src="/icons/logo.png"
                  alt="VedaAI"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <span className="text-[28px] font-bold tracking-[-0.06em] text-[#303030]">
                  VedaAI
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <Image
              src="/icons/logo-collapsed.png"
              alt="VedaAI"
              width={40}
              height={40}
              className="rounded-xl"
            />
          )}

          <button
            type="button"
            onClick={onToggle}
            className="flex h-5 items-center cursor-pointer justify-center shrink-0 transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            {!isCollapsed && (
              <Image
                src="/icons/collapse-icon.svg"
                alt="Collapse"
                width={20}
                height={20}
              />
            )}
          </button>
        </div>

        <motion.div
          className="group relative isolate overflow-hidden rounded-full cursor-pointer"
          style={{ width: isCollapsed ? 42 : 256, height: 42 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full p-[4px]"
            style={{
              background: "linear-gradient(180deg, #FF7950 0%, #C0350A 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
            }}
          />

          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full p-[4px]"
            style={{
              background: "linear-gradient(-75deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)",
              backgroundSize: "250% 100%",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
            }}
            initial={{ backgroundPosition: "150% 0", opacity: 0 }}
            animate={reduce ? undefined : { backgroundPosition: ["150% 0", "-50% 0"], opacity: [0, 1, 1, 0] }}
            transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, ease: "linear" as const, repeatDelay: 0.8 }}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[4px] z-[1] rounded-[inherit] bg-[#272727]"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[4px] z-[2] rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]"
          />

          <button
            type="button"
            className="relative z-10 cursor-pointer flex h-full w-full items-center justify-center gap-2.5 rounded-full"
          >
            <Image
              src="/icons/icon-toolkit.svg"
              alt={isCollapsed ? "AI Toolkit" : ""}
              width={18}
              height={17}
            />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  className="text-[16px] font-medium tracking-[-0.04em] text-white whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  AI Teacher&apos;s Toolkit
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        <nav className={`flex flex-col gap-2 ${isCollapsed ? "items-center" : "w-full"}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`group flex items-center gap-2 rounded-lg transition-all duration-200 ${
                isCollapsed ? "justify-center p-2" : "px-3 py-[9px]"
              } ${
                item.active
                  ? "bg-[#F0F0F0] font-medium text-[#303030]"
                  : "text-[rgba(94,94,94,0.8)] hover:bg-[#F5F5F5] hover:text-[#303030]"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Image
                src={item.icon}
                alt=""
                width={20}
                height={20}
                className={`transition-all duration-200 group-hover:scale-110 ${
                  item.active ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                }`}
              />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    className="text-[16px] leading-[22px] tracking-[-0.04em] whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          ))}
        </nav>
      </div>

      <div className={`flex flex-col gap-2 ${isCollapsed ? "items-center" : "w-full"}`}>
        <a
          href="#"
          className={`group flex items-center gap-2 rounded-lg transition-all duration-200 ${
            isCollapsed ? "justify-center p-2" : "px-3 py-[2px]"
          } text-[16px] leading-[22px] tracking-[-0.04em] text-[rgba(94,94,94,0.8)] hover:bg-[#F5F5F5] hover:text-[#303030]`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Image
            src="/icons/icon-settings.svg"
            alt=""
            width={20}
            height={20}
            className="transition-all duration-200 group-hover:scale-110"
          />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                className="text-[16px] leading-[22px] tracking-[-0.04em] whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        <AnimatePresence mode="wait" initial={false}>
          {isCollapsed ? (
            <motion.div
              key="collapsed-school"
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="rounded-2xl bg-[#F0F0F0] p-[2px]">
                <Image
                  src="/images/school.png"
                  alt=""
                  width={42}
                  height={43}
                  className="rounded-xl object-cover"
                />
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="flex h-5 w-5 items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
              >
                <Image
                  src="/icons/chevron-right-double.svg"
                  alt="Expand"
                  width={15}
                  height={15}
                />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-school"
              className="rounded-2xl bg-[#F0F0F0] p-3 flex gap-2 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <Image
                src="/images/school.png"
                alt=""
                width={59}
                height={60}
                className="rounded-lg object-cover shrink-0"
              />
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[16px] font-bold leading-[22px] tracking-[-0.04em] text-[#303030] truncate">
                  Delhi Public School
                </span>
                <span className="text-[14px] leading-[22px] tracking-[-0.04em] text-[#5E5E5E] truncate">
                  Bokaro Steel City
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
