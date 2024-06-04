/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { Box, Card, Alert, Stack, Button, Dialog, Snackbar, Container, Typography, DialogTitle, OutlinedInput, DialogContent, DialogActions } from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';


export default function SubastasPage({ account, contract }) {
  const [open, setOpen] = useState(false);
  const [subastas, setSubastas] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    const getSubastasFromContract = async () => {
      try {
        const numSubastas = await contract.methods.getActiveAuctions().call();
        const subastasData = await Promise.all(
          numSubastas.map(async (auctionId) => {
            const auctionDetails = await contract.methods.getAuctionDetails(auctionId).call();
            return {
              id: auctionId,
              nombre: auctionDetails['0'],
              descripcion: auctionDetails['1'],
              fechaExp: dayjs.unix(Number(auctionDetails['2'])).format()
            };
          })
        );
        setSubastas(subastasData);
      } catch (error) {
        console.error('Error al obtener subastas:', error);
      }
    };

    getSubastasFromContract();
  }, [contract]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const getSubastasFromContract = async () => {
    try {
      const numSubastas = await contract.methods.getActiveAuctions().call();
      const subastasData = await Promise.all(
        numSubastas.map(async (auctionId) => {
          const auctionDetails = await contract.methods.getAuctionDetails(auctionId).call();
          return {
            id: auctionId,
            nombre: auctionDetails['0'],
            descripcion: auctionDetails['1'],
            fechaExp: dayjs.unix(Number(auctionDetails['2'])).format()
          };
        })
      );
      setSubastas(subastasData);
    } catch (error) {
      console.error('Error al obtener subastas:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    getSubastasFromContract();
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Subastas</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
          Nueva subasta
        </Button>
      </Stack>

      <Card sx={{ minHeight: '100%', padding: '10px' }}>
        <Scrollbar>
          {subastas && (
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              {subastas.map((subasta, index) => (
                <SubastaItem key={index} subasta={subasta} />
              ))}
            </Stack>
          )}
        </Scrollbar>
      </Card>

      {open && <SubastaDialog open={open} handleClose={handleClose} account={account} contract={contract} />}
      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity="error">Por favor, complete todos los campos.</Alert>
      </Snackbar>
    </Container>
  );
}

function SubastaItem({ subasta }) {
  const { nombre, descripcion, fechaExp } = subasta;

  return (
    <Stack direction="row" alignItems="center" spacing={2} paddingRight="10px">
      <Box sx={{ minWidth: '60%', flexGrow: 1 }}>
        <Typography color="inherit" variant="subtitle2">{nombre}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{descripcion}</Typography>
      </Box>
      
      <Typography width="20%" variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary', textAlign: 'center' }}>
        {dayjs(fechaExp).format('DD/MM/YYYY HH:mm')}
      </Typography>
      
      <Box width="20%" sx={{ textAlign: 'right' }}>
        <DateChecker targetDate={fechaExp} />
      </Box>
    </Stack>
  );
}

function SubastaDialog({ open, handleClose, contract, account }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaExp, setFechaExp] = useState(null);
  const [setOpenSnackBar] = useState(false);

  const handleSave = async () => {
    if (!nombre || !descripcion || !fechaExp) {
      setOpenSnackBar(true);
      return;
    }

    try {
      const duration = dayjs(fechaExp).diff(dayjs(), 'second');
      await contract.methods.createAuction(nombre, descripcion, duration).send({ from: account });
      handleClose();
    } catch (error) {
      console.error('Error al crear la subasta:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear nueva subasta</DialogTitle>
      <DialogContent>
        <OutlinedInput value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" fullWidth />
        <OutlinedInput value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" fullWidth multiline rows={3} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker value={fechaExp} onChange={(date) => setFechaExp(date)} label="Fecha de finalización" fullWidth />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Crear</Button>
      </DialogActions>
    </Dialog>
  );
}

function DateChecker({ targetDate }) {
  const [status, setStatus] = useState('Activo');

  useEffect(() => {
    const checkDate = () => {
      const now = dayjs();
      const target = dayjs(targetDate);
      if (now.isAfter(target)) {
        setStatus('Finalizada');
      } else {
        setStatus('Activa');
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 5000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <Label color={(status === 'Finalizada' && 'error') || 'success'}>{status}</Label>;
}
