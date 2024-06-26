import * as Ariakit from "@ariakit/react";
import * as React from "react";

export type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  animated?: boolean;
  open?: boolean;
  backdrop?: boolean;
  onClose?: () => void;
  onUnmount?: () => void;
  initialFocus?: Ariakit.DialogProps["initialFocus"];
  finalFocus?: Ariakit.DialogProps["finalFocus"];
  autoFocusOnHide?: Ariakit.DialogProps["autoFocusOnHide"];
};

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ title, animated, open, onClose, onUnmount, ...props }, ref) => {
    const dialog = Ariakit.useDialogStore({
      animated,
      open,
      setOpen(open) {
        if (!open) {
          onClose?.();
        }
      },
      setMounted(mounted) {
        if (!mounted) {
          onUnmount?.();
        }
      },
    });
    return (
      <Ariakit.Dialog
        store={dialog}
        ref={ref}
        data-animated={animated ? "" : undefined}
        className="dialog"
        {...props}
      >
        <header className="header">
          <Ariakit.DialogHeading className="heading">
            {title}
          </Ariakit.DialogHeading>
          <Ariakit.DialogDismiss className="button secondary dismiss" />
        </header>
        {props.children}
      </Ariakit.Dialog>
    );
  },
);
