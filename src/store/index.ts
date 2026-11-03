import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import cartReducer from "./slices/cartSlice";
import requisitionReducer from "./slices/requisitionSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    requisitions: requisitionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectCartItems = (state: RootState) =>
  Object.values(state.cart.items);
export const selectCartTotalCount = (state: RootState) => state.cart.totalCount;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
export const selectCartVat = (state: RootState) =>
  Number((state.cart.subtotal * state.cart.vatRate).toFixed(2));
export const selectCartTotal = (state: RootState) =>
  Number((state.cart.subtotal * (1 + state.cart.vatRate)).toFixed(2));
export const selectCartItemQuantity = (productId: string) => (state: RootState) =>
  state.cart.items[productId]?.quantity ?? 0;

export const selectRequisitions = (state: RootState) =>
  state.requisitions.requisitions;
export const selectActiveRequisition = (state: RootState) =>
  state.requisitions.requisitions.find(
    (r) => r.id === state.requisitions.activeRequisitionId,
  ) ?? state.requisitions.requisitions[0];

export const selectUserProfile = (state: RootState) => state.user.profile;

