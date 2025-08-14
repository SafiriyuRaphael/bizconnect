import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import getUserById from "@/lib/profile/getUserById";
import UserInitializer from "../components/layout/SetUserStore";
import ProfileHeader from "../components/layout/ProfileHeader";
import ChangePasswordModal from "@/app/components/modals/ChangePassword";
import InputPasswordModal from "@/app/components/modals/InputPassword";
import EditProfile from "../components/edit-profile";
import TabNavigation from "../components/layout/TabNavigation";
import Footer from "../components/layout/Footer";

type Params = {
  usersId: string;
};

export const dynamic = "force-dynamic";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = params.usersId;

  if (session.user.id !== userId) {
    redirect("/unauthorized");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/not-found");
  }


  return (
    <>
      <UserInitializer user={user} />
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Management
            </h1>
            <p className="text-gray-600">
              Manage your BizConnect profile information
            </p>
          </div>
          <ProfileHeader />
          <ChangePasswordModal />
          <InputPasswordModal
            blurIntensity="medium"
            showGlow={false}
            variant="warning"
            size="md"
            showPattern={false}
          />
          <EditProfile />
          <TabNavigation />
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
}
