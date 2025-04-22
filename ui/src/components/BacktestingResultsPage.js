import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Title, 
  Group, 
  Button, 
  Paper, 
  Text,
  Tabs,
  Card,
  Stack,
  ThemeIcon,
  Loader,
  Center,
  Table,
  ScrollArea,
  Grid,
  Switch,
  ActionIcon
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconChartLine, 
  IconChartPie, 
  IconTransfer,
  IconDatabase
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush
} from 'recharts';
import { api } from '../services/api';

const BacktestingResultsPage = ({ onBack }) => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [activeTab, setActiveTab] = useState('returns');
  const [loading, setLoading] = useState(false);
  const [returns, setReturns] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState(null);
  const [visibleStocks, setVisibleStocks] = useState(new Set());

  // Fetch environments that have been backtested
  useEffect(() => {
    const fetchEnvironments = async () => {
      setLoading(true);
      try {
        const envs = await api.getBacktestedEnvironments();
        setEnvironments(envs);
      } catch (error) {
        console.error('Error fetching environments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironments();
  }, []);

  // Fetch data when environment is selected
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEnv) return;
      
      setLoading(true);
      try {
        const [returnsData, portfolioData, tradesData] = await Promise.all([
          api.getEnvironmentReturns(selectedEnv.name),
          api.getEnvironmentPortfolio(selectedEnv.name),
          api.getEnvironmentTrades(selectedEnv.name)
        ]);
        
        setReturns(returnsData);
        setPortfolio(portfolioData);
        setTrades(tradesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEnv]);

  // Initialize visible stocks when environment is selected
  useEffect(() => {
    if (selectedEnv) {
      setVisibleStocks(new Set(selectedEnv.stocks));
    }
  }, [selectedEnv]);

  const handleLegendClick = (stock) => {
    setVisibleStocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stock)) {
        newSet.delete(stock);
      } else {
        newSet.add(stock);
      }
      return newSet;
    });
  };

  // Preprocess data to create separate line segments for active positions
  const processedData = useMemo(() => {
    if (!portfolio || !selectedEnv) return [];
    return portfolio.map((item, index) => {
      const newItem = { ...item };
      selectedEnv.stocks.forEach(stock => {
        // Handle NaN and undefined values
        const position = item.positions[stock] ?? 0;
        if (isNaN(position)) {
          newItem.positions[stock] = 0;
        }
        
        // Add a flag to indicate if this is an active position
        newItem[`${stock}_active`] = position !== 0;
        
        // Add a flag to indicate if this is the start or end of an active position
        const prevPosition = index > 0 ? (portfolio[index - 1].positions[stock] ?? 0) : 0;
        const nextPosition = index < portfolio.length - 1 ? (portfolio[index + 1].positions[stock] ?? 0) : 0;
        
        // Handle NaN in previous and next positions
        const prevPos = isNaN(prevPosition) ? 0 : prevPosition;
        const nextPos = isNaN(nextPosition) ? 0 : nextPosition;
        
        newItem[`${stock}_transition`] = (position === 0 && prevPos !== 0) || 
                                        (position !== 0 && nextPos === 0);
        
        // Add trade information
        newItem[`${stock}_trade`] = trades?.some(trade => 
          trade.date === item.date && trade.stock === stock
        );
      });
      return newItem;
    });
  }, [portfolio, selectedEnv, trades]);

  // Calculate max position for each stock for normalization
  const maxPositions = useMemo(() => {
    if (!portfolio || !selectedEnv) return {};
    const max = {};
    selectedEnv.stocks.forEach(stock => {
      const positions = portfolio.map(item => {
        const pos = item.positions[stock] ?? 0;
        return isNaN(pos) ? 0 : Math.abs(pos);
      });
      max[stock] = Math.max(...positions);
    });
    return max;
  }, [portfolio, selectedEnv]);

  // Calculate Y-axis domain to ensure negative values are shown
  const yDomain = useMemo(() => {
    if (!portfolio || !selectedEnv) return [0, 0];
    let min = 0;
    let max = 0;
    portfolio.forEach(item => {
      selectedEnv.stocks.forEach(stock => {
        const value = item.positions[stock];
        if (value !== undefined && !isNaN(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });
    // Add some padding to the domain
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [portfolio, selectedEnv]);

  const renderReturnsChart = () => {
    if (!returns) return null;

    return (
      <Paper p="md" mb="md">
        <Text size="lg" fw={500} mb="md">Daily Returns</Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={returns}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval={Math.floor(returns.length / 10)}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip 
              formatter={(value) => `${(value * 100).toFixed(2)}%`}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
            />
            <Line 
              type="monotone" 
              dataKey="returns" 
              stroke="#1971c2" 
              dot={false}
              name="Daily Returns"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    );
  };

  const renderReturnsTable = () => {
    if (!returns) return <Text>No returns data available</Text>;

    return (
      <ScrollArea h={400}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Returns (%)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {returns.map((item) => (
              <Table.Tr key={item.date}>
                <Table.Td>{item.date}</Table.Td>
                <Table.Td>{(item.returns * 100).toFixed(2)}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };

  const renderReturns = () => {
    if (!returns) return <Text>No returns data available</Text>;

    return (
      <>
        {renderReturnsChart()}
        {renderReturnsTable()}
      </>
    );
  };

  const renderPortfolio = () => {
    if (!portfolio) return <Text>No portfolio data available</Text>;

    // Generate a different color for each stock
    const colors = [
      '#1971c2', // blue
      '#c92a2a', // red
      '#087f5b', // green
      '#5f3dc4', // purple
      '#e67700', // orange
      '#1864ab', // dark blue
      '#862e9c', // violet
      '#2b8a3e', // dark green
    ];

    return (
      <>
        <Paper p="md" mb="md">
          <Group position="apart" mb="md">
            <Text size="lg" fw={500}>Portfolio Positions</Text>
            <Text size="sm" c="dimmed">(Drag the brush below to zoom)</Text>
          </Group>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={Math.floor(portfolio.length / 10)}
                allowDataOverflow={true}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(1)}
                domain={yDomain}
                allowDataOverflow={true}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Paper p="md" shadow="sm">
                        <Text size="sm" fw={500} mb="xs">Date: {label}</Text>
                        {payload
                          .filter(entry => entry.value !== undefined && !isNaN(entry.value))
                          .map((entry, index) => {
                            const stock = entry.name;
                            const position = entry.value;
                            const isTrade = entry.payload[`${stock}_trade`];
                            return (
                              <Text key={index} size="sm" style={{ color: entry.color }}>
                                {stock}: {position.toFixed(2)}
                                {isTrade && ' (Trade)'}
                              </Text>
                            );
                          })}
                      </Paper>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '10px' }}
                onClick={(data) => handleLegendClick(data.value)}
              />
              {selectedEnv?.stocks.map((stock, index) => {
                if (!visibleStocks.has(stock)) return null;
                
                const color = colors[index % colors.length];
                return (
                  <Line
                    key={stock}
                    type="monotone"
                    dataKey={`positions.${stock}`}
                    stroke={color}
                    dot={(entry) => {
                      const position = entry.positions?.[stock];
                      if (position === undefined || isNaN(position)) return null;
                      
                      const isTransition = entry[`${stock}_transition`];
                      const isTrade = entry[`${stock}_trade`];
                      
                      if (isTransition) {
                        return <circle cx={0} cy={0} r={5} fill={color} />;
                      }
                      
                      if (isTrade) {
                        return <circle cx={0} cy={0} r={4} fill={color} stroke="white" strokeWidth={1} />;
                      }
                      
                      return null;
                    }}
                    name={stock}
                    connectNulls={false}
                    strokeWidth={2}
                    opacity={visibleStocks.has(stock) ? 1 : 0.3}
                  />
                );
              })}
              <Brush 
                dataKey="date"
                height={30}
                stroke="#8884d8"
                startIndex={0}
                endIndex={Math.floor(portfolio.length * 0.2)}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <ScrollArea h={400}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                {selectedEnv?.stocks.map(stock => (
                  <Table.Th key={stock}>{stock}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {portfolio.map((item) => (
                <Table.Tr key={item.date}>
                  <Table.Td>{item.date}</Table.Td>
                  {selectedEnv?.stocks.map(stock => (
                    <Table.Td key={stock}>
                      {item.positions[stock]?.toFixed(2) || '0.00'}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </>
    );
  };

  const renderTrades = () => {
    if (!trades) return <Text>No trades data available</Text>;

    return (
      <ScrollArea h={400}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Cash</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {trades.map((trade, index) => (
              <Table.Tr key={`${trade.date}-${index}`}>
                <Table.Td>{trade.date}</Table.Td>
                <Table.Td>{trade.stock}</Table.Td>
                <Table.Td>{trade.type}</Table.Td>
                <Table.Td>${trade.cash.toFixed(2)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Center h={200}>
          <Loader size="lg" />
        </Center>
      );
    }

    if (!selectedEnv) {
      return (
        <Text c="dimmed" ta="center">Select an environment to view results</Text>
      );
    }

    return (
      <Paper p="md">
        {activeTab === 'returns' && renderReturns()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'trades' && renderTrades()}
      </Paper>
    );
  };

  return (
    <Container size="xl" py="xl" style={{ height: '100%', overflow: 'auto' }}>
      <Stack spacing="xl" style={{ height: '100%' }}>
        <Group position="apart">
          <Group>
            <ActionIcon onClick={onBack} size="lg" variant="subtle">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Backtesting Results</Title>
          </Group>
        </Group>

        <Grid style={{ height: 'calc(100% - 60px)' }}>
          <Grid.Col span={12}>
            <Paper p="md" style={{ height: '100%' }}>
              {!selectedEnv ? (
                // Show environment selection
                <Stack>
                  <Text size="lg" fw={500} mb="md">Select Environment</Text>
                  {environments.map((env) => (
                    <Card 
                      key={env.name}
                      withBorder
                      padding="md"
                      radius="md"
                      onClick={() => setSelectedEnv(env)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Group>
                        <ThemeIcon size="lg" color="blue" variant="light">
                          <IconDatabase size={20} />
                        </ThemeIcon>
                        <div>
                          <Text fw={500}>{env.name}</Text>
                          <Text size="sm" c="dimmed">
                            Stocks: {env.stocks.join(', ')}
                          </Text>
                        </div>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              ) : (
                // Show results tabs
                <>
                  <Group mb="md" position="apart">
                    <Text size="lg" fw={500}>{selectedEnv.name}</Text>
                    <Button 
                      variant="subtle" 
                      onClick={() => {
                        setSelectedEnv(null);
                        setReturns(null);
                        setPortfolio(null);
                        setTrades(null);
                      }}
                    >
                      Change Environment
                    </Button>
                  </Group>
                  
                  <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                      <Tabs.Tab 
                        value="returns" 
                        leftSection={<IconChartLine size={16} />}
                      >
                        Returns
                      </Tabs.Tab>
                      <Tabs.Tab 
                        value="portfolio" 
                        leftSection={<IconChartPie size={16} />}
                      >
                        Portfolio
                      </Tabs.Tab>
                      <Tabs.Tab 
                        value="trades" 
                        leftSection={<IconTransfer size={16} />}
                      >
                        Trades
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={activeTab} pt="md">
                      {renderContent()}
                    </Tabs.Panel>
                  </Tabs>
                </>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default BacktestingResultsPage; 