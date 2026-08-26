import { useMutation } from "@tanstack/react-query";
import { assessmentService } from "@/lib/api";

export function useExtractAssessment() {
  return useMutation({
    mutationFn: ({
      questionPaper,
      answerSheet,
    }: {
      questionPaper: File;
      answerSheet: File;
    }) => assessmentService.extract(questionPaper, answerSheet),
  });
}
