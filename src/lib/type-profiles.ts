import rawProfiles from "../../data/diagnoses/compatibility-54/types.json";

type RawProfiles = typeof rawProfiles;

export type TypeProfile = RawProfiles[keyof RawProfiles] & {
  type: string;
};

export const typeProfiles: TypeProfile[] = (Object.values(rawProfiles) as TypeProfile[]).sort((a, b) =>
  a.name.localeCompare(b.name, "ja")
);

export const typeProfilesMap: Record<string, TypeProfile> = Object.fromEntries(
  typeProfiles.map((profile) => [profile.type, profile])
);
