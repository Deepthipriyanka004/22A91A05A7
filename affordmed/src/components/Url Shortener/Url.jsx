import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { logMiddleware } from "../../Utils/logger";

function UrlForm({ redirectOnly = false }) {
  const { shortcode } = useParams();

  const [urls, setUrls] = useState([{ url: "", validity: "", code: "" }]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (redirectOnly && shortcode) {
      const saved = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
      const match = saved.find(
        (item) => item.code === shortcode || item.shortUrl.endsWith(`/${shortcode}`)
      );
      if (match) {
        window.location.href = match.url;
      } else {
        alert("Shortcode not found.");
      }
    }
  }, [redirectOnly, shortcode]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    setResults(saved);
  }, []);

  if (redirectOnly) return null;

  const handleChange = (i, field, value) => {
    const updated = [...urls];
    updated[i][field] = value;
    setUrls(updated);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard!");
  };

  const isValidURL = (url) => /^https?:\/\/[\w\-\.]+\.\w+/.test(url);

  const generateUniqueCode = (existingCodes) => {
    let code;
    do {
      code = Math.random().toString(36).substring(2, 7);
    } while (existingCodes.includes(code));
    return code;
  };

  const handleShorten = () => {
    const existing = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    const existingCodes = existing.map(
      (item) => item.code || item.shortUrl.split("/").pop()
    );

    const shortResults = [];

    for (let item of urls) {
      if (!isValidURL(item.url)) {
        alert(`Invalid URL: ${item.url}`);
        return;
      }

      let shortCode = item.code || generateUniqueCode(existingCodes);
      if (existingCodes.includes(shortCode)) {
        alert(`Shortcode \"${shortCode}\" already exists.`);
        return;
      }

      const newEntry = {
        url: item.url,
        code: shortCode,
        shortUrl: `${window.location.origin}/${shortCode}`,

        expiry: item.validity || 30,
        createdAt: new Date().toISOString()
      };

      logMiddleware("SHORTEN_URL", newEntry);
      existingCodes.push(shortCode);
      shortResults.push(newEntry);
    }

    const updated = [...existing, ...shortResults];
    localStorage.setItem("shortenedUrls", JSON.stringify(updated));
    setResults(updated);
    setUrls([{ url: "", validity: "", code: "" }]);
  };

  return (
    <Box p={4} maxWidth={700} mx="auto">
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((item, i) => (
        <Box key={i} display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField
            label="Long URL"
            value={item.url}
            onChange={(e) => handleChange(i, "url", e.target.value)}
            fullWidth
          />
          <TextField
            label="Validity (mins)"
            value={item.validity}
            onChange={(e) => handleChange(i, "validity", e.target.value)}
            type="number"
          />
          <TextField
            label="Custom Code (optional)"
            value={item.code}
            onChange={(e) => handleChange(i, "code", e.target.value)}
          />
        </Box>
      ))}

      <Button
        onClick={handleShorten}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Shorten
      </Button>

      <Box mt={4}>
        <Typography variant="h6">Shortened URLs</Typography>
        {results.map((res, i) => (
          <Box key={i} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography><strong>Original:</strong> {res.url}</Typography>
            <Typography>
              <strong>Short:</strong>{" "}
              <a href={res.shortUrl} target="_blank" rel="noreferrer">{res.shortUrl}</a>
              <Tooltip title="Copy">
                <IconButton onClick={() => handleCopy(res.shortUrl)} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography><strong>Expires in:</strong> {res.expiry} minutes</Typography>
            <Typography><strong>Created:</strong> {new Date(res.createdAt).toLocaleString()}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default UrlForm;
