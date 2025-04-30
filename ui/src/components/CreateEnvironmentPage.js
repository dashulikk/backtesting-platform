import { useState, useMemo } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Stack,
  TextInput,
  ActionIcon,
  Text,
  Paper,
  Checkbox,
  ScrollArea,
  Table,
  LoadingOverlay,
  Alert,
  rem,
  Badge,
  Grid,
  Accordion,
  Box,
  Collapse,
  Flex
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArrowLeft, IconSearch, IconAlertCircle, IconChevronDown, IconChevronRight, IconCheck, IconCalendar } from '@tabler/icons-react';
import { api } from '../services/api';
import { sp500Stocks } from '../data/sp500stocks';
import { notifications } from '@mantine/notifications';

function CreateEnvironmentPage({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [environmentName, setEnvironmentName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [expandedSectors, setExpandedSectors] = useState({});

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return sp500Stocks;
    const query = searchQuery.toLowerCase();
    return sp500Stocks.filter(stock => 
      stock.ticker.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group stocks by sector and filter out empty sectors
  const sectors = useMemo(() => {
    const filteredSectors = new Set(filteredStocks.map(stock => stock.sector));
    return Array.from(filteredSectors).sort();
  }, [filteredStocks]);

  const handleStockSelect = (ticker) => {
    setSelectedStocks(prev => {
      if (prev.includes(ticker)) {
        return prev.filter(t => t !== ticker);
      }
      if (prev.length < 10) {
        return [...prev, ticker];
      }
      return prev;
    });
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    return dateString; // Date input already returns YYYY-MM-DD format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!environmentName.trim()) {
      setError('Please enter an environment name');
      return;
    }

    if (selectedStocks.length === 0) {
      setError('Please select at least one stock');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      await api.createEnvironment({
        name: environmentName.trim(),
        stocks: selectedStocks,
        start_date: formattedStartDate,
        end_date: formattedEndDate
      });

      notifications.show({
        title: 'Success',
        message: 'Environment created successfully',
        color: 'green',
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 3000,
      });

      onBack(); // Return to environments list
    } catch (err) {
      console.error('Error creating environment:', err);
      setError(err.message || 'Failed to create environment');
    } finally {
      setLoading(false);
    }
  };

  const toggleSector = (sector) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sector]: !prev[sector]
    }));
  };

  const inputStyles = {
    input: {
      backgroundColor: 'dark.6',
      borderColor: 'dark.4',
      color: 'gray.3',
      height: '38px',
      fontSize: '0.95rem'
    }
  };

  const datePickerStyles = {
    input: {
      backgroundColor: 'var(--mantine-color-dark-6)',
      borderColor: 'var(--mantine-color-dark-4)',
      color: 'var(--mantine-color-gray-3)',
      height: '38px',
      fontSize: '0.95rem',
      width: '100%'
    },
    day: {
      height: '28px',
      width: '28px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      margin: '1px',
      '&[data-selected]': {
        backgroundColor: 'var(--mantine-color-blue-6)',
      },
    },
    weekday: {
      fontSize: '0.8rem',
      color: 'var(--mantine-color-gray-5)',
      paddingBottom: '8px',
    },
    calendarBase: {
      width: '250px',
      backgroundColor: 'var(--mantine-color-dark-7)',
      border: '1px solid var(--mantine-color-dark-4)',
      borderRadius: '8px',
      padding: '12px',
    },
    calendarHeaderControl: {
      color: 'var(--mantine-color-gray-3)',
      '&:hover': {
        backgroundColor: 'var(--mantine-color-dark-5)',
      },
    }
  };

  return (
    <Container size="xl" p="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing="lg">
          <Group position="apart" mb="xs">
            <Group>
              <ActionIcon onClick={onBack} size="lg" variant="subtle" color="blue">
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Title order={2}>Create Environment</Title>
            </Group>
          </Group>

          <Grid>
            <Grid.Col span={4}>
              <Paper p="md" withBorder>
                <Stack spacing="md">
                  <TextInput
                    required
                    size="sm"
                    label="Environment Name"
                    value={environmentName}
                    onChange={(e) => setEnvironmentName(e.target.value)}
                    error={error && !environmentName.trim() ? 'Name is required' : null}
                  />

                  <Stack spacing="xs">
                    <TextInput
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      size="sm"
                      error={error && !startDate ? 'Required' : null}
                    />

                    <TextInput
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      size="sm"
                      error={error && !endDate ? 'Required' : null}
                    />
                  </Stack>

                  {selectedStocks.length > 0 && (
                    <Paper p="xs" withBorder>
                      <Stack spacing="xs">
                        <Text size="sm">Selected Stocks ({selectedStocks.length}/10):</Text>
                        <Group spacing={8}>
                          {selectedStocks.map(ticker => (
                            <Badge 
                              key={ticker}
                              size="lg"
                              variant="filled"
                              color="blue"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleStockSelect(ticker)}
                            >
                              {ticker} ×
                            </Badge>
                          ))}
                        </Group>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={8}>
              <Paper p="md" withBorder>
                <Stack spacing="md">
                  <TextInput
                    placeholder="Search stocks by ticker or company name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<IconSearch size={16} />}
                    size="sm"
                  />

                  <ScrollArea h={400}>
                    {sectors.map(sector => (
                      <Box key={sector} mb="md">
                        <Group position="apart" mb="xs">
                          <Text weight={500}>{sector}</Text>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            onClick={() => toggleSector(sector)}
                          >
                            {expandedSectors[sector] ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                          </ActionIcon>
                        </Group>
                        <Collapse in={expandedSectors[sector]}>
                          <Stack spacing="xs">
                            {filteredStocks
                              .filter(stock => stock.sector === sector)
                              .map(stock => (
                                <Checkbox
                                  key={stock.ticker}
                                  label={`${stock.ticker} - ${stock.name}`}
                                  checked={selectedStocks.includes(stock.ticker)}
                                  onChange={() => handleStockSelect(stock.ticker)}
                                  disabled={selectedStocks.length >= 10 && !selectedStocks.includes(stock.ticker)}
                                />
                              ))}
                          </Stack>
                        </Collapse>
                      </Box>
                    ))}
                    {sectors.length === 0 && (
                      <Text c="dimmed" ta="center" py="md">
                        No stocks found matching your search
                      </Text>
                    )}
                  </ScrollArea>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          <Group position="right" mt="md">
            <Button variant="default" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Environment
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}

export default CreateEnvironmentPage; 