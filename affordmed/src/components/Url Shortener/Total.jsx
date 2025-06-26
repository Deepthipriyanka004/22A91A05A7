import { Box, Typography } from "@mui/material";

function StatsPage() {
  const stats = JSON.parse(localStorage.getItem("shortenedUrls")) || [];

  return (
    <Box p={4}>
      <Typography variant="h5">URL Stats</Typography>
      {stats.map((item, i) => (
        <Box key={i} mt={2} p={2} border="1px solid grey">
          <Typography>Long URL: {item.url}</Typography>
          <Typography>Short URL: {item.shortUrl}</Typography>
          <Typography>Created At: {item.createdAt}</Typography>
          <Typography>Expiry: {item.expiry} minutes</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default StatsPage;