export interface DropdownItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
  disabledMsg?: string;
}
