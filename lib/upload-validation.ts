/**
 * Server-side file upload validation utilities.
 *
 * NOTE: These routes use Supabase signed URLs — the actual file bytes are
 * uploaded directly from the browser to Supabase Storage and never pass
 * through this server.  Therefore magic-number (file signature) inspection
 * is not possible here.  Magic-number enforcement must be configured in the
 * Supabase Storage bucket policy or handled via a post-upload webhook.
 *
 * What IS enforced here:
 *   - Extension whitelist (from filename)
 *   - Filename sanitization (path-traversal prevention)
 *   - Client-reported MIME type consistency with the extension
 *   - Client-reported file size cap
 */

export interface UploadValidationOptions {
  allowedExtensions: readonly string[];
  allowedMimeTypes: readonly string[];
  maxBytes: number;
}

export interface UploadValidationInput {
  filename: string;
  mimeType?: string;
  fileSize?: number;
}

export interface UploadValidationResult {
  ok: true;
  sanitizedFilename: string;
  ext: string;
}

export interface UploadValidationError {
  ok: false;
  error: string;
}

export const IMAGE_UPLOAD_OPTIONS: UploadValidationOptions = {
  allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"],
  maxBytes: 10 * 1024 * 1024, // 10 MB
};

export const SKILL_FILE_UPLOAD_OPTIONS: UploadValidationOptions = {
  allowedExtensions: ["md", "txt", "pdf", "zip", "tar", "gz", "mp4", "mov", "csv", "json"],
  allowedMimeTypes: [
    "text/",
    "application/pdf",
    "application/zip",
    "application/gzip",
    "application/x-tar",
    "video/mp4",
    "video/quicktime",
    "application/json",
  ],
  maxBytes: 100 * 1024 * 1024, // 100 MB
};

export function sanitizeFilename(filename: string): string {
  const basename = filename
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .pop() ?? "";

  const noControl = basename.replace(/[\x00-\x1f\x7f]/g, "");
  const safe = noControl.replace(/[^a-zA-Z0-9._-]/g, "_");
  const noLeadingDot = safe.replace(/^\.+/, "_");

  return noLeadingDot || "upload";
}

export function validateUpload(
  input: UploadValidationInput,
  options: UploadValidationOptions,
): UploadValidationResult | UploadValidationError {
  const { allowedExtensions, allowedMimeTypes, maxBytes } = options;

  const sanitizedFilename = sanitizeFilename(input.filename);
  if (!sanitizedFilename || sanitizedFilename === "upload") {
    return { ok: false, error: "Invalid filename." };
  }

  const dotIndex = sanitizedFilename.lastIndexOf(".");
  if (dotIndex === -1) {
    return {
      ok: false,
      error: `File must have an extension. Allowed: ${allowedExtensions.join(", ")}.`,
    };
  }
  const ext = sanitizedFilename.slice(dotIndex + 1).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      ok: false,
      error: `File type ".${ext}" is not allowed. Allowed: ${allowedExtensions.map((e) => "." + e).join(", ")}.`,
    };
  }

  if (input.fileSize !== undefined) {
    if (!Number.isFinite(input.fileSize) || input.fileSize < 0) {
      return { ok: false, error: "Invalid file size." };
    }
    if (input.fileSize > maxBytes) {
      const limitMB = Math.round(maxBytes / 1024 / 1024);
      return { ok: false, error: `File exceeds the ${limitMB} MB size limit.` };
    }
  }

  if (input.mimeType) {
    const normalizedMime = input.mimeType.toLowerCase().split(";")[0].trim();
    const mimeAllowed = allowedMimeTypes.some((allowed) =>
      normalizedMime === allowed || normalizedMime.startsWith(allowed),
    );
    if (!mimeAllowed) {
      return {
        ok: false,
        error: `MIME type "${normalizedMime}" is not allowed for this upload.`,
      };
    }
  }

  return { ok: true, sanitizedFilename, ext };
}
