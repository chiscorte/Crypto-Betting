import { Tooltip } from '@mui/material';
import { withStyles } from '@mui/material';
import React from 'react';

const LightTooltip = withStyles(theme => ({
  arrow: {
    background:  "linear-gradient(to bottom, #945D00, #8F4C00)",
  },
  tooltip: {
    background:  "linear-gradient(to bottom, #945D00, #8F4C00)",
  },
}))(Tooltip);

export default LightTooltip;