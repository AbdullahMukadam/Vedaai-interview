"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sidebar } from "@/components/common/sidebar";
import { Toolbar, MobileToolbar } from "@/components/common/toolbar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { QuestionsPanel } from "./questions-panel";
import { AnswerSheetPanel } from "./answer-sheet-panel";
import { useAssessment } from "@/providers/assessment-provider";

export function AnswerMappingScreen() {
  const router = useRouter();
  const { result, clearResult } = useAssessment();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"questions" | "answer">("questions");

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  if (!result) return null;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#EEE] to-[#DADADA] overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <MobileToolbar />
      <Toolbar sidebarCollapsed={sidebarCollapsed} />

      <div className="flex w-full px-[10px] py-2 lg:hidden">
        <div className="flex w-full rounded-full bg-[#F6F6F6] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("questions")}
            className={`flex flex-1 items-center justify-center rounded-full py-3 text-[16px] font-medium transition-all duration-150 ${
              activeTab === "questions"
                ? "bg-[#303030] text-white shadow-[0px_32px_48px_rgba(0,0,0,0.2),0px_4px_4px_rgba(0,0,0,0.25)] ring-1 ring-[#7B7B7B]"
                : "text-[rgba(94,94,94,0.8)]"
            }`}
          >
            Questions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("answer")}
            className={`flex flex-1 items-center justify-center rounded-full py-3 text-[16px] font-medium transition-all duration-150 ${
              activeTab === "answer"
                ? "bg-[#303030] text-white shadow-[0px_32px_48px_rgba(0,0,0,0.2),0px_4px_4px_rgba(0,0,0,0.25)] ring-1 ring-[#7B7B7B]"
                : "text-[rgba(94,94,94,0.8)]"
            }`}
          >
            Answer Sheet
          </button>
        </div>
      </div>

      <main
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[328px]"
        }`}
      >
        <div className="hidden lg:flex flex-1 p-2 overflow-hidden">
          <ResizablePanelGroup orientation="horizontal" className="gap-0">
            <ResizablePanel defaultSize="55%" minSize="30%" maxSize="70%" className="min-w-0 pr-1">
              <motion.div
                className="flex h-full w-full min-w-0"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                <QuestionsPanel />
              </motion.div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="45%" minSize="30%" maxSize="70%" className="min-w-0 pl-1">
              <motion.div
                className="flex h-full w-full min-w-0"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
              >
                <AnswerSheetPanel />
              </motion.div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-2 lg:hidden">
          {activeTab === "questions" ? (
            <QuestionsPanel />
          ) : (
            <AnswerSheetPanel />
          )}
        </div>
      </main>
    </div>
  );
}
