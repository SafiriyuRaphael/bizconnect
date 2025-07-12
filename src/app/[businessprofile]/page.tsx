import getAllUsername from "@/lib/profile/getAllUsername";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import getUserByUsername from "@/lib/profile/getUsersByUsername";
import UsersProfile from "./components/BusinessProfile";

type Params = {
  params: Promise<{ businessprofile: string }>;
};

export async function generateStaticParams() {
  const usernames = await getAllUsername();
  return usernames.usernames.map((username: string) => ({
    username,
  }));
}

export default async function page({ params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const username = (await params).businessprofile;

  // if (session.user.username !== username) {
  //   redirect("/auth/login");
  // }

  const user = await getUserByUsername(username);

  if (!user) {
    redirect("/not-found");
  }

  return <UsersProfile user={user} reviewId={session.user.id} />;
}
