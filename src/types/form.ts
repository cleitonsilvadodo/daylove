export interface FormData {
  currentStep: number;
  title: string;
  startDate: string;
  dateDisplayMode: string;
  message: string;
  photos: string[];
  music: {
    url: string;
    title: string;
  };
  animation: string;
  plan?: {
    type: "forever" | "annual";
    price: number;
  };
  payment_id?: string;
  user_email?: string;
}

export const initialFormData: FormData = {
  currentStep: 1,
  title: "",
  startDate: "",
  dateDisplayMode: "padrao",
  message: "",
  photos: [],
  music: {
    url: "",
    title: "",
  },
  animation: "hearts",
};
