"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav>
      <div>
        <a href="#">Mystery Messanger</a>
        {session ? (
          <>
            <span>Welcome, {user?.username || user?.email}</span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <>
            <Link href={"/sign-in"}>
              <Button>Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
