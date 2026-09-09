import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ofetch } from "ofetch";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { CornerAccents } from "@/components/branding/CornerAccents.tsx";
import { Link } from "@/components/mui/Link.tsx";
import { Breadcrumb } from "@/components/tools/Breadcrumb.tsx";
import { Pagination } from "@/components/tools/Pagination.tsx";
import type { Mod } from "@/types/Mod.ts";
import type { ModSort } from "@/types/ModSort.ts";
import { type Filters, filterMods, sortMods } from "@/utility/modFilters.ts";

const ToolsHome: NextPage = (): JSX.Element => {
	const [allMods, setAllMods] = useState<Mod[]>([]);
	// A failed fetch would otherwise render as an empty result set, which reads
	// as "Thunderstore has no mods" rather than "the search is unavailable".
	const [loadError, setLoadError] = useState<string | null>(null);
	useEffect(() => {
		const timeout = setTimeout(() => {
			ofetch("https://thunderstore.io/c/lethal-company/api/v1/package/")
				.then((data) => {
					if (data.error) {
						setLoadError(String(data.error));
						return;
					}

					setLoadError(null);
					setAllMods(data);
				})
				.catch(() => {
					setLoadError("Could not reach the Thunderstore API.");
				});
		}, 100);

		return () => clearTimeout(timeout);
	}, []);

	const [allCategories, setAllCategories] = useState<string[]>([]);
	useEffect(() => {
		const newCategories = new Set<string>();
		for (const mod of allMods) {
			for (const category of mod.categories) {
				newCategories.add(category);
			}
		}
		setAllCategories(Array.from(newCategories).sort());
	}, [allMods]);

	//
	// Filters
	//

	const [filters, setFilters] = useState<Filters>({
		hasDonation: null,
		hasNSFW: false,
		hasWebsite: null,
		isDeprecated: false,
		isPinned: null,
		maxDependencies: -1,
		minDependencies: 0,
		maxDownloads: -1,
		minDownloads: 0,
		maxRatings: -1,
		minRatings: 0,
		maxSize: -1,
		minSize: 0,
		name: "",
		owner: "",
	});
	const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	}, []);
	const handleFilterCheckboxChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const { name } = e.target;
			const oldValue = filters[name];
			let value: boolean | null = null;

			if (oldValue === null) {
				value = false;
			} else if (oldValue) {
				value = null;
			} else {
				value = true;
			}

			setFilters((prev) => ({ ...prev, [name]: value }));
		},
		[filters],
	);

	const [includesCategoryFilter, setIncludesCategoryFilter] = useState<
		string[]
	>([]);
	const handleIncludesCategoryFilterChange = useCallback(
		(e: SelectChangeEvent<string[]>) => {
			if (typeof e.target.value === "string") {
				setIncludesCategoryFilter(e.target.value.split(","));
			} else {
				setIncludesCategoryFilter(e.target.value);
			}
		},
		[],
	);
	const [excludesCategoryFilter, setExcludesCategoryFilter] = useState<
		string[]
	>([]);
	const handleExcludesCategoryFilterChange = useCallback(
		(e: SelectChangeEvent<string[]>) => {
			if (typeof e.target.value === "string") {
				setExcludesCategoryFilter(e.target.value.split(","));
			} else {
				setExcludesCategoryFilter(e.target.value);
			}
		},
		[],
	);

	const filteredMods = useMemo(
		() =>
			filterMods(allMods, filters, {
				includes: includesCategoryFilter,
				excludes: excludesCategoryFilter,
			}),
		[allMods, filters, includesCategoryFilter, excludesCategoryFilter],
	);

	//
	// Sorting
	//

	const [sort, setSort] = useState<ModSort>({
		direction: "asc",
		property: "",
	});

	const sortedMods = useMemo(
		() => sortMods(filteredMods, sort),
		[filteredMods, sort],
	);

	//
	// Pagination
	//

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(100);

	const thisPage = useMemo(
		() => sortedMods.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
		[sortedMods, pageNumber, pageSize],
	);

	return (
		<>
			<Head>
				<title>Your Source for Lethal Company Tools</title>
			</Head>

			<CornerAccents />

			<Box
				sx={{
					height: "calc(100vh - 56px)",
					overflowX: "hidden",
					overflowY: "auto",
					p: 6,
					pb: 4,

					"&::-webkit-scrollbar": {
						width: "0.5em",
						height: "0.5em",
					},

					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "var(--accent)",
					},
				}}
			>
				<Breadcrumb parts={["Tools", "Thunderstore Search"]} />

				{loadError !== null && (
					<Typography color="error" sx={{ mt: 3 }} variant="body2">
						{loadError}
					</Typography>
				)}

				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 3,
						mt: 3,

						".MuiFormLabel-root.MuiInputLabel-shrink": {
							mt: -0.5,
						},

						"fieldset legend span": {
							fontSize: "0.9em",
						},

						"& > *": {
							flexGrow: 1,
						},
					}}
				>
					<TextField
						label="Name"
						name="name"
						onChange={handleFilterChange}
						type="text"
						value={filters.name}
						variant="outlined"
					/>
					<TextField
						label="Author"
						name="owner"
						onChange={handleFilterChange}
						type="text"
						value={filters.owner}
						variant="outlined"
					/>

					<FormControl sx={{ minWidth: 150 }} variant="outlined">
						<InputLabel>Include</InputLabel>
						<Select
							label="Include"
							multiple={true}
							onChange={handleIncludesCategoryFilterChange}
							renderValue={(selected: string[]) => (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.5,
										pt: 0.75,

										".MuiChip-root": {
											fontSize: "0.7em",
											padding: 0,
										},
									}}
								>
									{selected.map((value) => (
										<Chip
											color="primary"
											key={value}
											label={value}
											size="small"
										/>
									))}
								</Box>
							)}
							value={includesCategoryFilter}
							variant="outlined"
						>
							{allCategories.map((x) => (
								<MenuItem key={x} value={x}>
									{x}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ minWidth: 150 }} variant="outlined">
						<InputLabel>Exclude</InputLabel>
						<Select
							label="Exclude"
							multiple={true}
							onChange={handleExcludesCategoryFilterChange}
							renderValue={(selected: string[]) => (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.5,
										pt: 0.75,

										".MuiChip-root": {
											fontSize: "0.7em",
											padding: 0,
										},
									}}
								>
									{selected.map((value) => (
										<Chip
											color="primary"
											key={value}
											label={value}
											size="small"
										/>
									))}
								</Box>
							)}
							value={excludesCategoryFilter}
							variant="outlined"
						>
							{allCategories.map((x) => (
								<MenuItem key={x} value={x}>
									{x}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						inputProps={{ min: 0 }}
						label="Min. Dependencies"
						name="minDependencies"
						onChange={handleFilterChange}
						type="number"
						value={filters.minDependencies}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: -1 }}
						label="Max. Dependencies"
						name="maxDependencies"
						onChange={handleFilterChange}
						type="number"
						value={filters.maxDependencies}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: 0 }}
						label="Min. Downloads"
						name="minDownloads"
						onChange={handleFilterChange}
						type="number"
						value={filters.minDownloads}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: -1 }}
						label="Max. Downloads"
						name="maxDownloads"
						onChange={handleFilterChange}
						type="number"
						value={filters.maxDownloads}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: 0 }}
						label="Min. Ratings"
						name="minRatings"
						onChange={handleFilterChange}
						type="number"
						value={filters.minRatings}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: -1 }}
						label="Max. Ratings"
						name="maxRatings"
						onChange={handleFilterChange}
						type="number"
						value={filters.maxRatings}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: 0 }}
						label="Min. Size (MB)"
						name="minSize"
						onChange={handleFilterChange}
						type="number"
						value={filters.minSize}
						variant="outlined"
					/>
					<TextField
						inputProps={{ min: -1 }}
						label="Max. Size (MB)"
						name="maxSize"
						onChange={handleFilterChange}
						type="number"
						value={filters.maxSize}
						variant="outlined"
					/>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-around",
						flexDirection: "row",
						flexWrap: "wrap",
						py: 2,
					}}
				>
					<FormLabel>
						<Checkbox
							checked={filters.hasDonation ?? false}
							indeterminate={filters.hasDonation === null}
							name="hasDonation"
							onChange={handleFilterCheckboxChange}
						/>{" "}
						Donation Link
					</FormLabel>
					<FormLabel>
						<Checkbox
							checked={filters.hasNSFW ?? false}
							indeterminate={filters.hasNSFW === null}
							name="hasNSFW"
							onChange={handleFilterCheckboxChange}
						/>{" "}
						NSFW Content
					</FormLabel>
					<FormLabel>
						<Checkbox
							checked={filters.hasWebsite ?? false}
							indeterminate={filters.hasWebsite === null}
							name="hasWebsite"
							onChange={handleFilterCheckboxChange}
						/>{" "}
						Website
					</FormLabel>
					<FormLabel>
						<Checkbox
							checked={filters.isDeprecated ?? false}
							indeterminate={filters.isDeprecated === null}
							name="isDeprecated"
							onChange={handleFilterCheckboxChange}
						/>{" "}
						Deprecated
					</FormLabel>
					<FormLabel>
						<Checkbox
							checked={filters.isPinned ?? false}
							indeterminate={filters.isPinned === null}
							name="isPinned"
							onChange={handleFilterCheckboxChange}
						/>{" "}
						Pinned
					</FormLabel>
				</Box>

				<Pagination
					pageNumber={pageNumber}
					pageSize={pageSize}
					totalResults={sortedMods.length}
					setPageNumber={setPageNumber}
					setPageSize={setPageSize}
					setSort={setSort}
					sort={sort}
				/>

				<Box
					sx={{
						display: "grid",
						alignItems: "flex-start",
						justifyContent: "space-around",
						gridTemplateColumns:
							"repeat(auto-fill, minmax(calc(192px + 32px), 1fr))",
						gap: 1,
						my: 2,

						"& > *": {
							backgroundColor: "var(--background)",
							borderRadius: 0.2,
							p: 2,
							width: "calc(192px + 32px)",

							"&:hover": {
								backgroundColor: "var(--accent)",
							},

							".MuiTypography-root": {
								// overflow with ellipsis
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							},

							".MuiTypography-body2": {
								color: "white",
								fontSize: "0.8em",
								pt: 1,
							},
						},
					}}
				>
					{thisPage.map((x) => (
						<Link
							href={x.package_url}
							key={x.uuid4}
							sx={{
								color: "inherit",
								display: "block",
								textDecoration: "none",
							}}
							target="_blank"
						>
							<Image
								alt={x.name}
								height={192}
								loading="lazy"
								src={x.versions[0].icon}
								width={192}
							/>
							<Typography variant="body2">{x.owner}</Typography>
							<Typography variant="body1">{x.name}</Typography>
						</Link>
					))}
				</Box>

				<Pagination
					pageNumber={pageNumber}
					pageSize={pageSize}
					totalResults={sortedMods.length}
					setPageNumber={setPageNumber}
					setPageSize={setPageSize}
					setSort={setSort}
					sort={sort}
				/>
			</Box>
		</>
	);
};

export default ToolsHome;
