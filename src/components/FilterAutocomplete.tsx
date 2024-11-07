import { TextField, Autocomplete } from '@mui/material';

interface FilterAutocompleteProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: string[];
  label: string;
  placeholder?: string;
  freeSolo?: boolean;
}

export function FilterAutocomplete({
  value,
  onChange,
  options,
  label,
  placeholder,
  freeSolo = false
}: FilterAutocompleteProps) {
  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={options}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={label}
          placeholder={placeholder}
        />
      )}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option || ''}
    />
  );
}