import { useNavigate } from 'react-router-dom';
import { Stack, Typography, Button } from '@mui/material';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Stack
      justifyContent="center"
      alignContent="center"
      textAlign="center"
      marginTop={30}
      spacing={3}
      marginX={10}
    >
      <Typography sx={{ fontWeight: 'bold' }} variant="h3">
        City of Stockton Tools
      </Typography>
      <Button
        sx={{ width: 0.4, '&&': { mx: 'auto' } }}
        size="small"
        variant="contained"
        onClick={() => navigate('/finder')}
      >
        <Typography variant="button">File/Folder Finder</Typography>
      </Button>
      <Button
        sx={{ width: 0.4, '&&': { mx: 'auto' } }}
        size="small"
        variant="contained"
        onClick={() => navigate('/updater')}
      >
        <Typography variant="button">File/Folder Updater</Typography>
      </Button>
    </Stack>
  );
};
