export interface PostInterface {
    id: number;
    author: string;
    content: string;
    createdDate: string | null;
    lastModifiedDate: string | null;
    likes: number;
    resourceUrls: string | null;
    user: {
      pictureProfile: string;
    };
  }
  