import { useState } from 'react';
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
  Badge
} from '@mantine/core';
import {
  IconPlus,
  IconDots,
  IconPencil,
  IconTrash,
  IconChartBar,
  IconArrowLeft
} from '@tabler/icons-react';
import SimulationPage from './SimulationPage';

function SimulationsPage({ onBack }) {
  const [activePage, setActivePage] = useState('list');
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  // Mock data for saved simulations
  const savedSimulations = [
    {
      id: 1,
      name: 'SMA Crossover Strategy',
      description: 'Simple Moving Average crossover strategy on AAPL',
      date: '2024-04-20',
      status: 'completed',
      performance: '+15.3%'
    },
    {
      id: 2,
      name: 'RSI Strategy',
      description: 'RSI-based mean reversion strategy on MSFT',
      date: '2024-04-19',
      status: 'completed',
      performance: '+8.7%'
    },
    {
      id: 3,
      name: 'Dividend Strategy',
      description: 'High dividend yield strategy on blue chips',
      date: '2024-04-18',
      status: 'in_progress',
      performance: 'Running'
    }
  ];

  if (activePage === 'simulation') {
    return <SimulationPage onBack={() => setActivePage('list')} />;
  }

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Group>
            <ActionIcon onClick={onBack} size="lg" variant="subtle">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Your Simulations</Title>
          </Group>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => setActivePage('simulation')}
          >
            New Simulation
          </Button>
        </Group>

        <Grid>
          {savedSimulations.map((simulation) => (
            <Grid.Col key={simulation.id} span={4}>
              <Card shadow="sm" padding="lg" withBorder>
                <Card.Section>
                  <Group position="apart" p="md">
                    <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                      <IconChartBar size={20} />
                    </ThemeIcon>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon>
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item icon={<IconPencil size={14} />}>Edit</Menu.Item>
                        <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Card.Section>

                <Stack spacing="xs">
                  <Text size="lg" weight={500}>
                    {simulation.name}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {simulation.description}
                  </Text>
                  <Group position="apart">
                    <Text size="sm" color="dimmed">
                      Created: {simulation.date}
                    </Text>
                    <Badge
                      color={simulation.status === 'completed' ? 'green' : 'blue'}
                    >
                      {simulation.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </Group>
                  <Text size="sm" weight={500} color={simulation.performance.startsWith('+') ? 'green' : 'blue'}>
                    Performance: {simulation.performance}
                  </Text>
                  <Button
                    variant="light"
                    fullWidth
                    onClick={() => {
                      setSelectedSimulation(simulation);
                      setActivePage('simulation');
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}

export default SimulationsPage; 