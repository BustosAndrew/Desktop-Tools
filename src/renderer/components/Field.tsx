import { Button } from '@mui/material/';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Checkbox } from '@mui/material';
import { TextField } from '@mui/material/';
import { FormControlLabel } from '@mui/material/';
import { useState, useEffect } from 'react';
import '../App.css';

interface FieldProp {
  header?: string;
  subheader?: string;
  resultPath?: string;
  buttonText?: string;
  buttonVisible: boolean;
  checkboxVisible: boolean;
  label: string;
  value: string;
  fieldName: string;
  isRequired: boolean;
  disable: boolean;
  disableExecute?: boolean;
  pathHandler?(folderPath: string): void;
  queryHandler?(query: string): void;
  replaceTextHandler?(text: string): void;
  execHandler?(): void;
  createTxtFile?(filename: string): void;
  checkboxHandler?(): void;
}

export const Field = ({
  header,
  subheader,
  resultPath,
  buttonText,
  buttonVisible,
  checkboxVisible,
  label,
  value,
  isRequired,
  disable,
  fieldName,
  disableExecute,
  pathHandler,
  queryHandler,
  execHandler,
  replaceTextHandler,
  createTxtFile,
  checkboxHandler,
}: FieldProp) => {
  const [fieldVal, setFieldVal] = useState(value);

  const changeHandler = (val: string) => {
    pathHandler ? pathHandler(val) : null;
    queryHandler ? queryHandler(val) : null;
    replaceTextHandler ? replaceTextHandler(val) : null;
  };

  useEffect(() => {
    // when the page first reloads since selecting a folder causes a page refresh
    pathHandler
      ? window.electron.ipcRenderer.getPathOnce('path', (arg: string) => {
          pathHandler(arg);
          setFieldVal(arg);
        })
      : null;
  });

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={1.5}
      direction="column"
    >
      {header && (
        <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">
          {header}
        </Typography>
      )}
      {subheader && (
        <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">
          {subheader}
        </Typography>
      )}
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        direction="row"
      >
        <TextField
          sx={{
            width: 600,
          }}
          required={isRequired ? true : false}
          variant="outlined"
          value={fieldVal}
          label={label}
          margin={!header ? 'normal' : 'none'}
          disabled={disable ? true : false}
          onChange={(event) => {
            setFieldVal(event.target.value);
            changeHandler(event.target.value);
          }}
          onBlur={() => {
            if (fieldName === 'second')
              fieldVal
                ? fieldVal.indexOf('.txt') === -1
                  ? setFieldVal(fieldVal + '.txt')
                  : setFieldVal(fieldVal)
                : setFieldVal('report.txt');
          }}
        />
        <span
          className={disable ? 'clear-disabled' : 'clear'}
          onClick={() => {
            !disable && setFieldVal('') && changeHandler('');
            createTxtFile ? setFieldVal('report.txt') : null;
            pathHandler ? pathHandler('') : null;
            queryHandler ? queryHandler('') : null;
            replaceTextHandler ? replaceTextHandler('') : null;
          }}
        >
          <b>{!(fieldName === 'second') ? '✖' : '↺'}</b>
        </span>
      </Stack>
      {checkboxVisible && (
        <FormControlLabel
          label={
            <Typography sx={{ fontWeight: 'bold' }}>
              Do you want to replace/delete all occurrences?
            </Typography>
          }
          control={
            <Checkbox
              defaultChecked={false}
              onChange={() => (checkboxHandler ? checkboxHandler() : null)}
            />
          }
          labelPlacement="start"
        />
      )}
      {buttonVisible && (
        <Button
          size="medium"
          sx={{
            marginX: 25,
            borderRadius: 16,
            paddingX: 1.5,
            backgroundColor: '#5B89FF',
          }}
          variant="contained"
          disabled={
            (fieldName === 'fourth' && disableExecute) || disable ? true : false
          }
          onClick={() => {
            if (fieldName === 'first') window.electron.ipcRenderer.getPath();
            createTxtFile ? createTxtFile(fieldVal) : null;
            execHandler ? execHandler() : null;
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant="button">
            {buttonText}
          </Typography>
        </Button>
      )}
      {resultPath && (
        <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">
          {resultPath}
        </Typography>
      )}
    </Stack>
  );
};
