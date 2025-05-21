import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize Google Drive client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/**
 * Creates or retrieves the 'ChatsFiles' folder in Google Drive.
 * @returns The ID of the 'ChatsFiles' folder.
 */
async function getOrCreateChatsFilesFolder(): Promise<string> {
  const folderName = 'ChatsFiles';
  const mimeType = 'application/vnd.google-apps.folder';

  try {
    // Search for the folder
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='${mimeType}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    const files = response.data.files || [];
    if (files.length > 0) {
      return files[0].id!; // Return the first matching folder's ID
    }

    // Create the folder if it doesn't exist
    const createResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: mimeType,
      },
      fields: 'id',
    });

    const folderId = createResponse.data.id;
    if (!folderId) {
      throw new Error('Failed to create ChatsFiles folder: No folderId returned');
    }

    // Make the folder publicly accessible (optional, align with file permissions)
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return folderId;
  } catch (error) {
    console.error('Error getting or creating ChatsFiles folder:', error);
    throw error;
  }
}

/**
 * Uploads a file to the 'ChatsFiles' folder in Google Drive and returns the file ID.
 * @param fileBuffer - The file data as a Buffer.
 * @param fileName - The name to give the file on Google Drive.
 * @param mimeType - The MIME type of the file.
 * @returns The file ID of the uploaded file.
 */
export async function uploadToGoogleDrive(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  try {
    // Get or create the ChatsFiles folder
    const folderId = await getOrCreateChatsFilesFolder();

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
        parents: [folderId], // Specify the folder as the parent
      },
      media: {
        mimeType: mimeType,
        body: Readable.from(fileBuffer),
      },
      fields: 'id',
    });

    const fileId = response.data.id;
    if (!fileId) throw new Error('File upload failed: No fileId returned');

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return fileId;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

/**
 * Deletes a file from Google Drive.
 * @param fileId - The ID of the file to delete.
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw error;
  }
}