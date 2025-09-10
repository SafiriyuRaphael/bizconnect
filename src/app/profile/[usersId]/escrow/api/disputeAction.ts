import apiService from "@/lib/service/apiService";
import { OpenPayload, RespondPayload } from "../types/escrow";

export default async function disputeAction(props: OpenPayload | RespondPayload) {
  let payload;

  if (props.action === "open") {
    payload = {
      escrowId: props.escrowId,
      reason: props.reason,
      details: props.details,
      evidence: props.evidence,
    };
  } else {
    payload = {
      disputeId: props.disputeId,
      message: props.message,
      evidence: props.evidence,
    };
  }
  const { response } = await apiService({
    endpoint: "/api/escrow/dispute",
    method: "POST",
    body: { payload, action: props.action },
  });
  return response;
}
