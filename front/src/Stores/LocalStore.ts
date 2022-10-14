
const authTokenKey = "authToken";

class LocalStore {

    private authToken: string | null = null;

    setAuthToken(value: string | null) {
        value ? localStorage.setItem(authTokenKey, value) : localStorage.removeItem(authTokenKey);
    }
    getAuthToken(): string | null {
        return this.authToken? this.authToken: this.authToken = localStorage.getItem(authTokenKey);
    }

}

export const localStore = new LocalStore();