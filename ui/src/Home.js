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
  AppShell,
  Burger,
  Avatar,
  Menu,
  UnstyledButton,
  Divider,
  List,
  Accordion,
  useMantineTheme
} from '@mantine/core';
import { 
  IconPlus,
  IconFolder,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconChartLine,
  IconChartCandle,
  IconChartBar,
  IconCurrencyDollar,
  IconChartArrows,
  IconSettings,
  IconHistory
} from '@tabler/icons-react';
import CreateEnvironmentPage from './components/CreateEnvironmentPage';
import EnvironmentsPage from './components/EnvironmentsPage';
import SimulationsPage from './components/SimulationsPage';

function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case 'environments':
        return (
          <EnvironmentsPage
            onCreateNew={() => setActivePage('create-environment')}
          />
        );
      case 'create-environment':
        return (
          <CreateEnvironmentPage
            onBack={() => setActivePage('environments')}
          />
        );
      case 'simulations':
        return (
          <SimulationsPage
            onBack={() => setActivePage('home')}
          />
        );
      case 'home':
        return (
          <Container size="xl" py="xl">
            <Stack spacing="xl">
              <Paper shadow="sm" p="xl" withBorder>
                <Stack spacing="md">
                  <Title order={1}>Trading Strategy Backtesting</Title>
                  <Text size="lg" color="dimmed">
                    Create, test, and optimize your trading strategies with our powerful backtesting platform.
                  </Text>
                  <Group>
                    <Button 
                      size="lg"
                      onClick={() => setActivePage('environments')}
                      leftSection={<IconPlus size={16} />}
                    >
                      Create Environment
                    </Button>
                  </Group>
                </Stack>
              </Paper>

              <Title order={2}>Platform Features</Title>
              
              <Accordion variant="contained">
                <Accordion.Item value="order-types">
                  <Accordion.Control icon={<IconCurrencyDollar size={20} />}>
                    Order Types
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List spacing="xs">
                      <List.Item>Market Orders - Execute immediately at the current market price</List.Item>
                      <List.Item>Limit Orders - Execute at a specified price or better</List.Item>
                      <List.Item>Stop Orders - Execute when the price reaches a specified level</List.Item>
                      <List.Item>Stop-Loss Orders - Automatically sell when price falls to a specified level</List.Item>
                      <List.Item>Take-Profit Orders - Automatically sell when price rises to a specified level</List.Item>
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="risk-management">
                  <Accordion.Control icon={<IconChartArrows size={20} />}>
                    Risk Management
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List spacing="xs">
                      <List.Item>Position Sizing - Control the size of each trade based on your risk tolerance</List.Item>
                      <List.Item>Stop-Loss Placement - Set automatic stop-losses to limit potential losses</List.Item>
                      <List.Item>Take-Profit Targets - Define profit targets to secure gains</List.Item>
                      <List.Item>Risk-Reward Ratios - Analyze the potential return relative to the risk taken</List.Item>
                      <List.Item>Portfolio Diversification - Test strategies across multiple assets</List.Item>
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="technical-indicators">
                  <Accordion.Control icon={<IconChartLine size={20} />}>
                    Technical Indicators
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List spacing="xs">
                      <List.Item>Moving Averages (SMA, EMA, WMA)</List.Item>
                      <List.Item>Bollinger Bands</List.Item>
                      <List.Item>Relative Strength Index (RSI)</List.Item>
                      <List.Item>MACD (Moving Average Convergence Divergence)</List.Item>
                      <List.Item>Stochastic Oscillator</List.Item>
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Title order={2}>Getting Started</Title>
              
              <Grid>
                <Grid.Col span={4}>
                  <Card shadow="sm" padding="lg" withBorder>
                    <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                      <IconChartBar size={24} />
                    </ThemeIcon>
                    <Text size="lg" weight={500} mt="md">Strategy Testing</Text>
                    <Text size="sm" color="dimmed" mt="sm">
                      Test your trading strategies against historical data to validate their performance.
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Card shadow="sm" padding="lg" withBorder>
                    <ThemeIcon size="xl" radius="md" variant="light" color="green">
                      <IconSettings size={24} />
                    </ThemeIcon>
                    <Text size="lg" weight={500} mt="md">Strategy Optimization</Text>
                    <Text size="sm" color="dimmed" mt="sm">
                      Fine-tune your strategy parameters to find the optimal configuration for maximum returns.
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                  <Card shadow="sm" padding="lg" withBorder>
                    <ThemeIcon size="xl" radius="md" variant="light" color="grape">
                      <IconHistory size={24} />
                    </ThemeIcon>
                    <Text size="lg" weight={500} mt="md">Performance Analysis</Text>
                    <Text size="sm" color="dimmed" mt="sm">
                      Get detailed insights into your strategy's performance with comprehensive analytics.
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </Container>
        );
      default:
        return <Text>Page not found</Text>;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: !opened, mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
            />
            <Title order={3} style={{ cursor: 'pointer' }} onClick={() => setActivePage('home')}>
              Backtesting Platform
            </Title>
          </Group>

          <Menu
            width={200}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton>
                <Group gap={7}>
                  <Avatar radius="xl" size={30}>IM</Avatar>
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    Ivan Makarov
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUser size={14} />}
              >
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                color="red"
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Stack gap="sm">
            <UnstyledButton
              onClick={() => setActivePage('create-environment')}
              py="xs"
              px="md"
              fw={500}
              style={(theme) => ({
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
            >
              <Group>
                <IconPlus size={16} />
                <Text size="sm">New Environment</Text>
              </Group>
            </UnstyledButton>

            <UnstyledButton
              onClick={() => setActivePage('environments')}
              py="xs"
              px="md"
              fw={500}
              style={(theme) => ({
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
            >
              <Group>
                <IconFolder size={16} />
                <Text size="sm">Your Environments</Text>
              </Group>
            </UnstyledButton>

            <UnstyledButton
              onClick={() => setActivePage('simulations')}
              py="xs"
              px="md"
              fw={500}
              style={(theme) => ({
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
            >
              <Group>
                <IconChartLine size={16} />
                <Text size="sm">Your Simulations</Text>
              </Group>
            </UnstyledButton>
          </Stack>

          <Stack gap="xs">
            <Divider />
            <UnstyledButton
              py="xs"
              px="md"
              fw={500}
              style={(theme) => ({
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
            >
              <Group>
                <IconUser size={16} />
                <Text size="sm">Account Settings</Text>
              </Group>
            </UnstyledButton>
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {renderContent()}
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;