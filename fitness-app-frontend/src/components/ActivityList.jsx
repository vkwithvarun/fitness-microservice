import { Card, CardContent, Grid, Typography, Divider, Box } from '@mui/material';
import { getActivities } from '../services/api';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const ActivityList = () => {
  const [activities, setActivities] = React.useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid key={activity.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease-in-out',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px 0 rgba(0,0,0,0.12)',
                borderColor: 'primary.main',
              }
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}
              >
                {activity.type || 'UNKNOWN'}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Duration</Typography>
                  {/* ✅ Guard against null/undefined */}
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {activity.duration != null ? `${activity.duration} mins` : '— mins'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Calories</Typography>
                  {/* ✅ Guard against null/undefined */}
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                    {activity.caloriesBurned != null ? `${activity.caloriesBurned} kcal` : '— kcal'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;