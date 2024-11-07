import { useState, useEffect } from 'react';
import { Container, Box, Paper, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FilterPanel } from './components/FilterPanel';
import { DashboardGrid } from './components/DashboardGrid';
import { DataTable } from './components/DataTable';
import { DataImport } from './components/DataImport';
import { HelpDialog } from './components/HelpDialog';
import { NetworkRequest, Filter, PanelConfig } from './types';
import { filterData } from './utils/filters';
import { useUrlState } from './hooks/useUrlState';

const defaultPanels: PanelConfig[] = [
  { i: 'size-by-cache', x: 0, y: 0, w: 6, h: 2, type: 'size-by-cache' },
  { i: 'requests-by-cache', x: 6, y: 0, w: 6, h: 2, type: 'requests-by-cache' },
  { i: 'size-by-pop', x: 0, y: 2, w: 6, h: 2, type: 'size-by-pop' },
  { i: 'requests-by-pop', x: 6, y: 2, w: 6, h: 2, type: 'requests-by-pop' },
  { i: 'domain-cache', x: 0, y: 4, w: 12, h: 3, type: 'domain-cache' },
  { i: 'domain-requests', x: 0, y: 7, w: 12, h: 3, type: 'domain-requests' }
];

export function App() {
  const [data, setData] = useState<NetworkRequest[]>([]);
  const [filters, setFilters] = useUrlState<Filter>('filters', {});
  const [panels, setPanels] = useState<PanelConfig[]>(() => {
    const saved = localStorage.getItem('dashboardLayout');
    return saved ? JSON.parse(saved) : defaultPanels;
  });
  const [filteredData, setFilteredData] = useState<NetworkRequest[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showImport, setShowImport] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setFilteredData(filterData(data, filters));
  }, [data, filters]);

  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(panels));
  }, [panels]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    handleMenuClose();
  };

  const handleNew = () => {
    setShowImport(true);
    handleMenuClose();
  };

  const handleHelp = () => {
    setShowHelp(true);
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cache Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleNew}>New</MenuItem>
        <MenuItem onClick={handleShare}>Share</MenuItem>
        <MenuItem onClick={handleHelp}>How to use</MenuItem>
      </Menu>

      <Container maxWidth={false}>
        <Box sx={{ my: 4 }}>
          {showImport ? (
            <Paper sx={{ p: 2, mb: 2 }}>
              <DataImport
                onDataImport={setData}
                onClose={() => setShowImport(false)}
              />
            </Paper>
          ) : (
            <>
              <Paper sx={{ p: 2, mb: 2 }}>
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  data={data}
                />
              </Paper>
              
              <Paper sx={{ p: 2, mb: 2 }}>
                <DashboardGrid 
                  data={filteredData}
                  panels={panels}
                  onLayoutChange={setPanels}
                />
              </Paper>

              <Paper sx={{ p: 2 }}>
                <DataTable data={filteredData} />
              </Paper>
            </>
          )}
        </Box>
      </Container>

      <HelpDialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
}