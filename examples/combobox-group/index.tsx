import groupBy from "lodash-es/groupBy.js";
import { matchSorter } from "match-sorter";
import * as React from "react";
import {
  Combobox,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSeparator,
} from "./combobox.tsx";
import food from "./food.ts";
import "./style.css";

export default function Example() {
  const [value, setValue] = React.useState("");
  const deferredValue = React.useDeferredValue(value);

  const matches = React.useMemo(() => {
    const items = matchSorter(food, deferredValue, { keys: ["name"] });
    return Object.entries(groupBy(items, "type"));
  }, [deferredValue]);

  return (
    <label className="label">
      Your favorite food
      <Combobox
        autoSelect
        autoComplete="both"
        placeholder="e.g., Apple"
        value={value}
        onChange={setValue}
      >
        {matches.length ? (
          matches.map(([type, items], i) => (
            <React.Fragment key={type}>
              <ComboboxGroup label={type}>
                {items.map((item) => (
                  <ComboboxItem key={item.name} value={item.name} />
                ))}
              </ComboboxGroup>
              {i < matches.length - 1 && <ComboboxSeparator />}
            </React.Fragment>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </Combobox>
    </label>
  );
}
