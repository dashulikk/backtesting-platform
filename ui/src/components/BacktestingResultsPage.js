import React, { useState, useEffect } from 'react';
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
  Grid
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
  Legend
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
          <Text size="lg" fw={500} mb="md">Portfolio Positions</Text>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolio}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={Math.floor(portfolio.length / 10)}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '10px' }}
              />
              {selectedEnv?.stocks.map((stock, index) => (
                <Line
                  key={stock}
                  type="monotone"
                  dataKey={`positions.${stock}`}
                  stroke={colors[index % colors.length]}
                  dot={false}
                  name={stock}
                />
              ))}
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
    <Container>
      <Group mb="lg">
        <Button 
          variant="subtle" 
          leftIcon={<IconArrowLeft size={16} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Title order={2}>Backtesting Results</Title>
      </Group>

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
    </Container>
  );
};

export default BacktestingResultsPage; 