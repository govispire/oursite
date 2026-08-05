import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { examCategories, getExamsByCategory } from "@/data/examData";

export default defineTool({
  name: "list_exams",
  title: "List exams in a category",
  description:
    "List the individual exams available inside one exam category. Use `list_exam_categories` first to get a valid category id.",
  inputSchema: {
    categoryId: z
      .string()
      .min(1)
      .describe("Exam category id, e.g. 'banking-insurance' or 'ssc'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ categoryId }) => {
    const known = examCategories.some((c) => c.id === categoryId);
    const exams = getExamsByCategory(categoryId);
    if (!known && exams.length === 0) {
      throw new ToolError(
        `Unknown category '${categoryId}'. Valid ids: ${examCategories.map((c) => c.id).join(", ")}`,
      );
    }
    const rows = exams.map((e) => ({ id: e.id, name: e.name, isPopular: e.isPopular }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { categoryId, exams: rows },
    };
  },
});
