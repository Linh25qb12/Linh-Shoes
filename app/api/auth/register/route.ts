
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest
) {
    try {
        const body = await req.json();
        const data = body;
        const hashedPassword = await hash(data.password, 12);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, password: hashedPassword }),
        });

        const user = await response.json();

        return new NextResponse(
            JSON.stringify({
                status: "success",
                data: { user: { ...user, password: undefined } },
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        if (error) {
            return new NextResponse("failed validations", error);
        }

        if (error.code === "P2002") {
            return new NextResponse("user with that email already exists", { status: 409 });
        }

        return new NextResponse(error.message, { status: 500 });
    }
}
