import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { NetworkRequest, DomainCacheData } from '../../types';

interface DomainCacheChartProps {
  data: NetworkRequest[];
  title: string;
}

export function DomainCacheChart({ data, title }: DomainCacheChartProps) {
  const prepareData = (): DomainCacheData[] => {
    const domainData: Record<string, DomainCacheData> = {};
    
    data.forEach(request => {
      try {
        const domain = new URL(request['2.url']).hostname;
        if (!domainData[domain]) {
          domainData[domain] = { domain, hitBytes: 0, missBytes: 0 };
        }
        
        const isHit = request['4.x-cache'].toLowerCase().includes('hit');
        const bytes = request['6.size'] / 1024; // Convert to KB
        
        if (isHit) {
          domainData[domain].hitBytes += bytes;
        } else {
          domainData[domain].missBytes += bytes;
        }
      } catch {
        // Skip invalid URLs
      }
    });

    return Object.values(domainData)
      .sort((a, b) => (b.hitBytes + b.missBytes) - (a.hitBytes + a.missBytes))
      .slice(0, 10);
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={prepareData()}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="domain" width={150} />
          <Tooltip />
          <Bar dataKey="hitBytes" fill="#82ca9d" name="Cache Hits" stackId="a" />
          <Bar dataKey="missBytes" fill="#ff8042" name="Cache Misses" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}