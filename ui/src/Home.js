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
  IconReportAnalytics,
  IconBook
} from '@tabler/icons-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function MainLink({ icon: Icon, color, label, to, active }) {
  const navigate = useNavigate();
  return (
    <UnstyledButton
      onClick={() => navigate(to)}
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
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const location = useLocation();
  const { username, logout } = useAuth();
  const navigate = useNavigate();

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
                  <Avatar color="blue" radius="xl">{username ? username[0].toUpperCase() : 'U'}</Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {username || 'User'}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {/* Optionally, show email or other info here */}
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
              <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />} onClick={() => { logout(); navigate('/login'); }}>
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
            to="/"
            active={location.pathname === '/'}
          />
          <MainLink
            icon={IconPlus}
            color="blue"
            label="Create Environment"
            to="/create-environment"
            active={location.pathname === '/create-environment'}
          />
          <MainLink
            icon={IconDatabase}
            color="blue"
            label="Environments"
            to="/environments"
            active={location.pathname === '/environments'}
          />
          <MainLink
            icon={IconChartBar}
            color="blue"
            label="Strategies"
            to="/strategies"
            active={location.pathname === '/strategies'}
          />
          <MainLink
            icon={IconBook}
            color="blue"
            label="Strategy Info"
            to="/strategy-info"
            active={location.pathname === '/strategy-info'}
          />
          <MainLink
            icon={IconReportAnalytics}
            color="blue"
            label="Backtesting Results"
            to="/backtesting-results"
            active={location.pathname === '/backtesting-results'}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main style={{ overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Home;