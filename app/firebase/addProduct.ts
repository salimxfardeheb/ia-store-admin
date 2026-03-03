import { Product } from "../variables";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function addProduct(prod: Product) {
  try {
    await addDoc(collection(db, "products"), prod);
  } catch (e) {
    console.error("error : ", e);
  }
}
