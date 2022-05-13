import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Field } from './Field';
import { About } from './About';
import { HowTo } from './HowTo';
import '../App.css';

export const Render = () => {
  const [fieldsDisabled, setFieldDisabled] = useState<any>({
    first: false,
    second: true,
    third: true,
    fourth: true,
    folderCheckbox: true,
  });
  const [path, setPath] = useState('');
  const [disableExecute, setDisableExecute] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [results, setResults] = useState<any>({ status: '', numChanged: '' });
  const [txtFileLoc, setTxtFileLoc] = useState('');
  const [replaceAll, setReplaceAll] = useState(false);
  const [changeFolders, setChangeFolders] = useState(false);
  const [viewFolders, setViewFolders] = useState(false);
  const [queryHeader, setQueryHeader] = useState(
    'Enter characters to replace/remove in the filenames (required):'
  );
  const [numChangedText, setNumChangedText] = useState(
    'Number of filenames changed:'
  );
  const [showAbout, setShowAbout] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const aboutHandler = (): void => {
    setShowAbout(!showAbout);
  };
  const howToHandler = (): void => {
    setShowHowTo(!showHowTo);
  };

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
    if (!changeFolders)
      window.electron.ipcRenderer
        .changeFilenames([path, searchQuery, replaceText, replaceAll])
        .then((result: any) =>
          setResults({
            status: result.status,
            numChanged: result.numChanged,
          })
        )
        .catch(() => {});
    else if (changeFolders)
      window.electron.ipcRenderer
        .changeFolderNames([path, searchQuery, replaceText, replaceAll])
        .then((result: any) =>
          setResults({
            status: result.status,
            numChanged: result.numChanged,
          })
        )
        .catch(() => {});
    // console.log(replaceAll);
  };

  const checkboxHandler = (fieldName: string) => {
    if (fieldName === 'fourth') setReplaceAll(!replaceAll);
    else if (fieldName === 'second') setViewFolders(!viewFolders);
  };

  const changeFolderCheckboxHandler = () => {
    // !changeFolders because after setChangeFolders runs it'll work properly. TODO: use in useEffect
    setQueryHeader(
      !changeFolders
        ? 'Enter characters to replace/remove in the folder names (required):'
        : 'Enter characters to replace/remove in the filenames (required):'
    );
    setNumChangedText(
      !changeFolders
        ? 'Number of folder names changed:'
        : 'Number of filenames changed:'
    );
    setChangeFolders(!changeFolders);
  };

  const createTxtFile = (filename: string) => {
    window.electron.ipcRenderer
      .generateTxtFile([path, filename, viewFolders])
      .then((result: string) => setTxtFileLoc(result))
      .catch(() => {});
  };

  // when the page first loads or when searchQuery/path changes
  useEffect(() => {
    window.electron.ipcRenderer.on('about', () => {
      setShowAbout(true);
      setShowHowTo(false);
    });
    window.electron.ipcRenderer.on('how-to', () => {
      setShowHowTo(true);
      setShowAbout(false);
    });

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
        folderCheckbox: true,
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
              folderCheckbox: true,
            });
            return;
          }
          setFieldDisabled({
            second: false,
            third: false,
            folderCheckbox: false,
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
    <Box>
      {showAbout && <About aboutHandler={aboutHandler} />}
      {showHowTo && <HowTo howToHandler={howToHandler} />}
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        FileName or FolderName Updater
      </Typography>
      <Field
        label="Path\to\folder"
        value={path}
        buttonText="SELECT A FOLDER"
        buttonVisible={true}
        checkboxVisible={false}
        isRequired={false}
        disable={fieldsDisabled.first}
        fieldName="first"
        pathHandler={pathHandler}
      />
      <br />
      <Field
        label="Enter txt file name"
        value="report.txt"
        header="Enter a name for the txt file to be created in the app's logs folder (optional)"
        subheader="This will show a preview of all the contents present in the folder and its subfolders:"
        resultPath={'Text file install location: ' + txtFileLoc}
        buttonText="GENERATE"
        buttonVisible={true}
        checkboxVisible={true}
        isRequired={false}
        disable={fieldsDisabled.second}
        fieldName="second"
        createTxtFile={createTxtFile}
        checkboxLabel="Do you to want preview folder names instead of filenames in the txt file?"
        checkboxHandler={checkboxHandler}
      />
      <Stack justifyContent="center" alignItems="center" direction="column">
        <FormControlLabel
          label={
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              Do you want to change folder names instead of filenames?
            </Typography>
          }
          control={
            <Checkbox
              sx={{ transform: 'scale(.8)' }}
              defaultChecked={false}
              onChange={() => changeFolderCheckboxHandler()}
            />
          }
          labelPlacement="start"
          disabled={fieldsDisabled.folderCheckbox}
        />
      </Stack>
      <Field
        label="Enter characters to search for (i.e , or abc)"
        value=""
        header={queryHeader}
        buttonVisible={false}
        checkboxVisible={false}
        isRequired={false}
        disable={fieldsDisabled.third}
        fieldName="third"
        queryHandler={queryHandler}
      />
      <Field
        label="Enter characters to replace with (leave blank to delete)"
        value=""
        header="Enter the character(s) you want to replace with (optional):"
        buttonText="EXECUTE"
        buttonVisible={true}
        checkboxVisible={true}
        isRequired={false}
        disable={fieldsDisabled.fourth}
        disableExecute={disableExecute}
        fieldName="fourth"
        replaceTextHandler={replaceTextHandler}
        execHandler={execHandler}
        checkboxLabel="Do you want to replace all occurrences within each file/folder name?"
        checkboxHandler={checkboxHandler}
      />
      <Stack justifyContent="start" alignItems="center" direction="column">
        {' '}
        <Typography
          sx={{ fontWeight: 'bold', marginX: '50', textAlign: 'center' }}
          mt={1.5}
          variant="caption"
        >
          Result: {results.status}
        </Typography>
        <Typography
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
          variant="caption"
        >
          {numChangedText} {results.numChanged}
        </Typography>
      </Stack>
      <Typography
        sx={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          fontWeight: 'bold',
          textAlign: 'right',
        }}
        variant="caption"
      >
        Ver. 1.5.1
      </Typography>
      <Typography
        sx={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          fontWeight: 'bold',
          textAlign: 'right',
        }}
        variant="caption"
      >
        4/14/2022 - A.B.
      </Typography>
    </Box>
  );
};
