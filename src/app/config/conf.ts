interface AppWriteConfig {
    appWrtieUrl: string;
    appwriteProjectId: string;
    appwriteDatabaseId: string;
    appwriteCollectionId: string;
    appwriteBucketId: string;
  }
  
  const conf: AppWriteConfig = {
    appWrtieUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_COMPONENTS_COLLECTION_ID),
    appwriteBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ),
  };
  
  export default conf;
  