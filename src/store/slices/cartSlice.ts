import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/catalogue";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: Record<string, CartItem>;
  totalCount: number;
  subtotal: number;
  vatRate: number;
}

const initialState: CartState = {
  items: {
    "ord-1": {
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
      quantity: 1,
    },
  },
  totalCount: 1,
  subtotal: 10.5,
  vatRate: 0.2,
};

function recalculateTotals(state: CartState) {
  let count = 0;
  let subtotal = 0;
  for (const item of Object.values(state.items)) {
    count += item.quantity;
    subtotal += item.product.price * item.quantity;
  }
  state.totalCount = count;
  state.subtotal = Number(subtotal.toFixed(2));
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setQuantity: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const { product, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.items[product.id];
      } else {
        state.items[product.id] = { product, quantity };
      }
      recalculateTotals(state);
    },
    incrementItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const current = state.items[product.id]?.quantity ?? 0;
      state.items[product.id] = { product, quantity: current + 1 };
      recalculateTotals(state);
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existing = state.items[productId];
      if (!existing) return;
      if (existing.quantity <= 1) {
        delete state.items[productId];
      } else {
        existing.quantity -= 1;
      }
      recalculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.items = {};
      state.totalCount = 0;
      state.subtotal = 0;
    },
  },
});

export const {
  setQuantity,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

