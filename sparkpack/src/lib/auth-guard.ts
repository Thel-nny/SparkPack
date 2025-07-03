import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function withAuth(
  handler: (req: NextRequest, userId: string, userRole: string) => Promise<NextResponse>,
  requiredRole?: string
) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (requiredRole && session.user.role !== requiredRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!session.user.id || !session.user.role) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    return handler(req, session.user.id, session.user.role);
  };
}