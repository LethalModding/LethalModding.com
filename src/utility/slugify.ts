export const slugify = (text?: string | null): string => {
  if (!text) return ''

  return text
    .toLowerCase()
    // Remove non-word characters
    .replace(/[^a-z0-9]+/g, '-')
    // Replace multiple - with single -
    .replace(/-+/g, '-')
    // Remove leading and trailing -
    .replace(/^-+|-+$/g, '')
}
