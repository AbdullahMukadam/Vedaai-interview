"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { FileUpload } from "@/components/common/file-upload";
import { FilePreview } from "@/components/common/file-preview";
import { Sidebar } from "@/components/common/sidebar";
import { Toolbar, MobileToolbar } from "@/components/common/toolbar";
import { LoadingScreen } from "./loading-screen";
import { useExtractAssessment } from "@/hooks/useExtractAssessment";
import { useAssessment } from "@/providers/assessment-provider";

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  pageCount?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  },
};

export function UploadScreen() {
  const router = useRouter();
  const [questionPaper, setQuestionPaper] = useState<UploadedFile | null>(null);
  const [answerSheet, setAnswerSheet] = useState<UploadedFile | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const extractMutation = useExtractAssessment();
  const { setResult, setAnswerSheetData } = useAssessment();

  const handleQuestionPaperSelect = useCallback((file: File) => {
    setQuestionPaper({
      file,
      name: file.name,
      size: formatFileSize(file.size),
    });
  }, []);

  const handleAnswerSheetSelect = useCallback((file: File) => {
    setAnswerSheet({
      file,
      name: file.name,
      size: formatFileSize(file.size),
    });
  }, []);

  const handleStartMapping = useCallback(async () => {
    if (questionPaper && answerSheet) {
      setIsLoading(true);
      const answerBuffer = await answerSheet.file.arrayBuffer();
      setAnswerSheetData(answerBuffer);
      extractMutation.mutate(
        { questionPaper: questionPaper.file, answerSheet: answerSheet.file },
        {
          onSuccess: (response) => {
            if (response.success && response.data) {
              setResult(response.data);
              router.push("/assessment/results");
            } else {
              setIsLoading(false);
              alert(response.message || "Extraction failed. Please try again.");
            }
          },
          onError: (error) => {
            setIsLoading(false);
            alert(error.message || "An error occurred. Please try again.");
          },
        }
      );
    }
  }, [
    questionPaper,
    answerSheet,
    extractMutation,
    setResult,
    router,
    setAnswerSheetData,
  ]);

  const bothUploaded = questionPaper && answerSheet;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#EEE] to-[#DADADA] overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <MobileToolbar />
      <Toolbar sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`flex flex-1 flex-col overflow-auto transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[328px]"}`}
      >
        {isLoading ? (
          <div className="h-full mx-2.5 md:mx-0">
            <LoadingScreen />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 lg:py-12">
            <motion.div
              className="flex w-full max-w-[1103px] flex-col items-center gap-9"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fadeUp}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex flex-wrap items-center justify-center md:gap-3">
                  <h1 className="text-[32px] font-bold leading-[1.2em] tracking-[-0.04em] text-[#2B2B2B] lg:text-[40px]">
                    Upload
                  </h1>
                  <div className="rounded-lg md:bg-[rgba(255,147,80,0.15)] px-2 py-1">
                    <span className="text-[32px] font-bold leading-[1.2em] tracking-[-0.04em] md:text-[#FF5623] lg:text-[40px]">
                      Question Paper & Answer Sheets
                    </span>
                  </div>
                </div>
                <p className="text-[20px] leading-[1.4em] tracking-[-0.04em] text-[#303030]">
                  Upload both files to get started
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex w-full items-center justify-center"
              >
                <div className="relative flex aspect-square w-[160px] items-center justify-center md:w-[150px] lg:w-[140px]">
                  <div className="absolute inset-0 rounded-full bg-[#FF5623]/10" />
                  <div className="absolute h-[75%] w-[75%] rounded-full bg-[#FF5623]/20" />
                  <div className="absolute h-[55%] w-[55%] rounded-full bg-white shadow-xl shadow-black/5" />
                  <Image
                    src="/images/illustration.svg"
                    alt="Upload illustration"
                    fill
                    className="absolute inset-0 z-10 scale-[0.62] object-contain"
                    priority
                  />
                  <div className="absolute left-[5%] top-[34%] z-20 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FB975D] to-[#FC5E24] shadow-sm shadow-[#FC5E24]/30 lg:h-4.3 lg:w-4.3">
                    <Image
                      src="/images/task-square.svg"
                      alt="Task"
                      width={14}
                      height={14}
                      className="h-[50%] w-[50%]"
                    />
                  </div>

                  <div className="absolute right-[20%] top-[12%] z-20 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FB975D] to-[#FC5E24] shadow-sm shadow-[#FC5E24]/30 lg:h-4.3 lg:w-4.3">
                    <Image
                      src="/images/clock.svg"
                      alt="Clock"
                      width={14}
                      height={14}
                      className="h-[50%] w-[50%]"
                    />
                  </div>

                  <div className="absolute bottom-[36%] right-[8%] z-20 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FB975D] to-[#FC5E24] shadow-sm shadow-[#FC5E24]/30 lg:h-4.3 lg:w-4.3">
                    <Image
                      src="/images/cloud-lightning.svg"
                      alt="Cloud"
                      width={14}
                      height={14}
                      className="h-[50%] w-[50%]"
                    />
                  </div>

                  <div className="absolute bottom-[14%] left-[26%] z-20 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FB975D] to-[#FC5E24] shadow-sm shadow-[#FC5E24]/30 lg:h-4.3 lg:w-4.3">
                    <Image
                      src="/images/settings.svg"
                      alt="Settings"
                      width={14}
                      height={14}
                      className="h-[50%] w-[50%]"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex w-full max-w-[789px] flex-col gap-4 rounded-[24px] bg-white/50 p-3 lg:flex-row"
              >
                <AnimatePresence mode="popLayout">
                  {questionPaper ? (
                    <motion.div
                      key="question-preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: {
                          duration: 0.15,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-1"
                    >
                      <FilePreview
                        fileName={questionPaper.name}
                        fileSize={questionPaper.size}
                        pageCount={questionPaper.pageCount}
                        onRemove={() => setQuestionPaper(null)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="question-upload"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: {
                          duration: 0.15,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-1"
                    >
                      <FileUpload
                        label="Upload Question Paper"
                        highlight="Question Paper"
                        onFileSelect={handleQuestionPaperSelect}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {answerSheet ? (
                    <motion.div
                      key="answer-preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: {
                          duration: 0.15,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-1"
                    >
                      <FilePreview
                        fileName={answerSheet.name}
                        fileSize={answerSheet.size}
                        pageCount={answerSheet.pageCount}
                        onRemove={() => setAnswerSheet(null)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer-upload"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: {
                          duration: 0.15,
                          ease: [0.23, 1, 0.32, 1],
                        },
                      }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-1"
                    >
                      <FileUpload
                        label="Upload Answer Sheet"
                        highlight="Answer Sheet"
                        onFileSelect={handleAnswerSheetSelect}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex flex-col items-center gap-3"
              >
                <motion.button
                  type="button"
                  disabled={!bothUploaded || extractMutation.isPending}
                  onClick={handleStartMapping}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-full bg-[#303030] px-6 py-3 text-white shadow-[0px_4px_5px_rgba(0,0,0,0.12)] transition-colors duration-150 hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <span className="text-[14px] font-medium leading-[1.4em] tracking-[-0.04em]">
                    {extractMutation.isPending
                      ? "Extracting..."
                      : "Start Mapping"}
                  </span>
                  <Image
                    src="/images/arrow-right.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </motion.button>
                <p className="max-w-[285px] text-center text-[14px] leading-[22px] tracking-[-0.06em] text-[rgba(94,94,94,0.8)]">
                  Once both files are uploaded, you&apos;ll be able to map
                  answers with questions
                </p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
