import { Checkbox, useCheckboxStore } from "@ariakit/react";
import "./style.css";

export default function Example() {
  const checked = useCheckboxStore({ defaultValue: true });
  return (
    <label className="label">
      <Checkbox className="checkbox" store={checked} /> I have read and agree to
      the terms and conditions
    </label>
  );
}
