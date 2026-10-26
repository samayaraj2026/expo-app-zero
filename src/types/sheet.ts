import type BottomSheet from "@gorhom/bottom-sheet";
import type React from "react";

export type SignInStep =
  "email" | "otp" | "setPassword" | "signingIn" | "expiredInvite";

export interface SignInBottomSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
}

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapHeight?: number;
}

export interface SignInSheetProps {
  visible: boolean;
  onClose: () => void;
}
