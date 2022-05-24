import {
  FormControlLabel,
  Button,
  TextField,
  Checkbox,
  Typography,
  Stack,
} from '@mui/material';
import { useState, useEffect } from 'react';
// import '../App.css';

interface FieldProp {
  header?: string;
  subheader?: string;
  resultPath?: string;
  buttonText?: string;
  buttonVisible: boolean;
  checkboxVisible: boolean;
  label: string;
  checkboxLabel?: string;
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
  checkboxHandler?(fieldName: string): void;
}

export const Field = ({
  header,
  subheader,
  resultPath,
  buttonText,
  buttonVisible,
  checkboxVisible,
  label,
  checkboxLabel,
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
  const [showTxtFileLoc, setShowTxtFileLoc] = useState(false);

  const changeHandler = (val: string) => {
    pathHandler ? pathHandler(val) : null;
    queryHandler ? queryHandler(val) : null;
    replaceTextHandler ? replaceTextHandler(val) : null;
  };

  useEffect(() => {
    // when the page first reloads since selecting a folder causes a page refresh
    pathHandler
      ? window.electron?.ipcRenderer.getPathOnce('path', (arg: string) => {
          if (arg) {
            pathHandler(arg);
            setFieldVal(arg);
            return;
          }
          pathHandler('');
          setFieldVal('');
          return;
        })
      : null;
  }, [fieldVal, pathHandler]);

  return (
    <Stack justifyContent="start" alignItems="center" direction="column">
      {header && (
        <Typography sx={{ fontWeight: 'bold' }} variant="caption">
          {header}
        </Typography>
      )}
      {subheader && (
        <Typography sx={{ fontWeight: 'bold' }} variant="caption">
          {subheader}
        </Typography>
      )}
      <Stack justifyContent="start" alignItems="center" direction="row">
        <TextField
          sx={{
            width: 300,
            height: 50,
          }}
          inputProps={{ style: { fontSize: 11 } }}
          InputLabelProps={{ style: { fontSize: 13 } }}
          required={isRequired ? true : false}
          variant="outlined"
          value={fieldVal}
          label={label}
          margin="dense"
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
          style={{ fontSize: '18px' }}
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
            <Typography sx={{ fontWeight: 'bold' }} variant="caption">
              {checkboxLabel}
            </Typography>
          }
          control={
            <Checkbox
              sx={{ transform: 'scale(.8)' }}
              defaultChecked={false}
              onChange={() =>
                checkboxHandler ? checkboxHandler(fieldName) : null
              }
            />
          }
          labelPlacement="start"
          disabled={disable}
        />
      )}
      {resultPath && showTxtFileLoc && (
        <Typography sx={{ fontWeight: 'bold' }} variant="caption">
          {resultPath}
        </Typography>
      )}
      {buttonVisible && (
        <Button
          size="small"
          sx={{
            marginX: 25,
            borderRadius: 16,
            backgroundColor: '#5B89FF',
          }}
          variant="contained"
          disabled={
            (fieldName === 'fourth' && disableExecute) || disable ? true : false
          }
          onClick={() => {
            if (fieldName === 'first') window.electron.ipcRenderer.getPath();
            createTxtFile ? createTxtFile(fieldVal) : null;
            createTxtFile ? setShowTxtFileLoc(true) : null;
            execHandler ? execHandler() : null;
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant="caption">
            {buttonText}
          </Typography>
        </Button>
      )}
    </Stack>
  );
};
