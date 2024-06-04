/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Alert, Button, Select, MenuItem, Snackbar, InputLabel, FormControl, OutlinedInput } from '@mui/material';

export default function OfertarPage({ account, contract }) {
  const [nombre, setNombre] = useState('');
  const [subasta, setSubasta] = useState('');
  const [amount, setAmount] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [noti, setNoti] = useState(null);
  const [subastasActivas, setSubastasActivas] = useState([]);

  useEffect(() => {
    const fetchActiveAuctions = async () => {
      try {
        const activeAuctionIds = await contract.methods.getActiveAuctions().call();
        const activeAuctionsData = await Promise.all(
          activeAuctionIds.map(async (auctionId) => {
            const auctionDetails = await contract.methods.getAuctionDetails(auctionId).call();
            return {
              id: auctionId,
              nombre: auctionDetails[0],
              descripcion: auctionDetails[1],
              fechaExp: dayjs.unix(Number(auctionDetails[2])).format('MM-DD-YYYY  HH:mm A')
            };
          })
        );
        setSubastasActivas(activeAuctionsData);
      } catch (error) {
        console.error('Error al cargar las subastas activas:', error);
      }
    };

    fetchActiveAuctions();
  }, [contract]);

  const handleChange = (event) => {
    setSubasta(event.target.value);
  };

  const offer = async () => {
    if (!nombre || !subasta || !amount) {
      setNoti({
        type: 'error',
        message: 'Faltan datos'
      })
      setOpenSnackBar(true);
      return
    }

    try {
      await contract.methods.bid(subasta, nombre).send({ from: account, value: amount });
      setNoti({
        type: 'success',
        message: 'Oferta realizada'
      });
    } catch (error) {
      console.error('Error al realizar la oferta:', error);
      setNoti({
        type: 'error',
        message: 'Error al realizar la oferta',
      });
    }
    setOpenSnackBar(true);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
        <Typography variant="h4">Ofertar</Typography>
      </Stack>

      <Stack width="100%" direction="row" alignItems="center" justifyContent="center" mb={5}>
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
            <InputLabel id="demo-simple-select-label">Seleccionar subasta</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subasta}
              label="Age"
              onChange={handleChange}
            >
              {subastasActivas.map((subasta) => (
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