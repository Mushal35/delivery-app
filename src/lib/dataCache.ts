type CacheTag = "users";

export function getGlobalTag(tag: CacheTag) {
	return `global:${tag}` as const;
}

export function getUserTag(tag: CacheTag, userId: string) {
	return `user:${userId}-${tag}` as const;
}

export function getIdTag(tag: CacheTag, id: string) {
	return `id:${id}-${tag}` as const;
}
