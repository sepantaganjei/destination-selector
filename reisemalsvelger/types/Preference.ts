import { BaseData } from "@/app/firebaseAPI";

export interface Preference extends BaseData {
  uid: string;
  tag: string[];
}
