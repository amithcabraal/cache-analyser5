import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { NetworkRequest, DomainRequestData } from '../../types';

interface DomainRequestChartProps {
  data: NetworkRequest[];
  title: string;
}

export function DomainRequestChart({ data, title }: DomainRequestChartProps) {
  const prepareData = (): DomainRequestData[] => {
    const domainData: Record<string, DomainRequestData> = {};
    
    data.forEach(request => {
      try {
        const domain = new URL(request['2.url']).hostname;
        if (!domainData[domain]) {
          domainData[domain] = { domain, hitCount: 0, missCount: 0 };
        }
        
        const isHit = request['4.x-cache'].toLowerCase().includes('hit');
        
        if (isHit) {
          domainData[domain].hitCount++;
        } else {
          domainData[domain].missCount++;
        }
      } catch {
        // Skip invalid URLs
      }
    });

    return Object.values(domainData)
      .sort((a, b) => (b.hitCount + b.missCount) - (a.hitCount + a.missCount))
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
          <Bar dataKey="hitCount" fill="#82ca9d" name="Cache Hits" stackId="a" />
          <Bar dataKey="missCount" fill="#ff8042" name="Cache Misses" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}