import { Suspense } from "react";
import VerifyTokenPage from "./VerifyTokenPage";
import Loader from "@/shared/components/ui/Loader";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<Loader fullScreen text="Verifying email link..." variant="bars" />}
    >
      <VerifyTokenPage />
    </Suspense>
  );
}
