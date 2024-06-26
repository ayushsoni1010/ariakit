import type { StringLike } from "@ariakit/core/form/types";
import { getDocument } from "@ariakit/core/utils/dom";
import { cx, invariant } from "@ariakit/core/utils/misc";
import type { BooleanOrCallback } from "@ariakit/core/utils/types";
import type { ElementType, FocusEvent, RefObject } from "react";
import { useCallback, useRef } from "react";
import type { CollectionItemOptions } from "../collection/collection-item.tsx";
import { useCollectionItem } from "../collection/collection-item.tsx";
import {
  useBooleanEvent,
  useEvent,
  useId,
  useMergeRefs,
} from "../utils/hooks.ts";
import {
  createElement,
  createHook,
  forwardRef,
  memo,
} from "../utils/system.tsx";
import type { Props } from "../utils/types.ts";
import { useFormContext } from "./form-context.tsx";
import type { FormStore } from "./form-store.ts";

const TagName = "input" satisfies ElementType;
type TagName = typeof TagName;
type HTMLType = HTMLElementTagNameMap[TagName];
type ItemType = "label" | "error" | "description";

function getNamedElement(ref: RefObject<HTMLInputElement>, name: string) {
  const element = ref.current;
  if (!element) return null;
  if (element.name === name) return element;
  if (element.form) {
    return element.form.elements.namedItem(name) as HTMLInputElement | null;
  }
  const document = getDocument(element);
  return document.getElementsByName(name)[0] as HTMLInputElement | null;
}

function useItem(store: FormStore, name: string, type: ItemType) {
  return store.useState((state) =>
    state.items.find((item) => item.type === type && item.name === name),
  );
}

/**
 * Returns props to create a `FormControl` component. Unlike `useFormInput`,
 * this hook doesn't automatically returns the `value` and `onChange` props.
 * This is so we can use it not only for native form elements but also for
 * custom components whose value is not controlled by the native `value` and
 * `onChange` props.
 * @see https://ariakit.org/components/form
 * @example
 * ```jsx
 * const store = useFormStore({ defaultValues: { content: "" } });
 * const props = useFormControl({ store, name: store.names.content });
 * const value = store.useValue(store.names.content);
 *
 * <Form store={store}>
 *   <FormLabel name={store.names.content}>Content</FormLabel>
 *   <Role
 *     {...props}
 *     value={value}
 *     onChange={(value) => store.setValue(store.names.content, value)}
 *     render={<Editor />}
 *   />
 * </Form>
 * ```
 */
export const useFormControl = createHook<TagName, FormControlOptions>(
  function useFormControl({
    store,
    name: nameProp,
    getItem: getItemProp,
    touchOnBlur = true,
    ...props
  }) {
    const context = useFormContext();
    store = store || context;

    invariant(
      store,
      process.env.NODE_ENV !== "production" &&
        "FormControl must be wrapped in a Form component.",
    );

    const name = `${nameProp}`;
    const id = useId(props.id);
    const ref = useRef<HTMLType>(null);

    store.useValidate(async () => {
      const element = getNamedElement(ref, name);
      if (!element) return;
      // Flush microtasks to make sure the validity state is up to date
      await Promise.resolve();
      if ("validity" in element && !element.validity.valid) {
        store?.setError(name, element.validationMessage);
      }
    });

    const getItem = useCallback<NonNullable<CollectionItemOptions["getItem"]>>(
      (item) => {
        const nextItem = { ...item, id: id || item.id, name, type: "field" };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, name, getItemProp],
    );

    const onBlurProp = props.onBlur;
    const touchOnBlurProp = useBooleanEvent(touchOnBlur);

    const onBlur = useEvent((event: FocusEvent<HTMLType>) => {
      onBlurProp?.(event);
      if (event.defaultPrevented) return;
      if (!touchOnBlurProp(event)) return;
      store?.setFieldTouched(name, true);
    });

    const label = useItem(store, name, "label");
    const error = useItem(store, name, "error");
    const description = useItem(store, name, "description");
    const describedBy = cx(
      error?.id,
      description?.id,
      props["aria-describedby"],
    );

    const invalid = store.useState(
      () => !!store?.getError(name) && store.getFieldTouched(name),
    );

    props = {
      id,
      "aria-labelledby": label?.id,
      "aria-invalid": invalid,
      ...props,
      "aria-describedby": describedBy || undefined,
      ref: useMergeRefs(ref, props.ref),
      onBlur,
    };

    props = useCollectionItem<TagName>({ store, ...props, name, getItem });

    return props;
  },
);

/**
 * Abstract component that renders a form control. Unlike
 * [`FormInput`](https://ariakit.org/reference/form-input), this component
 * doesn't automatically pass the `value` and `onChange` props down to the
 * underlying element. This is so we can use it not only for native form
 * elements but also for custom components whose value is not controlled by the
 * native `value` and `onChange` props.
 * @see https://ariakit.org/components/form
 * @example
 * ```jsx {11-19}
 * const form = useFormStore({
 *   defaultValues: {
 *     content: "",
 *   },
 * });
 *
 * const value = form.useValue(form.names.content);
 *
 * <Form store={form}>
 *   <FormLabel name={form.names.content}>Content</FormLabel>
 *   <FormControl
 *     name={form.names.content}
 *     render={
 *       <Editor
 *         value={value}
 *         onChange={(value) => form.setValue(form.names.content, value)}
 *       />
 *     }
 *   />
 * </Form>
 * ```
 */
export const FormControl = memo(
  forwardRef(function FormControl(props: FormControlProps) {
    const htmlProps = useFormControl(props);
    return createElement(TagName, htmlProps);
  }),
);

export interface FormControlOptions<T extends ElementType = TagName>
  extends CollectionItemOptions<T> {
  /**
   * Object returned by the
   * [`useFormStore`](https://ariakit.org/reference/use-form-store) hook. If not
   * provided, the closest [`Form`](https://ariakit.org/reference/form) or
   * [`FormProvider`](https://ariakit.org/reference/form-provider) components'
   * context will be used.
   */
  store?: FormStore;
  /**
   * Field name. This can either be a string corresponding to an existing
   * property name in the
   * [`values`](https://ariakit.org/reference/use-form-store#values) state of
   * the store, or a reference to a field name from the
   * [`names`](https://ariakit.org/reference/use-form-store#names) object in the
   * store, ensuring type safety.
   *
   * Live examples:
   * - [FormRadio](https://ariakit.org/examples/form-radio)
   * - [Form with Select](https://ariakit.org/examples/form-select)
   */
  name: StringLike;
  /**
   * Whether the field should be marked touched on blur.
   * @default true
   */
  touchOnBlur?: BooleanOrCallback<FocusEvent>;
}

export type FormControlProps<T extends ElementType = TagName> = Props<
  T,
  FormControlOptions<T>
>;
