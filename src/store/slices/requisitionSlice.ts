import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "./cartSlice";

export type RequisitionStatus =
  | "submitted"
  | "awaiting_approval"
  | "approved"
  | "delivered"
  | "rejected";

export interface Requisition {
  id: string;
  orderNumber: string;
  title: string;
  status: RequisitionStatus;
  statusLabel: string;
  waitingOn: string;
  totalAmount: number;
  currency: string;
  submittedAt: string;
  estimatedDelivery?: string;
  department: string;
  items: CartItem[];
  progressStage: 1 | 2 | 3 | 4;
}

export interface RequisitionState {
  requisitions: Requisition[];
  activeRequisitionId: string | null;
}

const initialState: RequisitionState = {
  requisitions: [
    {
      id: "req-101",
      orderNumber: "REQ-2026-0849",
      title: "Ergonomic office chair, premium",
      status: "awaiting_approval",
      statusLabel: "Awaiting approval",
      waitingOn: "Marcus Vance (Operations Director)",
      totalAmount: 185.0,
      currency: "£",
      submittedAt: "Today, 09:42",
      estimatedDelivery: "2-3 working days",
      department: "Operations",
      progressStage: 2,
      items: [
        {
          product: {
            id: "ord-chair-1",
            name: "Ergonomic office chair, premium",
            category: "Furniture",
            packageInfo: "Single Unit",
            supplier: "Canal Office Supplies",
            price: 185.0,
            currency: "£",
            inStock: true,
          },
          quantity: 1,
        },
      ],
    },
    {
      id: "req-102",
      orderNumber: "REQ-2026-0812",
      title: "A4 copier paper & Ballpoint Pens",
      status: "approved",
      statusLabel: "Approved",
      waitingOn: "Dispatched to Canal Office Supplies",
      totalAmount: 59.48,
      currency: "£",
      submittedAt: "Yesterday, 14:15",
      estimatedDelivery: "Tomorrow",
      department: "Operations",
      progressStage: 3,
      items: [
        {
          product: {
            id: "ord-1",
            name: "A4 copier paper, 80gsm",
            category: "Stationery",
            packageInfo: "Pack of 5 reams",
            supplier: "Canal Office Supplies",
            price: 10.5,
            currency: "£",
            inStock: true,
          },
          quantity: 4,
        },
      ],
    },
    {
      id: "req-103",
      orderNumber: "REQ-2026-0775",
      title: "Heavy Duty Packaging Tape (Box of 36)",
      status: "delivered",
      statusLabel: "Delivered",
      waitingOn: "Completed",
      totalAmount: 51.0,
      currency: "£",
      submittedAt: "24 Oct 2026",
      estimatedDelivery: "Delivered 26 Oct",
      department: "Warehouse",
      progressStage: 4,
      items: [],
    },
  ],
  activeRequisitionId: "req-101",
};

export const requisitionSlice = createSlice({
  name: "requisitions",
  initialState,
  reducers: {
    createRequisition: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        department: string;
        notes?: string;
      }>,
    ) => {
      const { items, department } = action.payload;
      const count = state.requisitions.length + 850;
      const orderNumber = `REQ-2026-${String(count).padStart(4, "0")}`;
      const totalAmount = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
      const firstItemName = items[0]?.product.name ?? "Procurement Batch";
      const title =
        items.length > 1
          ? `${firstItemName} + ${items.length - 1} more items`
          : firstItemName;

      const newReq: Requisition = {
        id: `req-${Date.now()}`,
        orderNumber,
        title,
        status: "awaiting_approval",
        statusLabel: "Awaiting approval",
        waitingOn: "Marcus Vance (Operations Director)",
        totalAmount: Number(totalAmount.toFixed(2)),
        currency: "£",
        submittedAt: "Just now",
        estimatedDelivery: "2-3 working days",
        department,
        progressStage: 2,
        items,
      };

      state.requisitions.unshift(newReq);
      state.activeRequisitionId = newReq.id;
    },
    setActiveRequisition: (state, action: PayloadAction<string>) => {
      state.activeRequisitionId = action.payload;
    },
  },
});

export const { createRequisition, setActiveRequisition } =
  requisitionSlice.actions;

export default requisitionSlice.reducer;

