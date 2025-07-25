import { BASEURL } from "@/constants/url";
import { AnyUser } from "../../../types";

export default async function getLastBusinessUser() {
  try {
    const res = await fetch(`${BASEURL}/api/admin/last-business`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch last business user");
    }

    const user:AnyUser = await res.json();
    return user;
  } catch (err) {
    console.error("💥 Frontend error:", err);
    throw err;
  }
}
