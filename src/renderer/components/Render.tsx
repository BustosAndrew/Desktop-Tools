import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Field } from './Field';

export const Render = () => {
  const [fieldsDisabled, setFieldDisabled] = useState<any>({
    first: false,
    second: true,
    third: true,
    fourth: true,
  });
  const [path, setPath] = useState('');
  const [disableExecute, setDisableExecute] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [results, setResults] = useState<any>({ status: '', numChanged: '' });
  const [txtFileLoc, setTxtFileLoc] = useState('');
  const [replaceAll, setReplaceAll] = useState(false);

  const pathHandler = (folderPath: string): void => {
    setPath(folderPath);
    // console.log(folderPath);
  };

  const queryHandler = (query: string): void => {
    setSearchQuery(query);
    // console.log(query);
  };

  const replaceTextHandler = (text: string) => {
    setReplaceText(text);
  };

  const execHandler = () => {
    window.electron.ipcRenderer
      .changeFilenames([path, searchQuery, replaceText, replaceAll])
      .then((result: any) =>
        setResults({
          status: result.status,
          numChanged: result.numChanged,
        })
      )
      .catch(() => {});
    // console.log(replaceAll);
  };

  const checkboxHandler = () => {
    // console.log(replaceAll);
    setReplaceAll(!replaceAll);
  };

  const createTxtFile = (filename: string) => {
    window.electron.ipcRenderer
      .generateTxtFile([path, filename])
      .then((result: string) => setTxtFileLoc(result))
      .catch(() => {});
  };

  // when the page first loads or when searchQuery/path changes
  useEffect(() => {
    if (!searchQuery) {
      setDisableExecute(true);
      setFieldDisabled({
        fourth: true,
      });
    } else if (searchQuery) {
      setDisableExecute(false);
      setFieldDisabled({
        fourth: false,
      });
    }

    if (!path) {
      setDisableExecute(true);
      setFieldDisabled({
        second: true,
        third: true,
        fourth: true,
      });
    } else {
      window.electron.ipcRenderer
        .isValidPath(path)
        .then((result: string) => {
          if (result === 'Invalid folder path!') {
            setFieldDisabled({
              second: true,
              third: true,
              fourth: true,
            });
            return;
          }
          setFieldDisabled({
            second: false,
            third: false,
          });

          if (!searchQuery) {
            setFieldDisabled({ fourth: true });
            setDisableExecute(true);
          }

          return;
        })
        .catch(() => {});
    }
  }, [path, searchQuery]);

  return (
    <Box marginY={15}>
      <Field
        label="Path\to\folder"
        value={path}
        buttonText="SELECT A FOLDER"
        buttonVisible={true}
        checkboxVisible={false}
        isRequired={true}
        disable={fieldsDisabled.first}
        fieldName="first"
        pathHandler={pathHandler}
      />
      <br />
      <Field
        label="Enter txt file name"
        value="report.txt"
        header="Enter a name for the txt file to be created in the app's logs folder (optional)"
        subheader="This will show a preview of all the filenames present in the folder and its subfolders:"
        resultPath={'Text file install location: ' + txtFileLoc}
        buttonText="GENERATE"
        buttonVisible={true}
        checkboxVisible={false}
        isRequired={false}
        disable={fieldsDisabled.second}
        fieldName="second"
        createTxtFile={createTxtFile}
      />
      <br />
      <Field
        label="Enter characters to search for (i.e , or abc)"
        value=""
        header="Enter characters to replace/remove in the filename(s):"
        buttonVisible={false}
        checkboxVisible={false}
        isRequired={true}
        disable={fieldsDisabled.third}
        fieldName="third"
        queryHandler={queryHandler}
      />
      <br />
      <Field
        label="Enter characters to replace with (leave blank to delete)"
        value=""
        header="Enter the character(s) you want to replace with:"
        buttonText="EXECUTE"
        buttonVisible={true}
        checkboxVisible={true}
        isRequired={true}
        disable={fieldsDisabled.fourth}
        disableExecute={disableExecute}
        fieldName="fourth"
        replaceTextHandler={replaceTextHandler}
        execHandler={execHandler}
        checkboxHandler={checkboxHandler}
      />
      <Typography
        sx={{ fontWeight: 'bold', marginX: 'auto', textAlign: 'center' }}
        mt={2}
        variant="subtitle1"
      >
        Result: {results.status}
      </Typography>
      <Typography
        sx={{ fontWeight: 'bold', marginX: 'auto', textAlign: 'center' }}
        mt={2}
        variant="subtitle1"
      >
        Number of filenames changed: {results.numChanged}
      </Typography>
    </Box>
  );
};
