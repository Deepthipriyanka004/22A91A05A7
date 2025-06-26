import { Box, Typography, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Url = ({ list }) => {
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard!");
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">Shortened URLs</Typography>
      {list.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        list.map((item, i) => (
          <Card key={i} variant="outlined" sx={{ my: 2 }}>
            <CardContent>
              <Typography><strong>Original URL:</strong> {item.url}</Typography>
              <Typography>
                <strong>Short URL:</strong>{" "}
                <a href={item.shortUrl} target="_blank" rel="noreferrer">
                  {item.shortUrl}
                </a>
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={() => handleCopy(item.shortUrl)} size="small">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Typography><strong>Validity:</strong> {item.expiry} mins</Typography>
              {item.code && <Typography><strong>Custom Code:</strong> {item.code}</Typography>}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Url;
