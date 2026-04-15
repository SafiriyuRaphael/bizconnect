import { Suspense } from "react";
import ResetPassword from "./ResetPasswordComponent";
import Loader from "@/shared/components/ui/Loader";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Loader
          fullScreen
          text="Verifying password reset link ..."
          variant="bars"
        />
      }
    >
      <ResetPassword />
    </Suspense>
  );
}
