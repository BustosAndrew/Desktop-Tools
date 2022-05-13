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
          other machine running Windows 7 or later.
        </Typography>
      </Stack>
    </div>
  );
};
