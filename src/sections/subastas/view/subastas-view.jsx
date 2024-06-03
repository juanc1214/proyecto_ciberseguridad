import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput, Snackbar } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Label from 'src/components/label';


// ----------------------------------------------------------------------

export default function SubastasPage() {


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const subastas = JSON.parse(localStorage.getItem('subastas')) ?? []

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Subastas</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
          Nueva subasta
        </Button>
      </Stack>

      <Card sx={{
        minHeight: '100%',
        padding: '10px'
      }}>
        <Scrollbar>
          {subastas &&
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              {subastas?.map((subasta, index) => (
                <SubastaItem key={index} subasta={subasta} />
              ))}
            </Stack>}
        </Scrollbar>
      </Card>

      {open && <SubastaDialog open={open} handleClose={handleClose} />}


    </Container>
  );
}

function SubastaItem({ subasta }) {

  const { nombre, desc, fechaExp } = subasta;

  return (
    <Stack direction="row" alignItems="center" spacing={2} paddingRight={'10px'}>
      <Box sx={{ minWidth: '60%', flexGrow: 1 }}>
        <Typography color="inherit" variant="subtitle2">
          {nombre}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {desc}
        </Typography>
      </Box>

      <Typography width={'20%'} variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary', textAlign: 'center' }}>
        {dayjs(fechaExp)?.format('MM-DD-YYYY  HH:mm A')}
      </Typography>

      <Box width={'20%'} sx={{
        textAlign: 'right'
      }}>
        <DateChecker targetDate={fechaExp} />
      </Box>
    </Stack>
  );
}

function SubastaDialog({ open, handleClose }) {

  const [nombre, setNombre] = useState(null)

  const [desc, setDesc] = useState(null)

  const [fechaExp, setFechaExp] = useState(null)

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const Save = () => {
    if (!nombre || !fechaExp) {
      setOpenSnackBar(true);
      return
    }

    const subastas = JSON.parse(localStorage.getItem('subastas')) ?? []

    const newSubastas = [...subastas, {
      id: Math.floor(1000 + Math.random()*9000),
      nombre: nombre,
      desc: desc,
      fechaExp: fechaExp?.format()
    }]

    localStorage.setItem('subastas', JSON.stringify(newSubastas))

    handleClose();
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  return <>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Ingresar datos de la subasta
      </DialogTitle>
      <DialogContent sx={{
        width: '350px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>

        <OutlinedInput
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
          fullWidth
        />

        <OutlinedInput
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Descripción"
          fullWidth
          multiline
          rows={2}
          maxRows={3}
          aria-invalid
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker value={fechaExp}
            onChange={newDate => setFechaExp(newDate)}
            label={'Fecha de finalización'} />
        </LocalizationProvider>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} >Cancelar</Button>
        <Button onClick={Save} variant='contained' color='primary' autoFocus>
          Crear
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleCloseSnackBar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert
        onClose={handleClose}
        severity={'error'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        Datos faltantes
      </Alert>
    </Snackbar>

  </>
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

  return  <Label color={(status === 'Finalizada' && 'error') || 'success'}>{status}</Label>;
};