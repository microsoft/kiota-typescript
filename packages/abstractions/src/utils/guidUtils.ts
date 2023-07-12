import { Guid } from "guid-typescript";

export function parseGuidString(source?: string): Guid | undefined {
  if (source && Guid.isGuid(source)) {
    return Guid.parse(source);
  } else {
    return undefined;
  }
}