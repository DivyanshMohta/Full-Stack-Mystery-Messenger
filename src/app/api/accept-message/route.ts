import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated. ",
      },
      { status: 401 },
    );
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update status of accepting messages",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully.",
        updatedUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("failed to update status of accepting messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update status of accepting messages",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated. ",
      },
      { status: 401 },
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error occured while fetching message accpetance status.",
      },
      { status: 500 },
    );
  }
}
