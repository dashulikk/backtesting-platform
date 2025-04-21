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
  rem
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArrowLeft, IconSearch, IconAlertCircle, IconCalendar, IconCheck } from '@tabler/icons-react';
import { api } from '../services/api';
import { sp500Stocks } from '../data/sp500stocks';
import { notifications } from '@mantine/notifications';

function CreateEnvironmentPage({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [environmentName, setEnvironmentName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return sp500Stocks;
    const query = searchQuery.toLowerCase();
    return sp500Stocks.filter(stock => 
      stock.ticker.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group stocks by sector
  const sectors = useMemo(() => {
    return [...new Set(sp500Stocks.map(stock => stock.sector))];
  }, []);

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

  const formatDateForAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  return (
    <Container size="xl" py="xl">
      <form onSubmit={handleSubmit}>
        <Stack spacing="xl">
          <Group position="apart">
            <Group>
              <ActionIcon onClick={onBack} size="lg" variant="subtle">
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Title order={2}>Create Environment</Title>
            </Group>
          </Group>

          <TextInput
            required
            label="Environment Name"
            value={environmentName}
            onChange={(e) => setEnvironmentName(e.target.value)}
            error={error && !environmentName.trim() ? 'Name is required' : null}
          />

          <Group grow>
            <DatePickerInput
              label="Start Date"
              placeholder="Pick start date"
              value={startDate}
              onChange={setStartDate}
              icon={<IconCalendar size={16} />}
              required
              error={error && !startDate ? 'Start date is required' : null}
              valueFormat="YYYY-MM-DD"
            />
            <DatePickerInput
              label="End Date"
              placeholder="Pick end date"
              value={endDate}
              onChange={setEndDate}
              icon={<IconCalendar size={16} />}
              required
              error={error && !endDate ? 'End date is required' : null}
              valueFormat="YYYY-MM-DD"
            />
          </Group>

          <Paper shadow="sm" p="md" withBorder>
            <Stack spacing="md">
              <LoadingOverlay visible={loading} />
              
              <TextInput
                placeholder="Search by ticker or company name"
                icon={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {selectedStocks.length > 0 && (
                <Group spacing="xs">
                  <Text size="sm" weight={500}>Selected stocks:</Text>
                  <Text size="sm" color="dimmed">
                    {selectedStocks.join(', ')} ({selectedStocks.length}/10)
                  </Text>
                </Group>
              )}

              {selectedStocks.length === 10 && (
                <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                  You have reached the maximum number of stocks (10). Unselect some stocks to add different ones.
                </Alert>
              )}

              <ScrollArea h={400}>
                {sectors.map(sector => {
                  const sectorStocks = filteredStocks.filter(stock => stock.sector === sector);
                  if (sectorStocks.length === 0) return null;

                  return (
                    <Stack key={sector} spacing="xs" mb="xl">
                      <Title order={3}>{sector}</Title>
                      <Table>
                        <thead>
                          <tr>
                            <th style={{ width: 50 }}></th>
                            <th>Ticker</th>
                            <th>Company Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sectorStocks.map((stock) => (
                            <tr key={stock.ticker}>
                              <td>
                                <Checkbox
                                  checked={selectedStocks.includes(stock.ticker)}
                                  onChange={() => handleStockSelect(stock.ticker)}
                                  disabled={!selectedStocks.includes(stock.ticker) && selectedStocks.length >= 10}
                                />
                              </td>
                              <td>{stock.ticker}</td>
                              <td>{stock.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Stack>
                  );
                })}
              </ScrollArea>
            </Stack>
          </Paper>

          <Group position="right">
            <Button variant="subtle" onClick={onBack}>Cancel</Button>
            <Button 
              type="submit" 
              loading={loading}
              disabled={!environmentName.trim() || selectedStocks.length === 0 || !startDate || !endDate}
            >
              Create Environment
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}

export default CreateEnvironmentPage; 