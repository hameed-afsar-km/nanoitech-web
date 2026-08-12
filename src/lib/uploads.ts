export type UploadTarget = "cloudinary" | "firebase";

export interface UploadResult {
  url: string;
  provider: UploadTarget;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured (missing cloud name / upload preset).");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed (${res.status}).`);
  }
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Cloudinary upload returned no URL.");
  return data.secure_url;
}

export async function uploadToFirebaseStorage(file: File, path = "uploads"): Promise<string> {
  const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  const { getFirebaseApp } = await import("./firebase");
  const storage = getStorage(getFirebaseApp());
  const extension = file.name.split(".").pop() ?? "bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const storageRef = ref(storage, `${path}/${safeName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadImage(
  file: File,
  target: UploadTarget = "cloudinary",
  path = "uploads",
): Promise<UploadResult> {
  if (target === "cloudinary") {
    const url = await uploadToCloudinary(file);
    return { url, provider: "cloudinary" };
  }
  const url = await uploadToFirebaseStorage(file, path);
  return { url, provider: "firebase" };
}
