import getAllUsername from "@/lib/profile/getAllUsername";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ProfileComponent from "../components/ProfileEditSystem";
import getUserByUsername from "@/lib/profile/getUsersByUsername";

type Params = {
  params: Promise<{ username: string }>;
};

export async function generateStaticParams() {
  const usernames = await getAllUsername();
  return usernames.usernames.map((username: string) => ({
    username,
  }));
}

export default async function ProfilePage({ params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const username = (await params).username;

  if (session.user.username !== username) {
    redirect("/unauthorized");
  }

  const user = await getUserByUsername(session.user.username);

  if (!user) {
    redirect("/not-found");
  }

  return <ProfileComponent user={user} />;
}
