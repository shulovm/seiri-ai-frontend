import SisterStudentHome from "@/components/sister/SisterStudentHome";

export const dynamic = "force-dynamic";

export default function SisterStudyPage() {
  const studentLineUserId = process.env.STUDENT_LINE_USER_ID ?? "";
  return <SisterStudentHome studentLineUserId={studentLineUserId} />;
}
