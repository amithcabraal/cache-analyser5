import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { NetworkRequest } from '../../types';
import { groupBy, sumBy } from 'lodash';

interface SimpleBarChartProps {
  data: NetworkRequest[];
  title: string;
  groupByKey: keyof NetworkRequest;
  valueType: 'size' | 'count';
}

interface ChartData {
  name: string;
  value: number;
}

export function SimpleBarChart({ data, title, groupByKey, valueType }: SimpleBarChartProps) {
  const prepareData = (): ChartData[] => {
    const grouped = groupBy(data, groupByKey);
    return Object.entries(grouped).map(([key, values]) => ({
      name: key || 'Unknown',
      value: valueType === 'size' ? sumBy(values, '6.size') / 1024 : values.length,
    }));
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={prepareData()}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}