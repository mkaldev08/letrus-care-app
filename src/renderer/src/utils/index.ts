export function createFormalName(name: string): string {
  // Split the name into parts, removing extra spaces
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length < 3) return name

  // Keep first and last names, abbreviate middle names
  const initials = parts.slice(1, -1).map((part) => part[0].toUpperCase() + '.')
  return [parts[0], ...initials, parts[parts.length - 1]].join(' ')
}
// Abbreviate names longer than three parts
export function abbreviateName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length < 4) return name
  // Keep initials for all but the last name
  const initials = parts.slice(0, -1).map((part) => part[0].toUpperCase() + '.')
  return [...initials, parts[parts.length - 1]].join(' ')
}
