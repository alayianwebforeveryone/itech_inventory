import conf from '../config/conf'
import { Client, Account } from "appwrite";

export class AuthService {
    private client: Client;
    private account: Account;

    constructor() {
        this.client = new Client();
        this.account = new Account(this.client);

        this.client
            .setEndpoint(conf.appWrtieUrl)
            .setProject(conf.appwriteProjectId);
    }

    // login
    async login({ email, password }: { email: string, password: string }): Promise<any> {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // get current user
    async getCurrentUser(): Promise<any> {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    // logout
    async logout(): Promise<void> {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
