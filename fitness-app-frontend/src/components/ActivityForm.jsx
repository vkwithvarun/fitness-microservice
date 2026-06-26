import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  Typography,
  InputAdornment
} from '@mui/material';
import {
  DirectionsRun,
  DirectionsBike,
  DirectionsWalk,
  Pool,
  AccessTime,
  LocalFireDepartment,
  FitnessCenter,
  LocalActivity,
  Help
} from '@mui/icons-material';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const backendPayload = {
      type: activity.type,
      duration: parseInt(activity.duration, 10) || 0,
      caloriesBurned: parseInt(activity.caloriesBurned, 10) || 0,
    };

    try {
      await addActivity(backendPayload);
      onActivityAdded();
      setActivity({ type: "RUNNING", duration: '', caloriesBurned: '' });
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'grey.100',
        background: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #1976d2, #42a5f5)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3.5, gap: 1.5 }}>
        <FitnessCenter color="primary" sx={{ fontSize: '1.6rem' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.3px' }}>
          Log New Activity
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Activity Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2.5 }}>
          <InputLabel id="activity-type-label">Activity Type</InputLabel>
          <Select
            labelId="activity-type-label"
            label="Activity Type"
            value={activity.type}
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="RUNNING" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DirectionsRun color="action" /> Running
              </Box>
            </MenuItem>
            <MenuItem value="CYCLING" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DirectionsBike color="action" /> Cycling
              </Box>
            </MenuItem>
            <MenuItem value="WALKING" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DirectionsWalk color="action" /> Walking
              </Box>
            </MenuItem>
            <MenuItem value="WEIGHT_TRAINING" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FitnessCenter color="action" /> Weight Training
              </Box>
            </MenuItem>
            <MenuItem value="YOGA" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalActivity color="action" /> Yoga
              </Box>
            </MenuItem>
            {/* ✅ FIX: was "HIT" — corrected to "HIIT" to match backend enum */}
            <MenuItem value="HIIT" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalFireDepartment color="action" /> HIIT
              </Box>
            </MenuItem>
            <MenuItem value="CARDIO" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DirectionsRun color="action" /> Cardio
              </Box>
            </MenuItem>
            <MenuItem value="STRETCHING" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalActivity color="action" /> Stretching
              </Box>
            </MenuItem>
            {/* ✅ FIX: was DirectionsSwimming (doesn't exist) — corrected to DirectionsSwim */}
            <MenuItem value="SWIMMING" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Pool color="action" />  Swimming
              </Box>
            </MenuItem>
            <MenuItem value="OTHER" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Help color="action" /> Other
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Duration Input */}
        <TextField
          fullWidth
          label="Duration"
          type="number"
          sx={{ mb: 2.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 500 }}>mins</Typography>
                </InputAdornment>
              )
            }
          }}
          value={activity.duration}
          onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        />

        {/* Calories Input */}
        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          sx={{ mb: 4 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LocalFireDepartment sx={{ color: '#ff7043', fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 500 }}>kcal</Typography>
                </InputAdornment>
              )
            }
          }}
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            py: 1.8,
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            background: 'linear-gradient(90deg, #1976d2, #1565c0)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0, #0d47a1)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:active': {
              transform: 'translateY(1px)'
            }
          }}
        >
          Add Activity
        </Button>
      </Box>
    </Paper>
  );
};

export default ActivityForm;