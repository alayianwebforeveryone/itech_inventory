import conf from '../../app/config/conf';
import { Client, Databases, Storage, ID, Query } from 'appwrite';
// import authService from './auth.js';

export class AddCompServices {
    client = new Client();
    databases;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appWrtieUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client)
    }

    async uploadFile(file: any) {
        console.log("file in comp", file);
        try {
            const response = await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file);
            console.log('File uploaded successfully:', response); 
            console.log('File after upload:', file); // Add this line for debugging
            return response; // Return the response which contains file metadata (e.g., file ID)
        } catch (error) {
            console.error('Error uploading file:', error); 
            throw error;
        }
    }
    

    // add a new components
    async createComponents({ name, category, location, quantity, imageFile }: any) {
        try {
            console.log("image file inside create components", imageFile)
            const component = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    name,
                    category,
                    location,
                    quantity,
                    image: imageFile, 
                },
            );
            console.log('Component Created:', component);
            return component;
        } catch (error) {
            console.error('AddCompServices :: createComponents() ::', error);
            throw error;
        }
    }
    
    


    // Get all events created by the user
    async getAllComp(searchTerm?: string) {
        try {
            const queries = searchTerm
                ? [Query.search('name', searchTerm)] // Add search query if searchTerm exists
                : []; // No query if searchTerm is undefined
    
            const comp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries // Pass the queries array
            );
    
            // Add image URL for each component
            const componentsWithImages = comp.documents.map((component: any) => ({
                ...component,
                imageUrl: this.storage.getFilePreview(conf.appwriteBucketId, component.image),
            }));
    
            return componentsWithImages;
        } catch (error) {
            console.error('ComponentService :: getAllComp() ::', error);
            throw error;
        }
    }
    
    

    // Update an event
    async updateComp(compId: string, updatedData: any) {
        console.log("Expecting image file", updatedData);
    
        try {
            // Fetch the current component data
            const existingComponent = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                compId
            );
    
            // Check if a new image file is provided
            if (updatedData?.image && updatedData.image instanceof File) {
                console.log("Uploading new image file...");
                const uploadedFile = await this.storage.createFile(
                    conf.appwriteBucketId,
                    ID.unique(), // Generate a unique ID for the file
                    updatedData.image
                );
    
                console.log("Uploaded New File:", uploadedFile);
    
                // Delete the old image file from storage
                if (existingComponent.image) {
                    await this.storage.deleteFile(conf.appwriteBucketId, existingComponent.image);
                    console.log("Old image deleted from storage");
                }
    
                // Update the image field in the data
                updatedData.image = uploadedFile.$id;
            }
    
            // Remove unnecessary fields
            delete updatedData.imageUrl;
    
            console.log("Final updated data to be sent to Appwrite:", updatedData);
    
            // Update the document in the database
            const updatedDoc = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                compId,
                updatedData
            );
    
            return updatedDoc;
        } catch (error) {
            console.error("Error updating component:", error);
            throw error;
        }
    }
    
    
    
    
      async uploadImage(image: File) {
        try {
          const uploadedFile = await this.storage.createFile(
            conf.appwriteBucketId,
            "unique()",
            image
          );
          return uploadedFile;
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      }


    // Delete an event
    // Delete a component
    async deleteComp(compId: any) {
        try {
            // Fetch the document to get the image file ID
            const component = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                compId
            );
         console.log("spec", component)
            if (component.image) {
                // Delete the associated image from the bucket
                await this.storage.deleteFile(conf.appwriteBucketId, component.image);
                console.log('Associated image deleted successfully', component.image);
            } else {
                console.warn('No associated image found for this component');
            }
    
            // Delete the document
            const result = await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                compId
            );
            console.log('Component deleted successfully:', result);
    
            return result;
        } catch (error) {
            console.error('AddCompServices :: deleteComp() ::', error);
            throw error;
        }
    }
    

}

// Create an instance of the EventService
const addCompServices = new AddCompServices();
export default addCompServices;