import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  ThemeIcon,
  ActionIcon,
  Menu,
  Modal,
  Badge,
  Divider,
  Paper,
  Grid,
  Loader,
  Center
} from '@mantine/core';
import { 
  IconPlus, 
  IconTrash, 
  IconPencil, 
  IconChartLine,
  IconChartBar,
  IconChartCandle,
  IconArrowLeft,
  IconArrowBack,
  IconPlayerPlay,
  IconPlayerStop
} from '@tabler/icons-react';
import StrategyModal from './StrategyModal';
import EditStrategyModal from './EditStrategyModal';

const StrategiesPage = ({ onBack, onNavigate }) => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState(null);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [runningBacktests, setRunningBacktests] = useState(new Set());

  const token = localStorage.getItem('token');

  const strategiesInfo = {
    PercentageSMAStrategy: {
      description: "A strategy that uses Simple Moving Average (SMA) to identify trading opportunities based on percentage deviations from the moving average. The strategy enters positions when the price deviates from the SMA by a specified percentage, either above or below the moving average.",
      parameters: [
        {
          name: "Days",
          description: "The number of days used to calculate the Simple Moving Average. A longer period (e.g., 20-50 days) will result in a smoother line that better represents the overall trend, while a shorter period (e.g., 5-10 days) will be more responsive to recent price changes.",
          type: "number",
          min: 1
        },
        {
          name: "Percentage Change",
          description: "The minimum percentage deviation from the SMA required to trigger a trade. For example, a value of 2 means the price must deviate by at least 2% from the SMA. This parameter helps filter out small price movements and only enter trades on significant deviations.",
          type: "number",
          min: 0,
          step: 0.1
        },
        {
          name: "Direction",
          description: "Determines whether to enter a position when the price drops below (Drop) or rises above (Rise) the SMA by the specified percentage. 'Drop' is typically used for long positions (buying when price drops below SMA), while 'Rise' is used for short positions (selling when price rises above SMA).",
          type: "select",
          options: ["Drop", "Rise"]
        },
        {
          name: "Position Type",
          description: "Specifies whether to take a long or short position when the entry conditions are met. Long positions profit from price increases, while short positions profit from price decreases. The position type should align with your market outlook and risk tolerance.",
          type: "select",
          options: ["Long", "Short"]
        }
      ],
      example: "With Days=20, Percentage Change=2, Direction=Drop, and Position Type=Long, the strategy will enter a long position when the price drops 2% below the 20-day SMA. This setup is suitable for identifying potential buying opportunities when a stock temporarily dips below its moving average.",
      strategyLogic: "The strategy calculates a Simple Moving Average over the specified number of days. When the current price deviates from the SMA by the specified percentage in the chosen direction, a position is entered. This approach helps identify potential mean reversion opportunities or trend continuation signals, depending on the chosen parameters."
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/envs', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch environments');
      }
      
      const data = await response.json();
      setEnvironments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStrategy = async (strategyData) => {
    if (!selectedEnvironment) return;
    
    try {
      console.log('Adding strategy:', strategyData); // Debug log
      const response = await fetch(`http://localhost:8000/${encodeURIComponent(selectedEnvironment.name)}/strategies`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strategyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Add strategy response:', errorData);
        throw new Error(errorData.detail || 'Failed to add strategy');
      }
      
      // Update the selected environment's strategies directly with the new strategy
      setSelectedEnvironment(prev => ({
        ...prev,
        strategies: [...prev.strategies, strategyData.strategy]
      }));
      
      setAddModalOpened(false);
    } catch (err) {
      console.error('Error adding strategy:', err);
      setError(err.message);
    }
  };

  const handleEditStrategy = async (data) => {
    if (!selectedEnvironment || !editingStrategy) return;
    
    try {
      // First delete the old strategy
      const deleteResponse = await fetch(`http://localhost:8000/${encodeURIComponent(selectedEnvironment.name)}/strategies/${encodeURIComponent(editingStrategy.name)}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json().catch(() => null);
        console.error('Delete response:', errorData);
        throw new Error(errorData?.detail || 'Failed to delete old strategy');
      }

      // Then create a new strategy with updated parameters
      const createResponse = await fetch(`http://localhost:8000/${encodeURIComponent(selectedEnvironment.name)}/strategies`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => null);
        console.error('Create response:', errorData);
        throw new Error(errorData?.detail || 'Failed to create updated strategy');
      }
      
      // Update the selected environment's strategies directly
      setSelectedEnvironment(prev => ({
        ...prev,
        strategies: prev.strategies.map(strategy => 
          strategy.name === editingStrategy.name
            ? { ...data.strategy }
            : strategy
        )
      }));
      
      setEditingStrategy(null);
    } catch (err) {
      console.error('Error updating strategy:', err);
      setError(err.message);
    }
  };

  const handleDeleteStrategy = async () => {
    if (!selectedEnvironment || !strategyToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:8000/${selectedEnvironment.name}/strategies/${strategyToDelete.name}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete strategy');
      }
      
      // Update the selected environment's strategies directly
      setSelectedEnvironment(prev => ({
        ...prev,
        strategies: prev.strategies.filter(strategy => strategy.name !== strategyToDelete.name)
      }));
      
      setDeleteModalOpened(false);
      setStrategyToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRunBacktest = async (envName) => {
    try {
      setRunningBacktests(prev => new Set([...prev, envName]));
      const response = await fetch(`http://localhost:8000/${encodeURIComponent(envName)}/backtest`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Backtest response:', errorData);
        throw new Error(errorData?.detail || 'Failed to run backtest');
      }
      // Show success message
      console.log('Backtest started successfully');
    } catch (err) {
      console.error('Error running backtest:', err);
      setError(err.message);
    } finally {
      setRunningBacktests(prev => {
        const next = new Set(prev);
        next.delete(envName);
        return next;
      });
    }
  };

  const getStrategyIcon = (type) => {
    switch (type) {
      case 'momentum':
        return <IconChartLine size={16} />;
      case 'mean_reversion':
        return <IconChartBar size={16} />;
      default:
        return <IconChartLine size={16} />;
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" withBorder>
          <Stack align="center" spacing="md">
            <Title order={2} color="red">Error</Title>
            <Text>{error}</Text>
            <Button onClick={fetchEnvironments}>Retry</Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl" style={{ overflowY: 'auto', height: '100%' }}>
      <Stack spacing="xl">
        <Group justify="space-between">
          <Group>
            <ActionIcon onClick={onBack} size="lg" variant="subtle">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Strategies</Title>
          </Group>
        </Group>

        <Stack spacing="md">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem',
            width: '100%'
          }}>
            {environments
              .filter(env => !selectedEnvironment || env.name === selectedEnvironment.name)
              .map((env) => (
              <Card 
                key={env.name} 
                withBorder 
                p="md"
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedEnvironment?.name === env.name ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
                onClick={() => setSelectedEnvironment(env)}
              >
                <Stack spacing="md" style={{ height: '100%' }}>
                  <Group justify="space-between" align="flex-start">
                    <Group gap="xs">
                      <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                        <IconChartLine size={16} />
                      </ThemeIcon>
                      <div>
                        <Text fw={700} size="lg">{env.name}</Text>
                        <Text size="xs" c="dimmed">
                          {env.start_date} to {env.end_date}
                        </Text>
                      </div>
                    </Group>
                    <Badge size="lg" variant="light">{env.strategies.length} strategies</Badge>
                  </Group>
                  
                  <Divider />
                  
                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>Stocks:</Text>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '4px',
                      minHeight: '32px'
                    }}>
                      {env.stocks.map((stock) => (
                        <Badge 
                          key={stock} 
                          size="sm" 
                          variant="filled" 
                          color="blue"
                          style={{ 
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {stock}
                        </Badge>
                      ))}
                    </div>
                  </Stack>

                  <Button
                    variant="filled"
                    color="yellow"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunBacktest(env.name);
                    }}
                  >
                    Run Backtest
                  </Button>
                </Stack>
              </Card>
            ))}
            {environments.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No environments found. Create an environment first.
              </Text>
            )}
          </div>
        </Stack>

        {selectedEnvironment && (
          <Stack spacing="md">
            <Group justify="space-between">
              <Group>
                <ActionIcon 
                  onClick={() => setSelectedEnvironment(null)} 
                  size="lg" 
                  variant="subtle"
                >
                  <IconArrowBack size={20} />
                </ActionIcon>
                <Title order={3}>Strategies for {selectedEnvironment.name}</Title>
              </Group>
              <Button 
                leftSection={<IconPlus size={16} />}
                onClick={() => setAddModalOpened(true)}
              >
                Add Strategy
              </Button>
            </Group>

            <Stack spacing="md">
              {selectedEnvironment.strategies.map((strategy) => (
                <Card key={strategy.name} withBorder p="md">
                  <Group justify="space-between">
                    <Group>
                      <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                        {getStrategyIcon(strategy.type)}
                      </ThemeIcon>
                      <div>
                        <Text fw={500}>{strategy.name}</Text>
                        <Text size="xs" c="dimmed">{strategy.type}</Text>
                      </div>
                    </Group>
                    <Group gap="xs">
                      <ThemeIcon 
                        size="lg" 
                        color="blue" 
                        variant="light"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditingStrategy(strategy)}
                      >
                        <IconPencil size={20} />
                      </ThemeIcon>
                      <ThemeIcon 
                        size="lg" 
                        color="red" 
                        variant="light"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setStrategyToDelete(strategy);
                          setDeleteModalOpened(true);
                        }}
                      >
                        <IconTrash size={20} />
                      </ThemeIcon>
                    </Group>
                  </Group>
                  
                  <Divider my="sm" />
                  
                  <Grid>
                    <Grid.Col span={12}>
                      <Text size="sm" fw={500}>Parameters:</Text>
                      <Text size="sm">
                        {strategy.type === 'PercentageSMAStrategy' && 
                          `days: ${strategy.days}, percentage_change: ${strategy.percentage_change}%, direction: ${strategy.direction}, position_type: ${strategy.position_type}`}
                        {strategy.type === 'RSIStrategy' && 
                          `period: ${strategy.period}, rsi_threshold: ${strategy.rsi_threshold}, position_type: ${strategy.position_type}`}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
              {selectedEnvironment.strategies.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">
                  No strategies found. Add a strategy to get started.
                </Text>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>

      <StrategyModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        onSubmit={handleAddStrategy}
      />

      <EditStrategyModal
        opened={!!editingStrategy}
        onClose={() => setEditingStrategy(null)}
        onSubmit={handleEditStrategy}
        strategy={editingStrategy}
      />

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Strategy"
      >
        <Stack spacing="md">
          <Text>
            Are you sure you want to delete the strategy "{strategyToDelete?.name}"?
            This action cannot be undone.
          </Text>
          <Group position="right">
            <Button variant="light" onClick={() => setDeleteModalOpened(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteStrategy}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default StrategiesPage; 