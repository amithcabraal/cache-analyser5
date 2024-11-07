import { Box, Button, TextField, Typography, Stack } from '@mui/material';
import { NetworkRequest } from '../types';
import { useState } from 'react';

interface DataImportProps {
  onDataImport: (data: NetworkRequest[]) => void;
  onClose: () => void;
}

export function DataImport({ onDataImport, onClose }: DataImportProps) {
  const [urlInput, setUrlInput] = useState('');
  const [currentData, setCurrentData] = useState<NetworkRequest[]>([]);

  const processHarFile = (harData: any): NetworkRequest[] => {
    return harData.log.entries.map((entry: any) => ({
      "1.method": entry.request.method,
      "2.url": entry.request.url,
      "3.cache-control": entry.response.headers.find((h: any) => h.name.toLowerCase() === "cache-control")?.value || null,
      "4.x-cache": entry.response.headers.find((h: any) => h.name.toLowerCase() === "x-cache")?.value || null,
      "5.x-amz-cf-pop": entry.response.headers.find((h: any) => h.name.toLowerCase() === "x-amz-cf-pop")?.value || null,
      "5.time": entry.time,
      "6.size": entry.response.content.size,
      "7.status": entry.response.status,
      "8.fulfilledBy": entry.response._fulfilledBy || null
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Check if it's a HAR file
      if (data.log && data.log.entries) {
        const processedData = processHarFile(data);
        setCurrentData(processedData);
        onDataImport(processedData);
        onClose();
      } else if (Array.isArray(data)) {
        // Regular JSON array
        setCurrentData(data);
        onDataImport(data);
        onClose();
      } else {
        alert('Invalid data format. Please upload a HAR file or JSON array.');
      }
    } catch (error) {
      alert('Error parsing file. Please check the format.');
    }
  };

  const handleUrlImport = async () => {
    try {
      const response = await fetch(urlInput);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCurrentData(data);
        onDataImport(data);
        onClose();
      } else {
        alert('Invalid data format. URL must return a JSON array.');
      }
    } catch (error) {
      alert('Error fetching data from URL. Please check the URL and try again.');
    }
  };

  const handleSaveJson = () => {
    if (!currentData.length) return;
    
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(currentData, null, 2)], {
      type: 'application/json'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'network-analysis.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Import Data</Typography>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Upload File:</Typography>
          <Stack direction="row" spacing={2}>
            <input
              accept=".har,.json,application/json"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span">
                Upload HAR/JSON File
              </Button>
            </label>
            <Button 
              variant="outlined" 
              onClick={handleSaveJson}
              disabled={!currentData.length}
            >
              Save as JSON
            </Button>
          </Stack>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Supported formats: HAR files (.har) or JSON array
          </Typography>
        </Box>
        
        <Typography variant="h6">Or import from URL:</Typography>
        <TextField
          fullWidth
          label="Data URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/data.json"
        />
        <Button
          variant="contained"
          onClick={handleUrlImport}
          disabled={!urlInput}
        >
          Import from URL
        </Button>
      </Stack>
    </Box>
  );
}