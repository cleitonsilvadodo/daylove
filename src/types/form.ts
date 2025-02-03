export type AnimationType = "none" | "hearts" | "aurora" | "stars-meteors";

export type MusicType = "file" | "youtube" | "spotify" | "";

export interface FormData {
  currentStep: number;
  title: string;
  startDate: string;
  dateDisplayMode: string;
  message: string;
  photos: string[];
  music: {
    type: MusicType;
    url: string;
    title: string;
  };
  animation: AnimationType;
  plan?: {
    type: "forever" | "annual";
    price: number;
  };
  payment_id?: string;
  user_email?: string;
  name?: string;
  email?: string;
  document?: string;
}

export const initialFormData: FormData = {
  currentStep: 1,
  title: "",
  startDate: "",
  dateDisplayMode: "padrao",
  message: "",
  photos: [],
  music: {
    type: "",
    url: "",
    title: "",
  },
  animation: "hearts",
};
