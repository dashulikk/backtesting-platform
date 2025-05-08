import { useState, useEffect, useMemo } from 'react';
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
  Center,
  TextInput,
  MultiSelect,
  NumberInput
} from '@mantine/core';
import { 
  IconPlus, 
  IconTrash, 
  IconPencil, 
  IconChartLine,
  IconArrowLeft
} from '@tabler/icons-react';
import { sp500Stocks } from '../data/sp500stocks';

const EnvironmentsPage = ({ onBack, onNavigate }) => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [environmentToDelete, setEnvironmentToDelete] = useState(null);
  const [editingEnv, setEditingEnv] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStocks, setEditStocks] = useState([]);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const availableStocks = useMemo(() => 
    sp500Stocks.map(stock => ({ 
      value: stock.ticker, 
      label: `${stock.ticker} - ${stock.name}` 
    })),
    []
  );

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
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

  const handleEditEnvironment = async () => {
    if (!editingEnv) return;
    
    try {
      const token = localStorage.getItem('token');
      const createData = {
        name: editName,
        stocks: editStocks,
        start_date: editStartDate,
        end_date: editEndDate
      };
      console.log('Creating new environment with data:', createData);
      
      const editResponse = await fetch(`http://localhost:8000/environments/${encodeURIComponent(editingEnv.name)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(createData),
      });
      
      if (!editResponse.ok) {
        const errorData = await editResponse.json().catch(() => null);
        console.error('Edit response:', errorData);
        throw new Error(errorData?.detail || `Failed to edit environment: ${editResponse.status} ${editResponse.statusText}`);
      }
      
      // Refresh environments to get the updated data
      await fetchEnvironments();
      setEditingEnv(null);
    } catch (err) {
      console.error('Error updating environment:', err);
      setError(err.message);
    }
  };

  const handleDeleteEnvironment = async () => {
    if (!environmentToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/environments/${environmentToDelete.name}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete environment');
      }
      
      // Refresh environments to get the updated data
      fetchEnvironments();
      setDeleteModalOpened(false);
      setEnvironmentToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (env) => {
    setEditingEnv(env);
    setEditName(env.name);
    setEditStocks(env.stocks);
    setEditStartDate(env.start_date);
    setEditEndDate(env.end_date);
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
            <Title order={2}>Environments</Title>
          </Group>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={() => onNavigate('create-environment')}
          >
            New Environment
          </Button>
        </Group>

        <Grid>
          {environments.map((environment) => (
            <Grid.Col key={environment.name} span={4}>
              <Card withBorder p="md" style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
                <Group position="apart" mb="xs">
                  <Group>
                    <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                      <IconChartLine size={16} />
                    </ThemeIcon>
                    <div>
                      <Text weight={500}>{environment.name}</Text>
                      <Text size="xs" color="dimmed">{environment.stocks.join(', ')}</Text>
                    </div>
                  </Group>
                </Group>

                <Group mb="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => openEditModal(environment)}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setEnvironmentToDelete(environment);
                      setDeleteModalOpened(true);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
                
                <Divider mb="xs" />
                
                <Stack spacing="xs" style={{ flex: 1 }}>
                  <Group position="apart">
                    <Text size="sm" weight={500}>Date Range:</Text>
                    <Text size="sm">{environment.start_date} to {environment.end_date}</Text>
                  </Group>
                  <Group position="apart">
                    <Text size="sm" weight={500}>Strategies:</Text>
                    <Badge>{environment.strategies.length}</Badge>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
          {environments.length === 0 && (
            <Grid.Col>
              <Paper p="xl" withBorder>
                <Stack align="center" spacing="md">
                  <Title order={3}>No Environments</Title>
                  <Text color="dimmed">
                    Create your first environment to get started.
                  </Text>
                  <Button 
                    leftSection={<IconPlus size={16} />}
                    onClick={() => onNavigate('create-environment')}
                  >
                    Create Environment
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>
          )}
        </Grid>
      </Stack>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Environment"
      >
        <Stack spacing="md">
          <Text>
            Are you sure you want to delete the environment "{environmentToDelete?.name}"?
            This action cannot be undone.
          </Text>
          <Group position="right">
            <Button variant="light" onClick={() => setDeleteModalOpened(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteEnvironment}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!editingEnv}
        onClose={() => setEditingEnv(null)}
        title="Edit Environment"
      >
        <Stack spacing="md">
          <TextInput
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <MultiSelect
            label="Stocks"
            value={editStocks}
            onChange={setEditStocks}
            data={availableStocks}
            searchable
            maxSelectedValues={10}
            placeholder="Select up to 10 stocks"
            nothingFound="No stocks found"
            maxDropdownHeight={400}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-dark-6)',
                borderColor: 'var(--mantine-color-dark-4)',
              },
              dropdown: {
                backgroundColor: 'var(--mantine-color-dark-6)',
              },
              item: {
                '&[data-selected]': {
                  backgroundColor: 'var(--mantine-color-blue-7)',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-blue-8)',
                  },
                },
                '&[data-hovered]': {
                  backgroundColor: 'var(--mantine-color-dark-5)',
                },
              },
            }}
          />
          <TextInput
            label="Start Date"
            type="date"
            value={editStartDate}
            onChange={(e) => setEditStartDate(e.target.value)}
            required
          />
          <TextInput
            label="End Date"
            type="date"
            value={editEndDate}
            onChange={(e) => setEditEndDate(e.target.value)}
            required
          />
          <Group position="right">
            <Button variant="light" onClick={() => setEditingEnv(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditEnvironment}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default EnvironmentsPage; 