export interface FamousPerson {
  name: string;
  description: string;
  imageUrl?: string | null;
}

export interface Friend {
  name: string;
  photo: string | null;
}

export type Theme = 'sunset' | 'ocean' | 'galaxy';
export type Font = 'poppins' | 'pacifico' | 'anton';

export interface PostData {
  friend: Friend;
  famous: FamousPerson[];
  date: Date;
  theme: Theme;
  font: Font;
}