import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
// import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signUpSchema } from "@/schemas/signUpSchema";

// import { NextRequest } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid signup data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { username, email, password } = result.data;

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: 500,
          },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: true,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // const emailResponse = await SendVerificationEmail(
    //   email,
    //   username,
    //   verifyCode,
    // );

    // if (!emailResponse.success) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: emailResponse.message,
    //     },
    //     {
    //       status: 500,
    //     },
    //   );
    // }

    return Response.json(
      {
        success: true,
        message: "User registered successfully.",
        // message: "User registered successfully. Please verify your email.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering User", error);
    return Response.json(
      {
        success: false,
        message: "User Registration failed",
      },
      {
        status: 500,
      },
    );
  }
}
