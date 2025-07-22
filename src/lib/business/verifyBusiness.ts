import { VerificationType } from "../../../types";

export default async function verifyBusiness({ fullName, documentUrl, businessName, businessAddress, businessPhone, businessLogo, idDocument, selfieUrl, }: VerificationType) {
  const res = await fetch(`/api/business/verify-business`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      documentUrl,
      selfieUrl,
      businessName,
      businessAddress,
      businessPhone,
      idDocument,
      businessLogo,
    }),
  });

  return res
}
