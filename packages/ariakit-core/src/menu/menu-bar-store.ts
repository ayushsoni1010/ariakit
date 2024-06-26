import type {
  MenubarStoreFunctions,
  MenubarStoreOptions,
  MenubarStoreState,
} from "../menubar/menubar-store.ts";
import { createMenubarStore } from "../menubar/menubar-store.ts";
import type { Store, StoreProps } from "../utils/store.ts";

/**
 * Creates a menu bar store.
 */
export function createMenuBarStore(
  props: MenuBarStoreProps = {},
): MenuBarStore {
  return createMenubarStore(props);
}

export interface MenuBarStoreState extends MenubarStoreState {}

export interface MenuBarStoreFunctions extends MenubarStoreFunctions {}

export interface MenuBarStoreOptions extends MenubarStoreOptions {}

export interface MenuBarStoreProps
  extends MenuBarStoreOptions,
    StoreProps<MenuBarStoreState> {}

export interface MenuBarStore
  extends MenuBarStoreFunctions,
    Store<MenuBarStoreState> {}
