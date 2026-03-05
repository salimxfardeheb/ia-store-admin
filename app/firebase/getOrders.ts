import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Order, OrderStatus } from "../variables";

export async function getOrders() {
  try {
    const req = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const reqSnapshot = await getDocs(req);
    return reqSnapshot.docs.map((doc) => {
      const data = doc.data();
      const order: Order = {
        id: doc.id,
        form: {
          uid: data.form.uid,
          email: data.form.email,
          name: data.form.name,
          phone: data.form.phone,
          city: data.form.city,
          address: data.form.address,
          postalCode: data.form.postalCode,
          paymentMethod: data.form.paymentMethod,
          deliveryType: data.form.deliveryType,
        },
        items: data.items,
        total: data.total,
        status: data.status as OrderStatus,
        createdAt: data.createdAt,
      };
      return order;
    });
  } catch (e) {
    console.error("error database :", e);
    return [];
  }
}

export async function updateOrder(id: string, status: OrderStatus) {
  try {
    await updateDoc(doc(db, "orders", id), { status });
  } catch (e) {
    console.error("error database :", e);
  }
}
