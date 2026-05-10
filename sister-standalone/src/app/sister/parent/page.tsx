import SisterParent from "@/components/sister/SisterParent";

export const dynamic = "force-dynamic";

export default function SisterParentPage() {
  const studentLineUserId = process.env.STUDENT_LINE_USER_ID ?? "";
  return <SisterParent studentLineUserId={studentLineUserId} />;
}
