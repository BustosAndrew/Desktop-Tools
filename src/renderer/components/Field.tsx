import { Button } from '@mui/material/';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material/';
import { useState, useEffect } from 'react';
import '../App.css';

interface FieldProp {
  header?: string;
  resultPath?: string;
  buttonText?: string;
  buttonVisible: Boolean;
  label: string;
  value: string;
  fieldName: string;
  isRequired: Boolean;
  disable: Boolean;
  disableExecute?: Boolean;
  disableHandler(fieldName: string, disable: boolean): void;
  pathHandler?(folderPath: string): void;
}

export const Field = ({
  header,
  resultPath,
  buttonText,
  buttonVisible,
  label,
  value,
  isRequired,
  disable,
  fieldName,
  disableExecute,
  disableHandler,
  pathHandler,
}: FieldProp) => {
  const [fieldVal, setFieldVal] = useState(value);

  const changeHandler = (val: string) => {
    if (fieldName == 'first') pathHandler ? pathHandler(val) : null;

    if (fieldName === 'third' && val === '') {
      disableHandler('fourth', true);
    }
    if (fieldName === 'third' && val !== '') {
      disableHandler('fourth', false);
    }
  };

  useEffect(() => {
    // when the page first loads or when fieldVal changes
    if (fieldName === 'first' && fieldVal !== '') {
      disableHandler('second', false);
    } else if (fieldName === 'first' && fieldVal === '') {
      disableHandler('second', true);
    }
    if (fieldName === 'second' && fieldVal === '') {
      setFieldVal('report.txt');
    }
  }, [fieldVal]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}
      direction="column"
    >
      {header && (
        <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">
          {header}
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
          onClick={() => !disable && setFieldVal('')}
        >
          <b>{!(fieldName === 'second') ? '✖' : '↺'}</b>
        </span>
      </Stack>
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
