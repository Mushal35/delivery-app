import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export function getUserGlobalTag() {
	return getGlobalTag("users");
}

export function getUserIdTag(id: string) {
	return getIdTag("users", id);
}

export function revalidateUserCache(id: string) {
	// @ts-expect-error
	revalidateTag(getUserGlobalTag());
	// @ts-expect-error
	revalidateTag(getUserIdTag(id));
}
