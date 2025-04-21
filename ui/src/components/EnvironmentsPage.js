import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Grid,
  Card,
  ThemeIcon,
  ActionIcon,
  Menu,
  Badge,
  LoadingOverlay,
  Modal,
  TextInput,
  Accordion
} from '@mantine/core';
import {
  IconArrowLeft,
  IconDots,
  IconPencil,
  IconTrash,
  IconPlus,
  IconCalendar,
  IconCheck
} from '@tabler/icons-react';
import { api } from '../services/api';

function EnvironmentsPage({ onBack, onCreateNew }) {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEnv, setEditingEnv] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStocks, setEditStocks] = useState('');

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEnvironments();
      console.log('Fetched environments:', data);
      setEnvironments(data);
    } catch (err) {
      console.error('Error fetching environments:', err);
      setError(err.message || 'Failed to load environments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const handleDeleteEnvironment = async (envName) => {
    try {
      await api.deleteEnvironment(envName);
      await fetchEnvironments();
    } catch (err) {
      console.error('Error deleting environment:', err);
      setError(err.message || 'Failed to delete environment');
    }
  };

  const handleEditClick = (environment) => {
    setEditingEnv(environment);
    setEditName(environment.name);
    setEditStocks(environment.stocks.join(', '));
  };

  const handleEditSubmit = async () => {
    try {
      const stocks = editStocks.split(',').map(s => s.trim()).filter(Boolean);
      
      if (stocks.length === 0) {
        setError('Please enter valid stock symbols');
        return;
      }

      await api.deleteEnvironment(editingEnv.name);
      
      await api.createEnvironment({
        name: editName,
        stocks: stocks
      });

      setEditingEnv(null);
      await fetchEnvironments();
    } catch (err) {
      console.error('Error updating environment:', err);
      setError(err.message || 'Failed to update environment');
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
            <Title order={2}>Your Environments</Title>
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onCreateNew}
            size="sm"
          >
            New Environment
          </Button>
        </Group>

        {error && (
          <Paper p="md" bg="red.1" c="red.8">
            <Text>{error}</Text>
          </Paper>
        )}

        <div style={{ position: 'relative', minHeight: loading ? '200px' : 'auto' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          
          <Grid>
            {environments.map((environment) => (
              <Grid.Col key={environment.name} span={4}>
                <Card shadow="sm" padding="lg" withBorder>
                  <Card.Section>
                    <Group position="apart" p="md">
                      <ThemeIcon size="lg" color="blue" variant="light">
                        <IconPencil size={20} />
                      </ThemeIcon>
                      <ThemeIcon 
                        size="lg" 
                        color="red" 
                        variant="light"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteEnvironment(environment.name)}
                      >
                        <IconTrash size={20} />
                      </ThemeIcon>
                    </Group>
                  </Card.Section>

                  <Stack spacing="xs">
                    <Text size="lg" weight={500}>
                      {environment.name}
                    </Text>
                    <Text size="sm" color="dimmed">
                      {environment.stocks.length} stocks selected
                    </Text>
                    <Badge variant="light" color="blue">
                      {environment.stocks.join(', ')}
                    </Badge>

                    {environment.simulations && environment.simulations.length > 0 && (
                      <Accordion variant="contained" mt="sm">
                        <Accordion.Item value="simulations">
                          <Accordion.Control>
                            <Group>
                              <IconCalendar size={16} />
                              <Text size="sm">
                                {environment.simulations.length} Simulations
                              </Text>
                            </Group>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <Stack spacing="xs">
                              {environment.simulations.map((sim) => (
                                <Card key={sim.name} withBorder size="sm" padding="xs">
                                  <Text size="sm" weight={500}>{sim.name}</Text>
                                  <Text size="xs" color="dimmed">
                                    {new Date(sim.start_date).toLocaleDateString()} - {new Date(sim.end_date).toLocaleDateString()}
                                  </Text>
                                  <Text size="xs" color="dimmed">
                                    {sim.strategies.length} strategies
                                  </Text>
                                </Card>
                              ))}
                            </Stack>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </Stack>

      <Modal
        opened={editingEnv !== null}
        onClose={() => setEditingEnv(null)}
        title="Edit Environment"
      >
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <Stack spacing="md">
            <TextInput
              label="Environment Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              error={error}
              required
            />
            <TextInput
              label="Stock Symbols"
              value={editStocks}
              onChange={(e) => setEditStocks(e.target.value)}
              description="Enter comma-separated stock symbols (e.g., AAPL, GOOGL, MSFT)"
              required
            />
            <Group position="right">
              <Button variant="light" onClick={() => setEditingEnv(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={!editName.trim() || loading}
                leftIcon={<IconCheck size={16} />}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </div>
      </Modal>
    </Container>
  );
}

export default EnvironmentsPage; 