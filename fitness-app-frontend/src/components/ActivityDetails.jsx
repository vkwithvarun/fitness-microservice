import React, { useState, useEffect } from 'react';
import { getActivityDetail, getActivityById } from '../services/api';
import { Box, Card, CardContent, Divider, Typography, CircularProgress, Grid } from '@mui/material';
import { useParams } from 'react-router';

const ActivityDetails = () => {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        // Fetch both: recommendation data + raw activity data in parallel
        const [recommendationRes, activityRes] = await Promise.all([
          getActivityDetail(id),
          getActivityById(id)
        ]);

        const recommendationData = recommendationRes.data;
        const activityData = activityRes.data;

        // Merge both responses: AI fields from recommendation, stats from activity
        setActivity({
          ...recommendationData,
          type: recommendationData.activityType || activityData.type,
          duration: activityData.duration,
          caloriesBurned: activityData.caloriesBurned,
          createdAt: activityData.createdAt,
        });
        setRecommendation(recommendationData.recommendation || "");
      } catch (err) {
        console.log("Still generating...");
      }
    };
    fetchActivityDetails();

    const interval = setInterval(fetchActivityDetails, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!activity) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2 }}>
        <CircularProgress thickness={4} size={45} sx={{ color: '#1976d2' }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Analyzing your workout metrics...
        </Typography>
      </Box>
    );
  }

  const formattedDate = activity.createdAt
    ? new Date(activity.createdAt).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'N/A';

  const analysisSections = recommendation.split(/(?=Overall:|Pace:|Heart\s?Rate:|Calories:)/gi);

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', p: { xs: 2, md: 4 } }}>

      {/* --- SECTION 1: CORE STATS CARD --- */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'grey.100',
          boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
          background: 'linear-gradient(145deg, #ffffff, #fdfdfd)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 700, color: 'primary.main' }}>
              Workout Overview
            </Typography>
            {/* ✅ FIX: reads activityType from recommendation OR type from activity */}
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, letterSpacing: '-0.5px' }}>
              {(activity.type || 'ACTIVITY').toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              📅 {formattedDate}
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={4}>
              <Box sx={{ p: 2, bgcolor: '#f4f7fa', borderRadius: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  ⏱️ DURATION
                </Typography>
                {/* ✅ FIX: reads from actual activity record */}
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {activity.duration != null ? activity.duration : '—'}{' '}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.7 }}>mins</span>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Box sx={{ p: 2, bgcolor: '#fff5f2', borderRadius: 3 }}>
                <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  🔥 BURNED
                </Typography>
                {/* ✅ FIX: reads from actual activity record */}
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#d84315' }}>
                  {activity.caloriesBurned != null ? activity.caloriesBurned.toLocaleString() : '—'}{' '}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.7 }}>kcal</span>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* --- SECTION 2: AI RECOMMENDATIONS --- */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'grey.100',
          boxShadow: '0 12px 36px rgba(0,0,0,0.03)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #4caf50, #2e7d32)'
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <span style={{ fontSize: '1.75rem' }}>✨</span>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              Personalized AI Insights
            </Typography>
          </Box>

          {/* 1. Analysis Summary Block */}
          {recommendation && (
            <Box sx={{ mb: 4, p: 2.5, bgcolor: '#f4fbf4', borderRadius: 3, borderLeft: '4px solid #4caf50' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1.5 }}>
                Analysis Summary
              </Typography>
              {analysisSections.map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                const match = trimmed.match(/^(Overall|Pace|Heart\s?Rate|Calories):(.*)/is);
                return (
                  <Typography key={index} variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, mb: 1.5 }}>
                    {match ? <><strong>{match[1]}:</strong>{match[2]}</> : trimmed}
                  </Typography>
                );
              })}
            </Box>
          )}

          {/* 2. Areas for Improvement */}
          {activity.improvements && activity.improvements.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                📈 Areas for Improvement
              </Typography>
              {activity.improvements.map((improvement, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1.5, color: 'text.secondary', pl: 2, position: 'relative', '&::before': { content: '"•"', position: 'absolute', left: 4, fontWeight: 'bold', color: 'primary.main' } }}>
                  {improvement}
                </Typography>
              ))}
              <Divider sx={{ my: 3, opacity: 0.6 }} />
            </Box>
          )}

          {/* 3. Next-Step Suggestions */}
          {activity.suggestions && activity.suggestions.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                💡 Next-Step Suggestions
              </Typography>
              {activity.suggestions.map((suggestion, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1.5, color: 'text.secondary', pl: 2, position: 'relative', '&::before': { content: '"•"', position: 'absolute', left: 4, fontWeight: 'bold', color: 'success.main' } }}>
                  {suggestion}
                </Typography>
              ))}
              <Divider sx={{ my: 3, opacity: 0.6 }} />
            </Box>
          )}

          {/* 4. Safety Precautions */}
          {activity.safety && activity.safety.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#c62828' }}>
                🛡️ Health & Safety Precautions
              </Typography>
              {activity.safety.map((safetyItem, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1.5, color: 'text.secondary', pl: 2, position: 'relative', '&::before': { content: '"•"', position: 'absolute', left: 4, fontWeight: 'bold', color: '#c62828' } }}>
                  {safetyItem}
                </Typography>
              ))}
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetails;