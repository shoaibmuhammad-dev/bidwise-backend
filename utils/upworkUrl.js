const AppError = require("./AppError");

// Upwork job IDs look like ~022107116407525638592 (older ones can contain letters)
const JOB_ID_REGEX = /~(0[0-9a-z]{15,})/i;

/**
 * Validates that the input is an Upwork URL and pulls out the job ID.
 * Returns a canonical URL that WE build, so the server never fetches
 * an arbitrary user-supplied address (prevents SSRF).
 */
function parseUpworkJobUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl).trim());
  } catch {
    throw new AppError("Please enter a valid URL.", 400, "INVALID_URL");
  }

  const host = url.hostname.toLowerCase();
  const isUpwork = host === "upwork.com" || host.endsWith(".upwork.com");
  if (!["http:", "https:"].includes(url.protocol) || !isUpwork) {
    throw new AppError(
      "Only Upwork job links are supported.",
      400,
      "NOT_UPWORK_URL",
    );
  }

  const haystack = `${url.pathname}${url.search}`.replace(/%7E/gi, "~");
  const match = haystack.match(JOB_ID_REGEX);
  if (!match) {
    throw new AppError(
      "Could not find a job ID in this link. Use a link like upwork.com/jobs/~02...",
      400,
      "JOB_ID_NOT_FOUND",
    );
  }

  const jobId = `~${match[1]}`;
  return { jobId, canonicalUrl: `https://www.upwork.com/jobs/${jobId}` };
}

module.exports = { parseUpworkJobUrl };
