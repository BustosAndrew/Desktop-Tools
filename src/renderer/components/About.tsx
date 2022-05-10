import { Typography, Stack } from '@mui/material';

interface AboutProps {
  aboutHandler(): void;
}

export const About = ({ aboutHandler }: AboutProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 2,
      }}
    >
      <span
        className="clear"
        style={{ fontSize: '28px', position: 'absolute', right: 10, top: 0 }}
        onClick={() => {
          aboutHandler();
        }}
      >
        <b>✖</b>
      </span>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        marginX={10}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
          About
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', marginTop: 2, textAlign: 'center' }}
        >
          Version 1.5.1 - 4/14/2022
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', marginTop: 2, textAlign: 'center' }}
        >
          Developed by Andrew Bustos in React, Typescript, Electron and Material
          UI and made for City of Stockton. This project was supervised by
          Senior Systems Analyst Marlen Khoo.
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', marginTop: 1, textAlign: 'center' }}
        >
          The purpose of this desktop app is to streamline the file/folder
          renaming process. It runs only in Windows and can be deployed to any
          other machine running Windows 7 or later. This is by allowing you to
          select a folder you want and then let you generate a txt file to list
          either all filenames or folder names within the folder.
          <br />
          <br /> Afterwards, the third text field requires you to type in what
          characters to look for in either each filename or folder name. The
          last text field lets you type in what to replace the characters with,
          such as a comma or whatever text you desire.
          <br />
          <br /> You can then press the EXECUTE button to replace whatever
          characters you are searching for within each file/folder name. The
          results of the program are displayed below the EXECUTE button showing
          how many filenames/folder names were changed and if the program was
          successful or not.
        </Typography>
      </Stack>
    </div>
  );
};
