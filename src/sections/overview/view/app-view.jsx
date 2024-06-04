/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import SubastaActiva from '../subastaCard';

export default function AppView({ contract }) {
  const [subastasActivas, setSubastasActivas] = useState([]);

  useEffect(() => {
    const fetchSubastas = async () => {
      if (contract) {
        try {
          const activeAuctions = await contract.methods.getActiveAuctions().call();
          const subastasPromises = activeAuctions.map(async (auctionId) => {
            const details = await contract.methods.getAuctionDetails(auctionId).call();
            return {
              id: auctionId,
              nombre: details['0'],
              descripcion: details['1'],
              fechaExp: dayjs.unix(Number(details['2'])).format(),
              currentBidAmount: Number(details['3']),
              currentWinner: details['4'],
              issuer: details['5']
            };
          });
          const subastas = await Promise.all(subastasPromises);
          const subastasActivasFilter = subastas.filter(subasta => dayjs().isBefore(dayjs(subasta.fechaExp)));
          console.log('subastasActivasFilter:', subastasActivasFilter);
          setSubastasActivas(subastasActivasFilter);
        } catch (error) {
          console.error('Error fetching subastas:', error);
        }
      }
    };

    fetchSubastas();
  }, [contract]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Subastas activas
      </Typography>

      <Grid container spacing={3}>
        {subastasActivas.map((subasta, index) => (
          <Grid key={index} xs={12} sm={6} md={6}>
            <SubastaActiva
              title={subasta.nombre}
              subasta={subasta}
              total={subasta.currentBidAmount}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
