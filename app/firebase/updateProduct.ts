// firebase/updateProduct.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Product } from "../variables";

export async function updateProduct(product: Product, productId : string): Promise<void> {
  try {
    await setDoc(doc(db, "products", productId), product);
  } catch (e) {
    console.error("Erreur Firebase :", e);
    throw e;
  }
}