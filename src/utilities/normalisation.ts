import { singular } from "pluralize";

export const normalizeName = (name: string) =>
  singular(name.trim().toLowerCase());
