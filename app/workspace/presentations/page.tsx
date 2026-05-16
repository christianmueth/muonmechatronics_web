import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function WorkspacePresentationsAliasPage() {
  redirect("/app/workspace/presentations");
}