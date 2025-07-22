import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ProfileComponent from "../components/ProfileEditSystem";
import getUserById from "@/lib/profile/getUserById";
import BizConVerification from "../components/verify";

type Params = {
  params: Promise<{ usersId: string[] }>;
};

// export async function generateStaticParams() {
//   const data = await getAllUserId();
//   return data.usersId.map((id: string) => ({
//     usersId: id,
//   }));
// }
export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = (await params).usersId[0];
  const maybeAction = (await params).usersId[1];

  if (session.user.id !== userId) {
    redirect("/unauthorized");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/not-found");
  }

  if (maybeAction === "verify" && user.userType==="business") {
    return <BizConVerification/>;
  }

  return <ProfileComponent user={user} />;
}
