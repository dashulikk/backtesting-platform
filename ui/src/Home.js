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
  AppShellNavbar,
  AppShellHeader,
  Menu,
  UnstyledButton,
  Avatar,
  Divider,
  List,
  Accordion,
  Badge
} from '@mantine/core';
import { 
  IconChartBar, 
  IconSettings, 
  IconHistory, 
  IconArrowRight,
  IconPlus,
  IconFolder,
  IconChartPie,
  IconUser,
  IconLogout,
  IconChevronRight,
  IconChevronLeft,
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
  IconCurrencyDollar,
  IconChartCandle,
  IconChartLine,
  IconChartArrows,
  IconChartDots,
  IconChartArea,
  IconChartBarFilled,
  IconChartPieFilled,
  IconChartBubble,
  IconChartDonut,
  IconChartRadar,
  IconChartScatter,
  IconChartInfographic
} from '@tabler/icons-react';
import SimulationPage from './components/SimulationPage';
import SimulationsPage from './components/SimulationsPage';
import CreateEnvironmentPage from './components/CreateEnvironmentPage';
import EnvironmentsPage from './components/EnvironmentsPage';

function Home() {
  const [activePage, setActivePage] = useState('home');
  const [opened, setOpened] = useState(true);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [environments, setEnvironments] = useState([
    {
      id: 1,
      name: 'Tech Stocks Environment',
      stocks: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'],
      date: '2024-04-20'
    },
    {
      id: 2,
      name: 'Healthcare Portfolio',
      stocks: ['JNJ', 'PFE', 'ABBV', 'MRK', 'ABT'],
      date: '2024-04-19'
    }
  ]);

  const handleEnvironmentCreated = (newEnvironment) => {
    setEnvironments([...environments, newEnvironment]);
  };

  if (activePage === 'simulation') {
    return <SimulationPage 
      onBack={() => setActivePage('home')} 
      environments={environments}
    />;
  }

  if (activePage === 'simulations') {
    return <SimulationsPage onBack={() => setActivePage('home')} />;
  }

  if (activePage === 'create-environment') {
    return <CreateEnvironmentPage 
      onBack={() => setActivePage('environments')} 
      onEnvironmentCreated={(newEnvironment) => {
        setEnvironments([...environments, newEnvironment]);
        setActivePage('environments');
      }}
    />;
  }

  if (activePage === 'environments') {
    return <EnvironmentsPage 
      onBack={() => setActivePage('home')} 
      environments={environments}
      setEnvironments={setEnvironments}
      onCreateNew={() => setActivePage('create-environment')}
    />;
  }

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      header={{
        height: 60
      }}
    >
      <AppShell.Navbar p="md">
        <Stack spacing="md">
          <Title order={4}>Backtesting Platform</Title>
          <Divider />
          
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            })}
            onClick={() => setActivePage('create-environment')}
          >
            <Group>
              <IconPlus size={20} />
              <Text size="sm">Create Environment</Text>
            </Group>
          </UnstyledButton>
          
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            })}
            onClick={() => setActivePage('environments')}
          >
            <Group>
              <IconFolder size={20} />
              <Text size="sm">Your Environments</Text>
            </Group>
          </UnstyledButton>
          
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            })}
            onClick={() => setActivePage('simulations')}
          >
            <Group>
              <IconChartPie size={20} />
              <Text size="sm">Your Simulations</Text>
            </Group>
          </UnstyledButton>
          
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            })}
          >
            <Group>
              <IconUser size={20} />
              <Text size="sm">Account Settings</Text>
            </Group>
          </UnstyledButton>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Header p="md">
        <Group position="apart">
          <Button variant="subtle" onClick={() => setOpened((o) => !o)}>
            {opened ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
          </Button>
          
          <Menu
            opened={userMenuOpened}
            onChange={setUserMenuOpened}
            position="bottom-end"
            width={200}
          >
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">IM</Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                      Ivan Makarov
                    </Text>
                    <Text color="dimmed" size="xs">
                      ivan@example.com
                    </Text>
                  </div>
                  {userMenuOpened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </Group>
              </UnstyledButton>
            </Menu.Target>
            
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
              <Menu.Item icon={<IconSettings size={14} />}>Account Settings</Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item color="red" icon={<IconLogout size={14} />}>Sign Out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
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
                    onClick={() => setActivePage('simulation')}
                    rightSection={<IconArrowRight size={16} />}
                  >
                    Start Backtesting
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
                  <List spacing="xs" mt="md">
                    <List.Item>Market Orders - Execute immediately at the current market price</List.Item>
                    <List.Item>Limit Orders - Execute at a specified price or better</List.Item>
                    <List.Item>Stop Orders - Execute when the price reaches a specified level</List.Item>
                    <List.Item>Stop-Loss Orders - Automatically sell when price falls to a specified level</List.Item>
                    <List.Item>Take-Profit Orders - Automatically sell when price rises to a specified level</List.Item>
                    <List.Item>Trailing Stop Orders - Adjust the stop price as the market moves in your favor</List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="risk-management">
                <Accordion.Control icon={<IconChartArrows size={20} />}>
                  Risk Management
                </Accordion.Control>
                <Accordion.Panel>
                  <List spacing="xs" mt="md">
                    <List.Item>Position Sizing - Control the size of each trade based on your risk tolerance</List.Item>
                    <List.Item>Stop-Loss Placement - Set automatic stop-losses to limit potential losses</List.Item>
                    <List.Item>Take-Profit Targets - Define profit targets to secure gains</List.Item>
                    <List.Item>Risk-Reward Ratios - Analyze the potential return relative to the risk taken</List.Item>
                    <List.Item>Portfolio Diversification - Test strategies across multiple assets</List.Item>
                    <List.Item>Drawdown Limits - Set maximum acceptable drawdown levels</List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="technical-indicators">
                <Accordion.Control icon={<IconChartLine size={20} />}>
                  Technical Indicators
                </Accordion.Control>
                <Accordion.Panel>
                  <Grid mt="md">
                    <Grid.Col span={6}>
                      <List spacing="xs">
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartLine size={16} />
                            <Text>Moving Averages (SMA, EMA, WMA)</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartBar size={16} />
                            <Text>Bollinger Bands</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartPie size={16} />
                            <Text>Relative Strength Index (RSI)</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartDots size={16} />
                            <Text>MACD (Moving Average Convergence Divergence)</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartArea size={16} />
                            <Text>Stochastic Oscillator</Text>
                          </Group>
                        </List.Item>
                      </List>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <List spacing="xs">
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartBubble size={16} />
                            <Text>Average Directional Index (ADX)</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartDonut size={16} />
                            <Text>On-Balance Volume (OBV)</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartRadar size={16} />
                            <Text>Parabolic SAR</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartScatter size={16} />
                            <Text>Ichimoku Cloud</Text>
                          </Group>
                        </List.Item>
                        <List.Item>
                          <Group spacing="xs">
                            <IconChartInfographic size={16} />
                            <Text>Fibonacci Retracement</Text>
                          </Group>
                        </List.Item>
                      </List>
                    </Grid.Col>
                  </Grid>
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="chart-types">
                <Accordion.Control icon={<IconChartCandle size={20} />}>
                  Chart Types
                </Accordion.Control>
                <Accordion.Panel>
                  <List spacing="xs" mt="md">
                    <List.Item>Line Charts - Simple visualization of price movement</List.Item>
                    <List.Item>Candlestick Charts - Show open, high, low, and close prices</List.Item>
                    <List.Item>Bar Charts - Display price ranges with vertical bars</List.Item>
                    <List.Item>Area Charts - Emphasize volume and magnitude of changes</List.Item>
                    <List.Item>Renko Charts - Focus on price movement without time consideration</List.Item>
                    <List.Item>Point and Figure Charts - Filter out small price movements</List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion.Item>
              
              <Accordion.Item value="analysis-tools">
                <Accordion.Control icon={<IconChartBar size={20} />}>
                  Analysis Tools
                </Accordion.Control>
                <Accordion.Panel>
                  <List spacing="xs" mt="md">
                    <List.Item>Performance Metrics - Sharpe ratio, Sortino ratio, alpha, beta</List.Item>
                    <List.Item>Drawdown Analysis - Maximum drawdown, recovery periods</List.Item>
                    <List.Item>Trade Statistics - Win rate, profit factor, average win/loss</List.Item>
                    <List.Item>Equity Curve - Visual representation of account growth</List.Item>
                    <List.Item>Monte Carlo Simulation - Probability analysis of strategy performance</List.Item>
                    <List.Item>Optimization Tools - Find optimal parameters for your strategy</List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            
            <Title order={2}>Getting Started</Title>
            
            <Grid>
              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" withBorder>
                  <Card.Section>
                    <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                      <IconChartBar size={24} />
                    </ThemeIcon>
                  </Card.Section>
                  <Text size="lg" weight={500} mt="md">Strategy Testing</Text>
                  <Text size="sm" color="dimmed" mt="sm">
                    Test your trading strategies against historical data to validate their performance.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" withBorder>
                  <Card.Section>
                    <ThemeIcon size="xl" radius="md" variant="light" color="green">
                      <IconSettings size={24} />
                    </ThemeIcon>
                  </Card.Section>
                  <Text size="lg" weight={500} mt="md">Strategy Optimization</Text>
                  <Text size="sm" color="dimmed" mt="sm">
                    Fine-tune your strategy parameters to find the optimal configuration for maximum returns.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" withBorder>
                  <Card.Section>
                    <ThemeIcon size="xl" radius="md" variant="light" color="grape">
                      <IconHistory size={24} />
                    </ThemeIcon>
                  </Card.Section>
                  <Text size="lg" weight={500} mt="md">Performance Analysis</Text>
                  <Text size="sm" color="dimmed" mt="sm">
                    Get detailed insights into your strategy's performance with comprehensive analytics.
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;