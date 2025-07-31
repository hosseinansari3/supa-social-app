import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabaseUrl } from "../constants";
import { supabase } from "../lib/supabase";

/**
 * Returns image source for user profile.
 * If no image path is provided, return default avatar image.
 */
export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("../assets/images/default-user.png");
  }
};

/**
 * Generates public URL for a file stored in Supabase storage.
 */
export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
};

/**
 * Uploads a file (image or video) to Supabase storage.
 *
 * @param {string} folderName - Folder to store file in
 * @param {string} fileUri - URI of the file to upload
 * @param {boolean} isImage - Determines if file is image or video
 * @returns {object} success response with uploaded file path or error message
 */

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    // Generate a unique path for the file
    let fileName = getFilePath(folderName, isImage);

    // Read file as base64 string
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Decode base64 into ArrayBuffer (required by Supabase)
    let imageData = decode(fileBase64);

    // Upload the file to Supabase
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600", // Cache for 1 hour
        upsert: false, // Avoid overwriting files with same name
        contentType: isImage ? "image/*" : "video/*",
      });

    // Handle upload errors
    if (error) {
      console.log("file upload error", error);
      return { success: false, msg: "could not upload media" };
    }

    // Return success with uploaded file path
    return { success: true, data: data.path };
  } catch (error) {
    console.log("file upload error", error);
    return { success: false, msg: "could not upload media" };
  }
};

/**
 * Generates a unique file path using timestamp and file extension.
 */
export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
