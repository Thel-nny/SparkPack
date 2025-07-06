import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export function withAuth(
  handler: (req: NextRequest, userId: string, userRole: string) => Promise<NextResponse>,
  requiredRole?: string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token = await getToken({ req });

    if (!token || !token.sub || !token.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (requiredRole && token.role !== requiredRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(req, token.sub, token.role as string);
  };
}
