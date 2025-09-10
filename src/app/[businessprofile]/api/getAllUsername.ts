import { BASEURL } from "@/shared/constants/url";
import { AllUsernames } from "../../../../types";
import apiService from "@/lib/service/apiService";

export default async function getAllUsername() {
    const { response } = await apiService<AllUsernames>(
        {
            endpoint: `${BASEURL}/api/profile/all-username`,
            method: "GET"
        }
    )

    return response.data
}
