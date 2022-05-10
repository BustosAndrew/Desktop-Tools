import { Typography, Stack } from '@mui/material';

interface HowToProps {
  howToHandler(): void;
}

export const HowTo = ({ howToHandler }: HowToProps) => {
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
          howToHandler();
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
          How To
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', marginTop: 1, textAlign: 'center' }}
        >
          Select a folder you want and then you can also generate a txt file to
          list either all filenames or folder names within the folder.
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
