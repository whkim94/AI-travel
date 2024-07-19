import React from 'react';

import { Step, Stepper, StepLabel } from '@mui/material';

interface ProgressStepperProps {
  activeStep: number;
}

const steps = ['Select Location', 'Choose Mood', 'View Itinerary'];

const ProgressStepper: React.FC<ProgressStepperProps> = ({ activeStep }) => (
  <Stepper activeStep={activeStep} alternativeLabel>
    {steps.map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default ProgressStepper;
