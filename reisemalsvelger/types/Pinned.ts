import { BaseData } from "@/app/firebaseAPI";

export interface Pinned extends BaseData {
  destinationId: string;
  destinationName: string;
}
