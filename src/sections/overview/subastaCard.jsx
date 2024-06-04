/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import duration from 'dayjs/plugin/duration';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

dayjs.extend(duration);

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(targetDate) {
    const now = dayjs();
    const target = dayjs(targetDate);
    const diff = target.diff(now, 'second');
    const duration = dayjs.duration(diff, 'second');
    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    };
  }

  return (
    <div>
      <Typography variant="subtitle2" color="#F5B041">
        Termina en: {`${timeLeft.days} días ${timeLeft.hours} horas ${timeLeft.minutes} minutos ${timeLeft.seconds} segundos`}
      </Typography>
    </div>
  );
};

const SubastaActiva = ({ subasta, icon, color = 'primary', sx, ...other }) => (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h4">${subasta.currentBidAmount}</Typography>

        <Typography variant="subtitle2" >
          {subasta.nombre}
        </Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          Postor lider: {subasta.currentWinner}
        </Typography>

        <Box>
          <CountdownTimer targetDate={subasta.fechaExp} />
        </Box>

      </Stack>
    </Card>
  );

SubastaActiva.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  subasta: PropTypes.any
};

export default SubastaActiva;