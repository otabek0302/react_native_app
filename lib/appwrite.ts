import { Client, ID, Avatars, Databases, Query, Account, Storage } from 'react-native-appwrite';

interface SavedVideo {
  $id: string;
}


interface CustomProps {
  email: string;
  password: string;
  username: string;
}

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.otabek.aora",
  projectId: "66ba6e5f001bdbd64373",
  databaseId: "66bb39ca0006cfd3ad7c",
  usersCollectionId: "66bb39f600310318e4a2",
  videosCollectionId: "66bb3b1f00186e55a7fe",
  storageId: "66ba72460025f6a07eab"
};

const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

const validateProps = ({ email, password, username }: CustomProps) => {
  if (!email || !password || !username) {
    throw new Error("Missing required fields: email, password, or username.");
  }
};

export const createUser = async (props: CustomProps) => {
  try {
    validateProps(props);
    const { email, password, username } = props;

    // Create the account
    const newAccount = await account.create(ID.unique(), email, password, username);
    console.log(newAccount);

    // Generate avatar URL
    const avatarUrl = avatar.getInitials(username);
    console.log(avatarUrl);


    // Sign in the user
    await signIn(email, password);

    // Create a document in the database
    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    );

    return newUser;

  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${error}`);
  }
};

export const signIn = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Missing required fields: email or password.");
  }

  try {
    console.log(`Attempting to sign in with email: ${email}`);

    // Attempt to sign in the user
    const session = await account.createEmailPasswordSession(email, password);

    console.log('Sign in successful:', session);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error(`Failed to sign in: ${error}`);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    console.log('Logged out successfully.');
    return session;
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    // Ensure user is authenticated before attempting to fetch user details
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw new Error("No current account found.");
    }

    // console.log("Current account:", currentAccount);

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (currentUser.documents.length === 0) {
      throw new Error("No user found for the current account.");
    }

    // console.log("Current user document:", currentUser.documents[0]);
    return currentUser.documents[0];

  } catch (error) {
    console.error("Error retrieving current user:", error);
    throw new Error(`Failed to retrieve current user: ${error}`);
  }
};

export async function getUserPosts(userId: string) {
  try {

    if (!userId) {
      throw new Error('Search query cannot be empty');
    }
    console.log(userId);

    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal('users', userId)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    throw new Error(`Failed to retrieve current user: ${error}`);
  }
}

export const getAllPosts = async () => {
  try {

    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
    )

    return posts.documents;

  } catch (error) {
    console.error("Error retrieving current user:", error);
    throw new Error(`Failed to retrieve current user: ${error}`);
  }
}

export const getLastestPosts = async () => {
  try {

    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    )

    return posts.documents;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    throw new Error(`Failed to retrieve current user: ${error}`);
  }
}

export const searchPosts = async (query: string) => {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }

    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search('title', query)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error retrieving search results:", error);
    throw new Error(`Failed to retrieve search results: ${error}`);
  }
};

// Upload File
export async function uploadFile(file: any, type: any) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file: ${error}`);
  }
}

// Get File Preview
export async function getFilePreview(fileId: any, type: any) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = await storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("File URL not found");

    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw new Error(`Failed to get file preview: ${error}`);
  }
}

export const createVideoPost = async (form: any) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error("Error creating video post:", error);
    throw new Error(`Failed to create video post: ${error}`);
  }
}

export async function saveVideo(userId: string, videoId: string) {
  try {
    if (!userId || !videoId) {
      throw new Error('User ID and Video ID cannot be empty');
    }

    // Fetch the user's document
    const user = await databases.getDocument(
      config.databaseId,
      config.usersCollectionId,
      userId
    );

    // Retrieve the list of saved video IDs
    const savedVideos: SavedVideo[] = user.savedVideos || [];

    // Check if the video ID is already in the list
    const isAlreadySaved = savedVideos.some(video => video.$id === videoId);
    console.log(isAlreadySaved);
    
    if (isAlreadySaved) {
      // Remove the video ID from the saved list
      const updatedSavedVideos = savedVideos.filter(video => video.$id !== videoId);
      console.log('Updated saved videos after removal:', JSON.stringify(updatedSavedVideos, null, 2));

      await databases.updateDocument(
        config.databaseId,
        config.usersCollectionId,
        userId,
        {
          savedVideos: updatedSavedVideos,
        }
      );

      console.log('Video removed successfully!');
    } else {
      // Add the video ID to the saved list
      const updatedSavedVideos = [...savedVideos, { $id: videoId }];
      console.log('Updated saved videos after addition:', JSON.stringify(updatedSavedVideos, null, 2));

      // Update the user's document with the new list
      await databases.updateDocument(
        config.databaseId,
        config.usersCollectionId,
        userId,
        {
          savedVideos: updatedSavedVideos,
        }
      );

      console.log('Video saved successfully!');
    }
  } catch (error) {
    console.error('Error toggling video save status:', error);
    throw new Error(`Failed to toggle video save status: ${error}`);
  }
}

export const checkForUpdates = async (userId: string) => {
  try {
    const updatedUser = await databases.getDocument(
      config.databaseId,
      config.usersCollectionId,
      userId
    );

    console.log("Updated user document:", JSON.stringify(updatedUser, null, 2));
  } catch (error) {
    console.error('Error fetching updated user document:', error);
  }
};


export async function getSavedPosts(userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID cannot be empty');
    }

    // Fetch the user's document
    const user = await databases.getDocument(
      config.databaseId,
      config.usersCollectionId,
      userId
    );

    // Retrieve the list of saved video IDs
    const savedVideos = user.savedVideos || [];

    return savedVideos;
  } catch (error) {
    console.error("Error retrieving saved posts:", error);
    throw new Error(`Failed to retrieve saved posts: ${error}`);
  }
}