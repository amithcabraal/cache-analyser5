import { DataGrid } from '@mui/x-data-grid';
import { NetworkRequest } from '../types';

interface DataTableProps {
  data: NetworkRequest[];
}

export function DataTable({ data }: DataTableProps) {
  const columns = [
    { field: '1.method', headerName: 'Method', width: 100 },
    { field: '2.url', headerName: 'URL', width: 400 },
    { field: '3.cache-control', headerName: 'Cache Control', width: 200 },
    { field: '4.x-cache', headerName: 'X-Cache', width: 200 },
    { field: '5.x-amz-cf-pop', headerName: 'CF-POP', width: 150 },
    { field: '5.time', headerName: 'Time (s)', width: 130, type: 'number' },
    { field: '6.size', headerName: 'Size (bytes)', width: 130, type: 'number' },
    { field: '7.status', headerName: 'Status', width: 100, type: 'number' },
    { field: '8.fulfilledBy', headerName: 'Fulfilled By', width: 150 },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.map((row, index) => ({ id: index, ...row }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}