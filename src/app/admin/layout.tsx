import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";

// Force dynamic rendering to prevent build-time prerendering
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname =
    headersList.get("x-pathname") || headersList.get("referer") || "";

  // Allow login page without authentication
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const JWT_SECRET =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
    const decoded = jwt.verify(token, JWT_SECRET) as {
      username: string;
      isAdmin: boolean;
    };

    if (!decoded || !decoded.isAdmin) {
      redirect("/admin/login");
    }
  } catch {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
