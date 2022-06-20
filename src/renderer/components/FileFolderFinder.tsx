import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field } from './Field';
import { About } from './About';
import { HowTo } from './HowTo';
import { CheckboxesDropdown } from './CheckboxesDropdown';
import '../App.css';

export const FileFolderFinder = () => {
  const [fieldsDisabled, setFieldDisabled] = useState<any>({
    folderSelect: false,
    keywords: true,
    dropdown: true,
    folderCheckbox: true,
  });
  const [path, setPath] = useState('');
  const [disableExecute, setDisableExecute] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any>({ status: '', numChanged: '' });
  const [findFolders, setFindFolders] = useState(false);
  const [queryHeader, setQueryHeader] = useState(
    'Enter keywords to find in the filenames (required):'
  );
  const [extensions, setExtensions] = useState<string[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const navigate = useNavigate();

  const aboutHandler = (): void => {
    setShowAbout(!showAbout);
  };
  const howToHandler = (): void => {
    setShowHowTo(!showHowTo);
  };

  const pathHandler = (folderPath: string): void => {
    setPath(folderPath);
  };

  const queryHandler = (query: string): void => {
    setSearchQuery(query);
  };

  const execHandler = () => {
    if (searchQuery && !findFolders) {
      window.electron.ipcRenderer.findFileNames([searchQuery, extensions]);
    } else if (searchQuery) {
      window.electron.ipcRenderer.findFolderNames([searchQuery]);
    }
  };

  const checkboxHandler = () => {
    setFindFolders(!findFolders);
  };

  // when the checkboxes dropdown field changes
  const extensionsHandler = (values: string[]) => {
    setExtensions(values);
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

    setQueryHeader(
      !findFolders
        ? 'Enter keywords to find in the folder names (required):'
        : 'Enter keywords to find in the filenames (required):'
    );

    if (!searchQuery) {
      setDisableExecute(true);
      setFieldDisabled({
        dropdown: true,
      });
    } else if (searchQuery) {
      setDisableExecute(false);
      setFieldDisabled({
        dropdown: false,
      });
    }

    if (!path) {
      setDisableExecute(true);
      setFieldDisabled({
        keywords: true,
        dropdown: true,
        folderCheckbox: true,
      });
    } else {
      window.electron.ipcRenderer
        .isValidPath(path)
        .then((result: string) => {
          if (result === 'Invalid folder path!') {
            setFieldDisabled({
              keywords: true,
              dropdown: true,
              folderCheckbox: true,
            });
            return;
          }
          setFieldDisabled({
            keywords: false,
            dropdown: false,
            folderCheckbox: false,
          });

          if (!searchQuery) {
            setFieldDisabled({ dropdown: true });
            setDisableExecute(true);
          }

          return;
        })
        .catch(() => {});
    }
  }, [path, searchQuery, findFolders]);

  return (
    <Box>
      {showAbout && <About aboutHandler={aboutHandler} />}
      {showHowTo && <HowTo howToHandler={howToHandler} />}
      <Typography
        sx={{
          position: 'absolute',
          left: 15,
          top: 0,
          fontWeight: 800,
          textAlign: 'right',
          fontSize: 40,
        }}
        variant="caption"
      >
        <span className="back" onClick={() => navigate(-1)}>
          &larr;
        </span>
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        File/Folder Finder
      </Typography>
      <Field
        label="Path\to\folder"
        value={path}
        buttonText="SELECT A FOLDER"
        buttonVisible={true}
        checkboxVisible={false}
        isRequired={false}
        disable={fieldsDisabled.folderSelect}
        fieldName="folderSelect"
        pathHandler={pathHandler}
      />
      <br />
      <Stack justifyContent="center" alignItems="center" direction="column">
        <FormControlLabel
          label={
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              Do you want to find only folder names?
            </Typography>
          }
          control={
            <Checkbox
              sx={{ transform: 'scale(.8)' }}
              defaultChecked={false}
              onChange={() => checkboxHandler()}
            />
          }
          labelPlacement="start"
          disabled={fieldsDisabled.folderCheckbox}
        />
      </Stack>
      <Field
        label={queryHeader}
        value=""
        header={queryHeader}
        buttonVisible={false}
        checkboxVisible={false}
        isRequired={true}
        disable={fieldsDisabled.keywords}
        fieldName="keywords"
        queryHandler={queryHandler}
      />
      <CheckboxesDropdown extensionsHandler={extensionsHandler} />
      <Stack
        marginTop={2}
        justifyContent="start"
        alignItems="center"
        direction="column"
      >
        <Button
          sx={{ borderRadius: 5, backgroundColor: '#5B89FF' }}
          size="small"
          variant="contained"
          onClick={() => execHandler()}
          disabled={disableExecute}
        >
          <Typography fontWeight="bold" variant="caption">
            EXECUTE
          </Typography>
        </Button>
        <Typography
          sx={{ fontWeight: 'bold', marginX: '50', textAlign: 'center' }}
          mt={1.5}
          variant="caption"
        >
          Result: {results.status}
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
        Ver. 1.0.0
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
        6/14/2022 - A.B.
      </Typography>
    </Box>
  );
};
