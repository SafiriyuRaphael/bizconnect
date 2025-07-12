import getAllUsername from "@/lib/profile/getAllUsername";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ProfileComponent from "../components/ProfileEditSystem";
import getAllUserId from "@/lib/profile/getAllUserId";
import getUserById from "@/lib/profile/getUserById";

type Params = {
  params: Promise<{ usersId: string }>;
};

export async function generateStaticParams() {
  const data = await getAllUserId();
  return data.usersId.map((id: string) => ({
    usersId: id,
  }));
}

export default async function ProfilePage({ params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = (await params).usersId;

  if (session.user.id !== userId) {
    redirect("/auth/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/not-found");
  }

  return <ProfileComponent user={user} />;
}
