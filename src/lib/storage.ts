import { createClient } from "./supabase/client";

// Storage bucket names
export const STORAGE_BUCKETS = {
  TRACKS: "radio-tracks",
  SEGMENTS: "radio-segments",
  ASSETS: "radio-assets",
  ARTIST_SUBMISSIONS: "artist-submissions",
} as const;

/**
 * Get a public URL for an asset in Supabase Storage
 */
export function getPublicStorageUrl(bucket: string, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get a signed URL for a private asset (valid for 1 hour by default)
 */
export async function getSignedStorageUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
): Promise<{ path: string | null; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || "3600",
      contentType: options?.contentType || file.type,
      upsert: options?.upsert || false,
    });

  if (error) {
    return { path: null, error };
  }

  return { path: data.path, error: null };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  return { error: error || null };
}

/**
 * Get public URL for a track
 */
export function getTrackUrl(storagePath: string): string {
  return getPublicStorageUrl(STORAGE_BUCKETS.TRACKS, storagePath);
}

/**
 * Get public URL for a segment
 */
export function getSegmentUrl(storagePath: string): string {
  return getPublicStorageUrl(STORAGE_BUCKETS.SEGMENTS, storagePath);
}

/**
 * Get public URL for an asset (cover art, avatar, etc.)
 */
export function getAssetUrl(storagePath: string): string {
  return getPublicStorageUrl(STORAGE_BUCKETS.ASSETS, storagePath);
}

