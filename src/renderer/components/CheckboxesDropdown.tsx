import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const extensions = [
  { extension: '.xlsx' },
  { extension: '.docx' },
  { extension: '.pdf' },
  { extension: '.jpg' },
  { extension: '.png' },
  { extension: '.txt' },
  { extension: '.wmv' },
  { extension: '.mp3' },
  { extension: '.mp4' },
  { extension: '.wav' },
  { extension: '.webm' },
  { extension: '.gif' },
];

export const CheckboxesDropdown = () => {
  return (
    <Autocomplete
      multiple
      options={extensions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.extension}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.extension}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="File Extensions"
          placeholder=".xlsx, .pdf, .docx, .jpg"
        />
      )}
    />
  );
};
