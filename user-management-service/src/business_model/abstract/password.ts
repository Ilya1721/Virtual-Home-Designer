export interface SafePasswordHandler {
  isEqual: (safePassword: string, rawPassword: string) => Promise<boolean>;
  getSafeString: (rawPassword: string) => Promise<string>;
}
