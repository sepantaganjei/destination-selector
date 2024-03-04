import { BaseData } from "@/app/firebaseAPI";

export interface Review extends BaseData {
  name: string;
  description: string;
  rating: number;
  destinationId: string;
}
