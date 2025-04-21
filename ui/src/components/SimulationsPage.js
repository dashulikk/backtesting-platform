import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Select,
  TextInput,
  LoadingOverlay,
  ActionIcon,
  ThemeIcon,
  Card,
  Badge,
  ScrollArea
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconPlus,
  IconPencil,
  IconTrash,
  IconCalendar
} from '@tabler/icons-react';
import { api } from '../services/api.js';

function SimulationsPage({ onBack }) {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState('');
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [strategyType, setStrategyType] = useState('ExampleStrategy');
  const [strategyName, setStrategyName] = useState('');
  const [days, setDays] = useState('20');
  const [n, setN] = useState('5');
  const [a, setA] = useState('0.5');
  const [b, setB] = useState('2.0');

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      const data = await api.getEnvironments();
      setEnvironments(data);
      if (data.length > 0 && !selectedEnv) {
        setSelectedEnv(data[0].name);
      }
    } catch (err) {
      console.error('Error fetching environments:', err);
      setError(err.message || 'Failed to load environments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimulations = async (envName) => {
    if (!envName) return;
    try {
      setLoading(true);
      setError(null);
      const env = await api.getEnvironments();
      const currentEnv = env.find(e => e.name === envName);
      if (currentEnv) {
        setSimulations(currentEnv.simulations || []);
        console.log('Fetched simulations:', currentEnv.simulations);
      }
    } catch (err) {
      console.error('Error fetching simulations:', err);
      setError(err.message || 'Failed to load simulations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  useEffect(() => {
    if (selectedEnv) {
      fetchSimulations(selectedEnv);
    }
  }, [selectedEnv]);

  const handleCreateSimulation = async () => {
    if (!selectedEnv || !name || !startDate || !endDate || !strategyName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let strategy;
      if (strategyType === 'ExampleStrategy') {
        strategy = {
          name: strategyName,
          type: 'ExampleStrategy',
          days: parseInt(days) || 0,
          n: parseInt(n) || 0
        };
      } else {
        strategy = {
          name: strategyName,
          type: 'ExampleStrategy2',
          a: parseFloat(a) || 0,
          b: parseFloat(b) || 0
        };
      }

      const simulationData = {
        name,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        strategies: [strategy]
      };

      console.log('Creating simulation:', {
        envName: selectedEnv,
        data: simulationData
      });

      await api.createSimulation(selectedEnv, simulationData);
      console.log('Simulation created successfully');

      // Reset form
      setName('');
      setStartDate(null);
      setEndDate(null);
      setStrategyName('');
      setDays('20');
      setN('5');
      setA('0.5');
      setB('2.0');
      
      // Refresh data
      await fetchSimulations(selectedEnv);
    } catch (err) {
      console.error('Error creating simulation:', err);
      setError(err.message || 'Failed to create simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSimulation = async (simulationName) => {
    try {
      setLoading(true);
      console.log('Deleting simulation:', {
        envName: selectedEnv,
        simulationName
      });
      await api.deleteSimulation(selectedEnv, simulationName);
      console.log('Simulation deleted successfully');
      await fetchSimulations(selectedEnv);
    } catch (err) {
      console.error('Error deleting simulation:', err);
      setError(err.message || 'Failed to delete simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl" h="100vh" p={0}>
      <ScrollArea h="100vh" p="xl">
        <Stack spacing="xl">
          <Group position="apart">
            <Group>
              <ActionIcon onClick={onBack} size="lg" variant="subtle">
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Title order={2}>Your Simulations</Title>
            </Group>
          </Group>

          {error && (
            <Paper p="md" bg="red.1" c="red.8">
              <Text>{error}</Text>
            </Paper>
          )}

          <Paper p="xl" withBorder>
            <Stack spacing="md">
              <Title order={3}>Create New Simulation</Title>
              
              <Select
                label="Select Environment"
                placeholder="Choose environment"
                value={selectedEnv}
                onChange={setSelectedEnv}
                data={environments.map(env => ({ value: env.name, label: env.name }))}
                required
              />

              <TextInput
                label="Simulation Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Group grow>
                <DateInput
                  label="Start Date"
                  placeholder="Select start date"
                  value={startDate}
                  onChange={setStartDate}
                  required
                />
                <DateInput
                  label="End Date"
                  placeholder="Select end date"
                  value={endDate}
                  onChange={setEndDate}
                  required
                />
              </Group>

              <Select
                label="Strategy Type"
                value={strategyType}
                onChange={setStrategyType}
                data={[
                  { value: 'ExampleStrategy', label: 'Example Strategy' },
                  { value: 'ExampleStrategy2', label: 'Example Strategy 2' }
                ]}
                required
              />

              <TextInput
                label="Strategy Name"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                required
              />

              {strategyType === 'ExampleStrategy' ? (
                <Group grow>
                  <TextInput
                    label="Days"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    required
                  />
                  <TextInput
                    label="N"
                    type="number"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    required
                  />
                </Group>
              ) : (
                <Group grow>
                  <TextInput
                    label="A"
                    type="number"
                    step="0.1"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    required
                  />
                  <TextInput
                    label="B"
                    type="number"
                    step="0.1"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    required
                  />
                </Group>
              )}

              <Button
                onClick={handleCreateSimulation}
                disabled={!selectedEnv || !name || !startDate || !endDate || !strategyName}
                leftSection={<IconPlus size={16} />}
              >
                Create Simulation
              </Button>
            </Stack>
          </Paper>

          <Title order={3}>Existing Simulations</Title>

          <div style={{ position: 'relative', minHeight: loading ? '200px' : 'auto' }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            
            <Stack spacing="md">
              {simulations.map((simulation) => (
                <Card key={simulation.name} shadow="sm" padding="lg" withBorder>
                  <Group position="apart">
                    <Stack spacing="xs">
                      <Text size="lg" weight={500}>
                        {simulation.name}
                      </Text>
                      <Group spacing="xs">
                        <Badge variant="light" color="blue">
                          <Group spacing={4}>
                            <IconCalendar size={14} />
                            <Text>
                              {new Date(simulation.start_date).toLocaleDateString()} - {new Date(simulation.end_date).toLocaleDateString()}
                            </Text>
                          </Group>
                        </Badge>
                      </Group>
                    </Stack>
                    <ThemeIcon
                      size="lg"
                      color="red"
                      variant="light"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteSimulation(simulation.name)}
                    >
                      <IconTrash size={20} />
                    </ThemeIcon>
                  </Group>

                  <Stack mt="md" spacing="xs">
                    <Text size="sm" weight={500}>Strategies:</Text>
                    {simulation.strategies.map((strategy, index) => (
                      <Paper key={index} p="xs" withBorder>
                        <Group position="apart">
                          <Stack spacing={0}>
                            <Text size="sm" weight={500}>{strategy.name}</Text>
                            <Text size="xs" color="dimmed">{strategy.type}</Text>
                          </Stack>
                          <Group>
                            {strategy.type === 'ExampleStrategy' ? (
                              <>
                                <Badge variant="dot">Days: {strategy.days}</Badge>
                                <Badge variant="dot">N: {strategy.n}</Badge>
                              </>
                            ) : (
                              <>
                                <Badge variant="dot">A: {strategy.a}</Badge>
                                <Badge variant="dot">B: {strategy.b}</Badge>
                              </>
                            )}
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </div>
        </Stack>
      </ScrollArea>
    </Container>
  );
}

export default SimulationsPage; 