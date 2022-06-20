import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { Typography, Stack } from '@mui/material';
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

interface CheckboxesProps {
  extensionsHandler(values: string[]): void;
}

export const CheckboxesDropdown = ({ extensionsHandler }: CheckboxesProps) => {
  return (
    <Autocomplete
      sx={{ m: 'auto', width: 335 }}
      multiple
      options={extensions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.extension}
      ListboxProps={{ style: { fontSize: 13 } }}
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
      onChange={(event, value) => {
        const values: string[] = [];
        value.forEach((ext) => {
          values.push(ext.extension);
        });
        console.log(values);
        extensionsHandler(values);
      }}
      renderInput={(params) => (
        <Stack
          marginTop={2}
          justifyContent="center"
          alignContent="center"
          direction="column"
        >
          <Typography
            sx={{ fontWeight: 'bold', marginBottom: 1 }}
            variant="caption"
            textAlign="center"
          >
            Enter/select a file extension to filter for (optional):
          </Typography>
          <TextField
            {...params}
            sx={{
              '& input::placeholder': { fontSize: 11 },
              '& label': { fontSize: 13, color: 'gray' },
              '& input': { fontSize: 11, color: 'gray' },
            }}
            label="File Extensions"
            placeholder=".xlsx, .pdf, .docx, .jpg"
          />
        </Stack>
      )}
    />
  );
};
