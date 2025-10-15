export interface IUndeadUser {
  id?: string;
  walletAddress: string;
  profileName: string;
  choosenGuide: string;
  avatar: string;
  userProgress: {
    chapter: number;
    path: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
