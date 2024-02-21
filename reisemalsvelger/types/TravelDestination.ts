import { BaseData } from "@/app/firebaseAPI";

export interface TravelDestination extends BaseData {
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}
