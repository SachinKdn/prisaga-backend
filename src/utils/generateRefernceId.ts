import { v4 as uuidv4 } from "uuid";

// Function to generate a unique reference ID
export function generateReferenceId(): string {
  const timestamp = Date.now();
  const randomUuid = uuidv4().split('-')[0];  // First part of UUID for uniqueness
  return `JOB-${timestamp}`;
}
