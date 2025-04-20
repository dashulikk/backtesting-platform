import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  TextInput, 
  Button, 
  Group, 
  Stack,
  Paper,
  Text,
  Divider,
  Table,
  ActionIcon,
  Modal,
  Box,
  Select,
  Card,
  Badge,
  Grid,
  ThemeIcon,
  Alert,
  Textarea
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconPlus, IconTrash, IconPlayerPlay, IconEdit, IconChartBar, IconArrowLeft, IconDeviceFloppy, IconDots, IconPencil, IconSearch, IconAlertCircle, IconFolderPlus } from '@tabler/icons-react';
import StrategyModal from './StrategyModal';

function SimulationPage({ onBack, environments = [], onUpdateEnvironments }) {
  const [simulationName, setSimulationName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [strategies, setStrategies] = useState([]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [showCreateEnvironmentModal, setShowCreateEnvironmentModal] = useState(false);
  const [newEnvironmentName, setNewEnvironmentName] = useState('');
  const [newEnvironmentStocks, setNewEnvironmentStocks] = useState('');

  // Add console log to debug environments prop
  console.log('Environments in SimulationPage:', environments);

  // Initialize selected environment when environments prop changes
  useEffect(() => {
    if (environments.length > 0 && !selectedEnvironment) {
      setSelectedEnvironment(environments[0]);
    }
  }, [environments, selectedEnvironment]);

  const handleAddStrategy = (strategy) => {
    setStrategies([...strategies, strategy]);
  };

  const handleRemoveStrategy = (index) => {
    setStrategies(strategies.filter((_, i) => i !== index));
  };

  const handleSaveSimulation = () => {
    // This would typically save to a backend
    console.log('Saving simulation:', {
      name: simulationName,
      startDate,
      endDate,
      strategies,
      environment: selectedEnvironment
    });
    
    // Reset form
    setSimulationName('');
    setStartDate(null);
    setEndDate(null);
    setStrategies([]);
    
    // Go back to home page
    onBack();
  };

  const handleBacktest = async () => {
    if (!selectedEnvironment) {
      return;
    }
    
    setIsBacktesting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock backtest results
    setBacktestResults({
      totalReturn: 15.7,
      sharpeRatio: 1.2,
      maxDrawdown: -8.5,
      winRate: 0.65,
      trades: [
        { date: '2024-01-15', symbol: 'AAPL', type: 'BUY', price: 180.50, quantity: 10 },
        { date: '2024-01-20', symbol: 'AAPL', type: 'SELL', price: 185.75, quantity: 10 },
        { date: '2024-01-25', symbol: 'MSFT', type: 'BUY', price: 375.25, quantity: 5 },
        { date: '2024-01-30', symbol: 'MSFT', type: 'SELL', price: 382.50, quantity: 5 }
      ]
    });
    
    setIsBacktesting(false);
    setIsResultsModalOpen(true);
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : '';
  };

  const handleEnvironmentSelect = (environmentId) => {
    const environment = environments.find(env => env.id === environmentId);
    if (environment) {
      setSelectedEnvironment(environment);
      setShowEnvironmentModal(false);
    }
  };

  const handleCreateEnvironment = () => {
    if (newEnvironmentName && newEnvironmentStocks) {
      const stocks = newEnvironmentStocks.split(',').map(s => s.trim().toUpperCase());
      const newEnvironment = {
        id: Date.now(),
        name: newEnvironmentName,
        stocks,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Update environments in parent component
      if (typeof onUpdateEnvironments === 'function') {
        onUpdateEnvironments([...environments, newEnvironment]);
      }
      
      setSelectedEnvironment(newEnvironment);
      setShowCreateEnvironmentModal(false);
      setNewEnvironmentName('');
      setNewEnvironmentStocks('');
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Group>
            <ActionIcon onClick={onBack} size="lg" variant="subtle">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>New Simulation</Title>
          </Group>
        </Group>

        <Paper p="md" withBorder>
          <Stack spacing="md">
            <TextInput
              label="Simulation Name"
              placeholder="Enter simulation name"
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
            />

            <Group grow>
              <DatePickerInput
                label="Start Date"
                placeholder="Pick start date"
                value={startDate}
                onChange={setStartDate}
                icon={<IconCalendar size={16} />}
              />
              <DatePickerInput
                label="End Date"
                placeholder="Pick end date"
                value={endDate}
                onChange={setEndDate}
                icon={<IconCalendar size={16} />}
              />
            </Group>

            <Card withBorder>
              <Stack spacing="md">
                <Group position="apart">
                  <Text weight={500}>Environment</Text>
                  <Group>
                    <Button
                      variant="light"
                      leftIcon={<IconFolderPlus size={16} />}
                      onClick={() => setShowCreateEnvironmentModal(true)}
                    >
                      Create New
                    </Button>
                    <Button
                      variant="light"
                      leftIcon={<IconEdit size={16} />}
                      onClick={() => setShowEnvironmentModal(true)}
                    >
                      Select Environment
                    </Button>
                  </Group>
                </Group>

                {selectedEnvironment ? (
                  <Stack spacing="xs">
                    <Text size="sm" weight={500}>{selectedEnvironment.name}</Text>
                    <Group spacing="xs">
                      {selectedEnvironment.stocks.map((stock) => (
                        <Badge key={stock} variant="light" color="blue">
                          {stock}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                ) : (
                  <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                    Please select or create an environment to continue
                  </Alert>
                )}
              </Stack>
            </Card>

            <Card withBorder>
              <Stack spacing="md">
                <Group position="apart">
                  <Text weight={500}>Strategies</Text>
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    onClick={() => setIsStrategyModalOpen(true)}
                  >
                    Add Strategy
                  </Button>
                </Group>

                {strategies.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Parameters</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strategies.map((strategy, index) => (
                        <tr key={index}>
                          <td>{strategy.type}</td>
                          <td>
                            {Object.entries(strategy.parameters).map(([key, value]) => (
                              <Text key={key} size="sm">
                                {key}: {value}
                              </Text>
                            ))}
                          </td>
                          <td>
                            <ActionIcon
                              color="red"
                              onClick={() => handleRemoveStrategy(index)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Text color="dimmed" align="center">
                    No strategies added yet
                  </Text>
                )}
              </Stack>
            </Card>

            <Group position="right">
              <Button
                variant="light"
                onClick={onBack}
              >
                Cancel
              </Button>
              <Button
                leftIcon={<IconDeviceFloppy size={16} />}
                onClick={handleSaveSimulation}
                disabled={!simulationName || !startDate || !endDate || !selectedEnvironment}
              >
                Save Simulation
              </Button>
              <Button
                leftIcon={<IconPlayerPlay size={16} />}
                onClick={handleBacktest}
                loading={isBacktesting}
                disabled={!simulationName || !startDate || !endDate || !selectedEnvironment || strategies.length === 0}
              >
                Run Backtest
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      <StrategyModal
        opened={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        onAdd={handleAddStrategy}
      />

      <Modal
        opened={showEnvironmentModal}
        onClose={() => setShowEnvironmentModal(false)}
        title="Select Environment"
        size="md"
      >
        <Stack spacing="md">
          {environments.map((environment) => (
            <Card
              key={environment.id}
              withBorder
              style={{ cursor: 'pointer' }}
              onClick={() => handleEnvironmentSelect(environment.id)}
            >
              <Stack spacing="xs">
                <Text weight={500}>{environment.name}</Text>
                <Group spacing="xs">
                  {environment.stocks.map((stock) => (
                    <Badge key={stock} variant="light" color="blue">
                      {stock}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Modal>

      <Modal
        opened={showCreateEnvironmentModal}
        onClose={() => setShowCreateEnvironmentModal(false)}
        title="Create New Environment"
        size="md"
      >
        <Stack spacing="md">
          <TextInput
            label="Environment Name"
            placeholder="Enter environment name"
            value={newEnvironmentName}
            onChange={(e) => setNewEnvironmentName(e.target.value)}
          />
          <Textarea
            label="Stocks (comma-separated)"
            placeholder="AAPL, MSFT, GOOGL"
            value={newEnvironmentStocks}
            onChange={(e) => setNewEnvironmentStocks(e.target.value)}
          />
          <Group position="right">
            <Button variant="light" onClick={() => setShowCreateEnvironmentModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEnvironment}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={isResultsModalOpen}
        onClose={() => setIsResultsModalOpen(false)}
        title="Backtest Results"
        size="xl"
      >
        {backtestResults && (
          <Stack spacing="xl">
            <Grid>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack spacing="xs" align="center">
                    <Text size="sm" color="dimmed">Total Return</Text>
                    <Text size="xl" weight={700} color={backtestResults.totalReturn >= 0 ? 'green' : 'red'}>
                      {backtestResults.totalReturn}%
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack spacing="xs" align="center">
                    <Text size="sm" color="dimmed">Sharpe Ratio</Text>
                    <Text size="xl" weight={700}>{backtestResults.sharpeRatio}</Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack spacing="xs" align="center">
                    <Text size="sm" color="dimmed">Max Drawdown</Text>
                    <Text size="xl" weight={700} color="red">{backtestResults.maxDrawdown}%</Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card withBorder>
                  <Stack spacing="xs" align="center">
                    <Text size="sm" color="dimmed">Win Rate</Text>
                    <Text size="xl" weight={700}>{backtestResults.winRate * 100}%</Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>

            <Card withBorder>
              <Stack spacing="md">
                <Text weight={500}>Trade History</Text>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Symbol</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtestResults.trades.map((trade, index) => (
                      <tr key={index}>
                        <td>{trade.date}</td>
                        <td>{trade.symbol}</td>
                        <td>{trade.type}</td>
                        <td>${trade.price}</td>
                        <td>{trade.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Stack>
            </Card>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

export default SimulationPage; 