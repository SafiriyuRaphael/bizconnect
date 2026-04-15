import { Suspense } from "react";
import BizConnectChat from "./ChatPage";
import Loader from "@/shared/components/ui/Loader";

export default async function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<Loader fullScreen text="Loading chats ..." variant="bars" />}
    >
      <BizConnectChat />
    </Suspense>
  );
}
