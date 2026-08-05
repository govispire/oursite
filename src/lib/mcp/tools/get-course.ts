import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getCourseById, getInstructorById } from "@/data/courseData";

export default defineTool({
  name: "get_course",
  title: "Get course details",
  description:
    "Get full public details for a single course by id, including instructor profile. Use `search_courses` to find ids.",
  inputSchema: { courseId: z.string().min(1).describe("Course id.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ courseId }) => {
    const course = getCourseById(courseId);
    if (!course) throw new ToolError(`No course found with id '${courseId}'.`);
    const instructor = getInstructorById(course.instructorId) ?? null;
    const payload = {
      ...course,
      instructorProfile: instructor
        ? {
            id: instructor.id,
            name: instructor.name,
            specialization: instructor.specialization,
            experience: instructor.experience,
            rating: instructor.rating,
            studentsCount: instructor.studentsCount,
          }
        : null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { course: payload },
    };
  },
});
