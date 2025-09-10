import { BASEURL } from "@/shared/constants/url";
import { AnyUser } from "../../../../types";
import apiService from "../../../lib/service/apiService";

type IUserResponse = {
    user: AnyUser
}

export default async function getUserByUsername(username: string) {
    const { response } = await apiService<IUserResponse>({
        endpoint: `${BASEURL}/api/profile/get-users-by-username`,
        method: "POST",
        body: { username }
    })
    return response.data.user
}