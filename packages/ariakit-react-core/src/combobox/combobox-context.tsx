import { createContext } from "react";
import {
  CompositeContextProvider,
  CompositeScopedContextProvider,
} from "../composite/composite-context.tsx";
import {
  PopoverContextProvider,
  PopoverScopedContextProvider,
} from "../popover/popover-context.tsx";
import { createStoreContext } from "../utils/system.tsx";
import type { ComboboxStore } from "./combobox-store.ts";

export const ComboboxListRoleContext = createContext<string | undefined>(
  undefined,
);

const ctx = createStoreContext<ComboboxStore>(
  [PopoverContextProvider, CompositeContextProvider],
  [PopoverScopedContextProvider, CompositeScopedContextProvider],
);

/**
 * Returns the combobox store from the nearest combobox container.
 * @example
 * function Combobox() {
 *   const store = useComboboxContext();
 *
 *   if (!store) {
 *     throw new Error("Combobox must be wrapped in ComboboxProvider");
 *   }
 *
 *   // Use the store...
 * }
 */
export const useComboboxContext = ctx.useContext;

export const useComboboxScopedContext = ctx.useScopedContext;

export const useComboboxProviderContext = ctx.useProviderContext;

export const ComboboxContextProvider = ctx.ContextProvider;

export const ComboboxScopedContextProvider = ctx.ScopedContextProvider;

export const ComboboxItemValueContext = createContext<string | undefined>(
  undefined,
);

export const ComboboxItemCheckedContext = createContext(false);
