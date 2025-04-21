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

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/envs', {
        headers: {
          'Authorization': 'Bearer test-token-for-user1'
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

  const handleAddStrategy = async (strategy) => {
    if (!selectedEnvironment) return;
    
    try {
      const response = await fetch(`http://localhost:8000/${encodeURIComponent(selectedEnvironment.name)}/strategies`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token-for-user1',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy: {
            name: strategy.name,
            type: strategy.type,
            ...strategy.parameters
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Add strategy response:', errorData);
        throw new Error(errorData.detail || 'Failed to add strategy');
      }
      
      // Refresh environments to get the updated data
      fetchEnvironments();
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
          'Authorization': 'Bearer test-token-for-user1'
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
          'Authorization': 'Bearer test-token-for-user1',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => null);
        console.error('Create response:', errorData);
        throw new Error(errorData?.detail || 'Failed to create updated strategy');
      }
      
      // Refresh environments to get the updated data
      await fetchEnvironments();
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
          'Authorization': 'Bearer test-token-for-user1'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete strategy');
      }
      
      // Refresh environments to get the updated data
      fetchEnvironments();
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
          'Authorization': 'Bearer test-token-for-user1'
        }
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
        <Group position="apart">
          <Group>
            <ActionIcon onClick={onBack} size="lg" variant="subtle">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Strategies</Title>
          </Group>
          {!selectedEnvironment && (
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddModalOpened(true)}
              disabled={!selectedEnvironment}
            >
              Add Strategy
            </Button>
          )}
        </Group>

        <Stack spacing="md">
          <Title order={3}>Environments</Title>
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
                  <Group position="apart" align="flex-start">
                    <Group spacing="xs">
                      <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                        <IconChartLine size={16} />
                      </ThemeIcon>
                      <div>
                        <Text weight={700} size="lg">{env.name}</Text>
                        <Text size="xs" color="dimmed">
                          {env.start_date} to {env.end_date}
                        </Text>
                      </div>
                    </Group>
                    <Badge size="lg" variant="light">{env.strategies.length} strategies</Badge>
                  </Group>
                  
                  <Divider />
                  
                  <Stack spacing="xs" style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>Stocks:</Text>
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
              <Text color="dimmed" align="center" py="xl">
                No environments found. Create an environment first.
              </Text>
            )}
          </div>
        </Stack>

        {selectedEnvironment && (
          <Stack spacing="md">
            <Group position="apart">
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
                  <Group position="apart">
                    <Group>
                      <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                        {getStrategyIcon(strategy.type)}
                      </ThemeIcon>
                      <div>
                        <Text weight={500}>{strategy.name}</Text>
                        <Text size="xs" color="dimmed">{strategy.type}</Text>
                      </div>
                    </Group>
                    <Group spacing="xs">
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
                      <Text size="sm" weight={500}>Parameters:</Text>
                      <Text size="sm" style={{ fontFamily: 'monospace' }}>
                        {JSON.stringify(strategy.parameters, null, 2)}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
              {selectedEnvironment.strategies.length === 0 && (
                <Text color="dimmed" align="center" py="xl">
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