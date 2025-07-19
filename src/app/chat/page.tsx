import { Suspense } from "react";
import BizConnectChat from "./ChatPage"; 

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BizConnectChat />
    </Suspense>
  );
}
