import { Product } from "../variables";

import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (e) {
    console.error("error : ", e);
  }
}
