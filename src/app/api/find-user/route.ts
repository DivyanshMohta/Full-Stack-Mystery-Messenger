import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import * as z from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid username",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({
      username: result.data.username,
      // isVerified: true,
    }).select("username");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Username not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        username: user.username,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error finding user:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to search for username",
      },
      { status: 500 },
    );
  }
}
