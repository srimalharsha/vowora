// VOWORA Cloudinary image uploads. Uses an unsigned preset; never put an API secret in browser code.
export const CLOUDINARY_CLOUD_NAME = "j2rty45r";
export const CLOUDINARY_UPLOAD_PRESET = "sirilook_upload";

export async function uploadDataUrl(value, folder = "vowora") {
  if (!value || typeof value !== "string" || !value.startsWith("data:image/")) return value || "";
  const blob = await (await fetch(value)).blob();
  const form = new FormData();
  form.append("file", blob, "vowora-image.jpg");
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  form.append("folder", folder.startsWith("vowora/") ? folder : "vowora/" + folder);
  const response = await fetch("https://api.cloudinary.com/v1_1/" + CLOUDINARY_CLOUD_NAME + "/image/upload", {
    method: "POST",
    body: form
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Cloudinary upload failed (" + response.status + ")");
  }
  return result.secure_url;
}

export async function uploadAudioFile(file, folder = "music") {
  if (!file || (!file.type.startsWith("audio/") && !/\.mp3$/i.test(file.name || ""))) throw new Error("කරුණාකර MP3 Audio File එකක් තෝරන්න.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Music File එක 10 MB ට වඩා කුඩා විය යුතුයි.");
  const form = new FormData(); form.append("file", file, file.name || "vowora-music.mp3"); form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); form.append("folder", folder.startsWith("vowora/") ? folder : "vowora/" + folder);
  const response = await fetch("https://api.cloudinary.com/v1_1/" + CLOUDINARY_CLOUD_NAME + "/video/upload", { method: "POST", body: form });
  const result = await response.json().catch(() => ({})); if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Music upload failed (" + response.status + ")"); return result.secure_url;
}

export function galleryThumbUrl(value) {
  if (!value) return "";
  if (!/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(value)) return value;
  return value.replace("/image/upload/", "/image/upload/c_limit,w_420,q_auto,f_auto/");
}
