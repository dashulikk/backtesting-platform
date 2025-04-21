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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
      backgroundColor: 'dark.6',
      borderColor: 'dark.4',
      color: 'gray.3',
      height: '38px',
      fontSize: '0.95rem',
      width: '160px'
    },
    day: {
      height: '30px',
      width: '30px'
    },
    weekday: {
      fontSize: '0.85rem',
      color: 'gray.4',
      padding: '8px 0'
    },
    weekend: {
      color: 'gray.5'
    },
    calendarBase: {
      width: '280px'
    }
  };

  return (
    <Container fluid h="100vh" bg="dark.6">
      <form onSubmit={handleSubmit} style={{ height: "100%" }}>
        <Stack spacing="md" h="100%" p="md">
          <Group position="apart" mb="xs">
            <Group>
              <ActionIcon onClick={onBack} size="lg" variant="subtle" color="blue">
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Title order={2} c="gray.3">Create Environment</Title>
            </Group>
          </Group>

          <Grid style={{ flex: 1, minHeight: 0 }}>
            <Grid.Col span={3}>
              <Paper shadow="sm" p="md" bg="dark.7" style={{ border: '1px solid', borderColor: 'dark.4' }}>
                <Stack spacing="xl">
                  <TextInput
                    required
                    size="sm"
                    label={<Text c="gray.3" size="sm" weight={500}>Environment Name</Text>}
                    value={environmentName}
                    onChange={(e) => setEnvironmentName(e.target.value)}
                    error={error && !environmentName.trim() ? 'Name is required' : null}
                    styles={inputStyles}
                  />

                  <Stack spacing="xs">
                    <DatePickerInput
                      label={<Text c="gray.3" size="sm" weight={500}>Start Date</Text>}
                      placeholder="Pick start date"
                      value={startDate}
                      onChange={setStartDate}
                      icon={<IconCalendar size={16} />}
                      required
                      size="sm"
                      error={error && !startDate ? 'Required' : null}
                      valueFormat="YYYY-MM-DD"
                      clearable
                      maxDate={endDate || new Date(2025, 11, 31)}
                      minDate={new Date(2000, 0, 1)}
                      firstDayOfWeek={1}
                      weekendDays={[0, 6]}
                      styles={datePickerStyles}
                      popoverProps={{
                        shadow: "md",
                        styles: {
                          dropdown: {
                            backgroundColor: 'dark.7',
                            borderColor: 'dark.4',
                            border: '1px solid',
                            padding: '8px'
                          }
                        }
                      }}
                    />

                    <DatePickerInput
                      label={<Text c="gray.3" size="sm" weight={500}>End Date</Text>}
                      placeholder="Pick end date"
                      value={endDate}
                      onChange={setEndDate}
                      icon={<IconCalendar size={16} />}
                      required
                      size="sm"
                      error={error && !endDate ? 'Required' : null}
                      valueFormat="YYYY-MM-DD"
                      clearable
                      minDate={startDate || new Date(2000, 0, 1)}
                      maxDate={new Date(2025, 11, 31)}
                      firstDayOfWeek={1}
                      weekendDays={[0, 6]}
                      styles={datePickerStyles}
                      popoverProps={{
                        shadow: "md",
                        styles: {
                          dropdown: {
                            backgroundColor: 'dark.7',
                            borderColor: 'dark.4',
                            border: '1px solid',
                            padding: '8px'
                          }
                        }
                      }}
                    />
                  </Stack>

                  <Box style={{ flex: 1 }}>
                    {selectedStocks.length > 0 && (
                      <Paper p="xs" bg="dark.6" style={{ border: '1px solid', borderColor: 'dark.4' }}>
                        <Stack spacing="xs">
                          <Text size="sm" c="gray.3">Selected Stocks ({selectedStocks.length}/10):</Text>
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

                    {selectedStocks.length === 10 && (
                      <Alert icon={<IconAlertCircle size={16} />} color="yellow" mt="xs">
                        Maximum 10 stocks selected
                      </Alert>
                    )}
                  </Box>

                  <Group position="right" mt="md">
                    <Button variant="subtle" color="gray" onClick={onBack}>Cancel</Button>
                    <Button 
                      type="submit" 
                      loading={loading}
                      disabled={!environmentName.trim() || selectedStocks.length === 0 || !startDate || !endDate}
                    >
                      Create Environment
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={9}>
              <Paper shadow="sm" p="md" bg="dark.7" style={{ border: '1px solid', borderColor: 'dark.4' }}>
                <Stack spacing="md" h="100%">
                  <LoadingOverlay visible={loading} />
                  
                  <TextInput
                    placeholder="Search stocks by ticker or company name..."
                    icon={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    styles={{
                      input: {
                        backgroundColor: 'dark.6',
                        borderColor: 'dark.4',
                        color: 'gray.3'
                      }
                    }}
                  />

                  <ScrollArea style={{ flex: 1 }}>
                    <Stack spacing="xs">
                      {sectors.map(sector => {
                        const sectorStocks = filteredStocks.filter(stock => stock.sector === sector);
                        if (sectorStocks.length === 0) return null;

                        return (
                          <Paper 
                            key={sector} 
                            p="xs" 
                            bg="dark.6"
                            style={{ border: '1px solid', borderColor: 'dark.4' }}
                          >
                            <Stack spacing={0}>
                              <Group 
                                position="apart" 
                                p="xs" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleSector(sector)}
                              >
                                <Group spacing="xs">
                                  {expandedSectors[sector] ? 
                                    <IconChevronDown size={16} color="gray" /> : 
                                    <IconChevronRight size={16} color="gray" />
                                  }
                                  <Text c="gray.3">{sector}</Text>
                                </Group>
                                <Text size="sm" c="dimmed">{sectorStocks.length} stocks</Text>
                              </Group>

                              <Collapse in={expandedSectors[sector]}>
                                <Box pl="md">
                                  <Table verticalSpacing="xs" highlightOnHover>
                                    <tbody>
                                      {sectorStocks.map((stock) => (
                                        <tr 
                                          key={stock.ticker}
                                          style={{ 
                                            cursor: !selectedStocks.includes(stock.ticker) && selectedStocks.length >= 10 ? 'not-allowed' : 'pointer',
                                            opacity: !selectedStocks.includes(stock.ticker) && selectedStocks.length >= 10 ? 0.5 : 1
                                          }}
                                          onClick={() => handleStockSelect(stock.ticker)}
                                        >
                                          <td style={{ width: 30, verticalAlign: 'middle' }}>
                                            <Checkbox
                                              checked={selectedStocks.includes(stock.ticker)}
                                              readOnly
                                              disabled={!selectedStocks.includes(stock.ticker) && selectedStocks.length >= 10}
                                              color="blue"
                                            />
                                          </td>
                                          <td style={{ width: 70, verticalAlign: 'middle', fontWeight: 500, color: 'gray.3' }}>
                                            {stock.ticker}
                                          </td>
                                          <td style={{ verticalAlign: 'middle', color: 'gray.4' }}>
                                            {stock.name}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </Stack>
                          </Paper>
                        );
                      })}
                    </Stack>
                  </ScrollArea>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </form>
    </Container>
  );
}

export default CreateEnvironmentPage; 