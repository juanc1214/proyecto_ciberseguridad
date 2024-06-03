import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Alert, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Snackbar, TextField } from '@mui/material';


// ----------------------------------------------------------------------

export default function OfertarPage() {

  const [nombre, setNombre] = useState('')

  const [subasta, setSubasta] = useState('');

  const [amount, setAmount] = useState('');

  const subastas = JSON.parse(localStorage.getItem('subastas')) ?? []

  const subastasActivas = subastas.filter(subasta => dayjs().isBefore(dayjs(subasta.fechaExp)))

  const handleChange = (event) => {
    setSubasta(event.target.value);
  };

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [noti, setNoti] = useState(null)

  const offer = () => {
    if (!nombre || !subasta || !amount) {
      setNoti({
        type: 'error',
        message: 'Faltan datos'
      })
      setOpenSnackBar(true);
      return
    }

    //Conectar función para ofertar
    //PENDING

    if(true /*validar respuesta*/){
      setNoti({
        type: 'success',
        message: 'Oferta realizada'
      })
    }else{
      setNoti({
        type: 'error',
        message: 'Oferta no realizada'
      })
    }
   
    setOpenSnackBar(true);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };


  return (
    <Container >
      <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
        <Typography variant="h4">Ofertar</Typography>
      </Stack>

      <Stack width={'100%'} direction="row" alignItems="center" justifyContent="center" mb={5}>
        <Card sx={{
          minHeight: '70%',
          padding: '20px',
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>

          <OutlinedInput
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre del candidato"
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Seleccinoar subasta</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subasta}
              label="Age"
              onChange={handleChange}
            >

              {subastasActivas?.map((subasta) => (
                <MenuItem key={subasta.id} value={subasta.id}>{subasta.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <OutlinedInput
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Cantidad (en ether)"
            fullWidth
            type='number'
          />

          <Button onClick={offer} variant='contained' color='primary' autoFocus>
            Ofertar
          </Button>

        </Card>
      </Stack>

      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseSnackBar}
          severity={noti?.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {noti?.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}