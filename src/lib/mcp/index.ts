import { defineMcp } from "@lovable.dev/mcp-js";
import listExamCategories from "./tools/list-exam-categories";
import listExams from "./tools/list-exams";
import searchCourses from "./tools/search-courses";
import getCourse from "./tools/get-course";
import listExamNotifications from "./tools/list-exam-notifications";

export default defineMcp({
  name: "updatedexam",
  title: "Updatedexam",
  version: "0.1.0",
  instructions:
    "Public tools for Updatedexam, an Indian competitive-exam preparation platform. Browse exam categories and exams with `list_exam_categories` and `list_exams`, explore the course catalog with `search_courses` and `get_course`, and check application windows and exam dates with `list_exam_notifications`. All data returned is public catalog content; no student accounts or personal data are exposed.",
  tools: [listExamCategories, listExams, searchCourses, getCourse, listExamNotifications],
});
