import { auth } from "@/auth";
import { redirect } from "next/navigation";
import getUserById from "@/lib/profile/getUserById";
import UserInitializer from "../components/layout/SetUserStore";
import ProfileHeader from "../components/layout/ProfileHeader";
import ChangePasswordModal from "@/shared/components/modal/ChangePassword";
import InputPasswordModal from "@/shared/components/modal/InputPassword";
import EditProfile from "../components/edit-profile";
import TabNavigation from "../components/layout/TabNavigation";
import Footer from "../components/layout/Footer";

type Params = {
  params: Promise<{ usersId: string }>;
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

export default async function ProfileLayout({ children, params }: Params) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = (await params).usersId;

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
