export const defaultString = (str: string | undefined, fallback: string): string => {
  return str?.trim() ? str : fallback
}
