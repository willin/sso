const DEFAULT_REDIRECT = '/';

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 * @license MIT
 * @author https://github.com/jacob-ebey
 */
export function safeRedirect(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  goto: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!goto || typeof goto !== 'string') return defaultRedirect;

  const to: string = to.trim();

  if (
    (!to.startsWith('http') && !to.startsWith('/')) ||
    to.startsWith('//') ||
    to.startsWith('/\\') ||
    to.includes('..')
  ) {
    return defaultRedirect;
  }

  return to;
}
