import { Menu, MenuItem } from "./menu.tsx";
import "./style.css";

export default function Example() {
  return (
    <Menu label="Edit">
      <MenuItem>Undo</MenuItem>
      <MenuItem>Redo</MenuItem>
      <Menu label="Find">
        <MenuItem>Search the Web...</MenuItem>
        <MenuItem>Find...</MenuItem>
        <MenuItem>Find Next</MenuItem>
        <MenuItem>Find Previous</MenuItem>
      </Menu>
      <Menu label="Speech">
        <MenuItem>Start Speaking</MenuItem>
        <MenuItem disabled>Stop Speaking</MenuItem>
      </Menu>
    </Menu>
  );
}
