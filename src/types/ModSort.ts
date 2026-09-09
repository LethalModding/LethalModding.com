export interface ModSort {
	direction: "asc" | "desc";
	property:
		| ""
		| "name"
		| "owner"
		| "downloads"
		| "ratings"
		| "size"
		| "dependencies";
}
