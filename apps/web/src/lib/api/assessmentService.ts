import type { APIResponse, AssessmentResult } from "@repo/types";
import { API_ENDPOINTS } from "@repo/constants";
import { fetchClient } from "./fetchClient";

class AssessmentService {
  async extract(
    questionPaper: File,
    answerSheet: File
  ): Promise<APIResponse<AssessmentResult>> {
    const formData = new FormData();
    formData.append("questionPaper", questionPaper);
    formData.append("answerSheet", answerSheet);

    return fetchClient.uploadFile<AssessmentResult>(
      API_ENDPOINTS.EXTRACT,
      formData
    );
  }
}

export const assessmentService = new AssessmentService();
