import { defineTool } from "@lovable.dev/mcp-js";
import { examCategories } from "@/data/examData";

export default defineTool({
  name: "list_exam_categories",
  title: "List exam categories",
  description:
    "List all competitive exam categories offered on the platform (Banking & Insurance, SSC, Railways, UPSC, State PSC and more) with descriptions and enrolment counts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = examCategories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      studentsEnrolled: c.studentsEnrolled,
      examsAvailable: c.examsAvailable,
      isPopular: c.isPopular,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { categories: rows },
    };
  },
});
