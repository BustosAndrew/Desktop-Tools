import { Field } from './Field';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

export const Render = () => {
  const [fieldsDisabled, setFieldDisabled] = useState<any>({
    first: false,
    second: true,
    third: false,
    fourth: true,
  });
  const [path, setPath] = useState('Path/to/folder');
  const [disableExecute, setDisableExecute] = useState(true);

  const disableHandler = (fieldName: string, disable: boolean): void => {
    setFieldDisabled({
      ...fieldsDisabled,
      [fieldName]: disable,
    });
  };

  const pathHandler = (folderPath: string): void => {
    setPath(folderPath);
    console.log(path);
  };

  useEffect(() => {
    if (!path) {
      setDisableExecute(true);
    } else setDisableExecute(false);
    console.log(disableExecute);
  }, [path, disableExecute]);

  return (
    <Box marginY={15}>
      <Field
        label="Path/to/folder"
        value="Path/to/folder"
        buttonText="SELECT A FOLDER"
        buttonVisible={true}
        isRequired={true}
        disable={fieldsDisabled['first']}
        fieldName="first"
        disableHandler={disableHandler}
        pathHandler={pathHandler}
      />
      <br />
      <Field
        label="Enter txt file name"
        value="report.txt"
        header="Enter a name for the txt file to be generated:"
        resultPath="Text file install location:"
        buttonText="GENERATE"
        buttonVisible={true}
        isRequired={false}
        disable={fieldsDisabled['second']}
        fieldName="second"
        disableHandler={disableHandler}
      />
      <br />
      <Field
        label="Enter characters to search for (i.e , or abc)"
        value=""
        header="Enter characters to replace/remove in the filename(s):"
        buttonVisible={false}
        isRequired={true}
        disable={fieldsDisabled['third']}
        fieldName="third"
        disableHandler={disableHandler}
      />
      <br />
      <Field
        label="Enter characters to replace with (leave blank to delete)"
        value=""
        header="Enter the character(s) you want to replace with:"
        buttonText="EXECUTE"
        buttonVisible={true}
        isRequired={true}
        disable={fieldsDisabled['fourth']}
        disableExecute={disableExecute}
        fieldName="fourth"
        disableHandler={disableHandler}
      />
      <Typography
        sx={{ fontWeight: 'bold', marginX: 'auto', textAlign: 'center' }}
        mt={2}
        variant="subtitle1"
      >
        Result:
      </Typography>
      <Typography
        sx={{ fontWeight: 'bold', marginX: 'auto', textAlign: 'center' }}
        mt={2}
        variant="subtitle1"
      >
        Number of filenames changed:
      </Typography>
    </Box>
  );
};
