"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function LoadingScreen() {
  return (
    <div className="flex flex-1 flex-col sm:p-2.5">
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl bg-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex flex-col items-center gap-[15px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            <Image
              src="/images/loader-container.svg"
              alt=""
              width={128}
              height={134}
            />
          </motion.div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative h-9 w-[159px] overflow-hidden">
              <span
                className="absolute inset-0 bg-clip-text text-[30px] font-bold leading-[36px] tracking-[-0.04em] text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #303030 20%, #606060 40%, #808080 50%, #606060 60%, #303030 80%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite linear",
                }}
              >
                Extracting...
              </span>
            </div>
            <motion.p
              className="text-[20px] font-normal leading-[36px] tracking-[-0.06em] text-[rgba(70,70,70,0.75)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              This may take a while
            </motion.p>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
