"use client";
import useRegister from "@/app/auth/register/hook/useRegister";
import TypeToggle from "./components/composite/TypeToggle";
import Header from "./components/layout/Header";
import Form from "./components/layout/Form";
import Footer from "./components/layout/Footer";

export default function BizconnectRegister() {
  const {
    setUserType,
    userType,
    handleSubmit,
    formData,
    handleInputChange,
    handleLogoUpload,
    logoFile,
    errors,
    router,
    isSubmitting,
  } = useRegister();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 sm:pt-14 via-white to-indigo-50 ">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <TypeToggle userType={userType} setUserType={setUserType} />

        <Form
          errors={errors}
          formData={formData}
          handleInputChange={handleInputChange}
          handleLogoUpload={handleLogoUpload}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          userType={userType}
          router={router}
          logoFile={logoFile}
        />

        <Footer />
      </div>
    </div>
  );
}
