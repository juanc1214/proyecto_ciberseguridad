
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import SubastaActiva from '../subastaCard';
import dayjs from 'dayjs';
// ----------------------------------------------------------------------

const subastas = JSON.parse(localStorage.getItem('subastas')) ?? []

const subastasActivas = subastas.filter(subasta => dayjs().isBefore(dayjs(subasta.fechaExp)))


export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Subastas activas
      </Typography>

      <Grid container spacing={3}>

        {subastasActivas?.map((subasta, index) => (

          <Grid key={index} xs={12} sm={6} md={6}>

            <SubastaActiva
              title={subasta.nombre}
              subasta={subasta}
              total={4000}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>

        ))}
      </Grid>
    </Container>
  );
}
