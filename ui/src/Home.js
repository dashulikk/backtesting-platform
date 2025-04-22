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
  useMantineTheme,
  rem
} from '@mantine/core';
import { 
  IconHome,
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
  IconHistory,
  IconChevronRight,
  IconDatabase,
  IconReportAnalytics
} from '@tabler/icons-react';
import HomePage from './components/HomePage';
import EnvironmentsPage from './components/EnvironmentsPage';
import StrategiesPage from './components/StrategiesPage';
import CreateEnvironmentPage from './components/CreateEnvironmentPage';
import BacktestingResultsPage from './components/BacktestingResultsPage';

function MainLink({ icon: Icon, color, label, onClick, active }) {
  return (
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colors.gray[3],
        backgroundColor: active ? theme.colors.dark[4] : 'transparent',
        '&:hover': {
          backgroundColor: theme.colors.dark[5],
        },
      })}
    >
      <Group>
        <ThemeIcon color={active ? 'blue' : 'gray'} variant="light">
          <Icon style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
        <Text size="sm" c={active ? 'gray.1' : 'gray.3'}>{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export function Home() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={setActivePage} />;
      case 'environments':
        return <EnvironmentsPage onBack={() => setActivePage('home')} onNavigate={setActivePage} />;
      case 'create-environment':
        return <CreateEnvironmentPage onBack={() => setActivePage('environments')} onNavigate={setActivePage} />;
      case 'strategies':
        return <StrategiesPage onBack={() => setActivePage('home')} onNavigate={setActivePage} />;
      case 'backtesting-results':
        return <BacktestingResultsPage onBack={() => setActivePage('home')} />;
      default:
        return <HomePage onNavigate={setActivePage} />;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened(!opened)}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={2}>Backtesting Platform</Title>
          </Group>
          <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            opened={userMenuOpened}
            onChange={setUserMenuOpened}
          >
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">U</Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      User Name
                    </Text>
                    <Text c="dimmed" size="xs">
                      user@example.com
                    </Text>
                  </div>
                  <IconChevronRight style={{ width: rem(16), height: rem(16) }} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <MainLink
            icon={IconHome}
            color="blue"
            label="Home"
            onClick={() => setActivePage('home')}
            active={activePage === 'home'}
          />
          <MainLink
            icon={IconPlus}
            color="blue"
            label="Create Environment"
            onClick={() => setActivePage('create-environment')}
            active={activePage === 'create-environment'}
          />
          <MainLink
            icon={IconDatabase}
            color="blue"
            label="Environments"
            onClick={() => setActivePage('environments')}
            active={activePage === 'environments'}
          />
          <MainLink
            icon={IconChartBar}
            color="blue"
            label="Strategies"
            onClick={() => setActivePage('strategies')}
            active={activePage === 'strategies'}
          />
          <MainLink
            icon={IconReportAnalytics}
            color="blue"
            label="Backtesting Results"
            onClick={() => setActivePage('backtesting-results')}
            active={activePage === 'backtesting-results'}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main style={{ overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
        {renderContent()}
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;