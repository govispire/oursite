import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { courses } from "@/data/courseData";

export default defineTool({
  name: "search_courses",
  title: "Search courses",
  description:
    "Search the public course catalog by keyword, category and course type (Prelims, Mains, Interview, Complete). Returns price, rating, duration and content counts.",
  inputSchema: {
    query: z
      .string()
      .nullable()
      .describe("Free-text search over course title, instructor and subjects. Null for all."),
    category: z
      .string()
      .nullable()
      .describe("Course category id to filter by, e.g. 'banking'. Null for all."),
    type: z
      .enum(["Prelims", "Mains", "Interview", "Complete"])
      .nullable()
      .describe("Course type filter. Null for all."),
    limit: z.number().int().nullable().describe("Max results to return. Null defaults to 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, type, limit }) => {
    const q = query?.trim().toLowerCase();
    const rows = courses
      .filter((c) => (category ? c.category === category : true))
      .filter((c) => (type ? c.type === type : true))
      .filter((c) =>
        q
          ? [c.title, c.instructor, ...c.subjects].join(" ").toLowerCase().includes(q)
          : true,
      )
      .slice(0, Math.max(1, Math.min(limit ?? 20, 50)))
      .map((c) => ({
        id: c.id,
        title: c.title,
        instructor: c.instructor,
        category: c.category,
        type: c.type,
        price: c.price,
        originalPrice: c.originalPrice ?? null,
        rating: c.rating,
        duration: c.duration,
        studentsCount: c.studentsCount,
        subjects: c.subjects,
        chaptersCount: c.chaptersCount,
        videosCount: c.videosCount,
        testsCount: c.testsCount,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, courses: rows },
    };
  },
});
