export interface AuthData {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullname: string;
  };
}
