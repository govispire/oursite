import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { examNotifications } from "@/data/examNotificationData";

export default defineTool({
  name: "list_exam_notifications",
  title: "List exam notifications",
  description:
    "List public exam notifications with application windows, payment deadlines, exam dates and official links. Optionally filter to one exam category or only upcoming exams.",
  inputSchema: {
    categoryId: z
      .string()
      .nullable()
      .describe("Exam category id to filter by. Null for all categories."),
    upcomingOnly: z
      .boolean()
      .nullable()
      .describe("When true, return only exams flagged as upcoming. Null means no filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ categoryId, upcomingOnly }) => {
    const rows = examNotifications
      .filter((n) => (categoryId ? n.categoryIds.includes(categoryId) : true))
      .filter((n) => (upcomingOnly ? n.isUpcoming : true))
      .map((n) => ({
        id: n.id,
        examName: n.examName,
        categoryIds: n.categoryIds,
        applicationStart: n.applicationPeriod.startDate,
        applicationEnd: n.applicationPeriod.endDate,
        paymentLastDate: n.paymentLastDate,
        examDate: n.examDate,
        applyStatus: n.applyStatus,
        resultStatus: n.resultStatus,
        isUpcoming: n.isUpcoming,
        links: n.urls,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, notifications: rows },
    };
  },
});
