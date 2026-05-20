import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function AdminHomePage() {
  const user = await getUser();
  redirect(user ? "/dashboard" : "/login");
}
