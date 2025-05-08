import React from 'react';
import { AppShell, Group, Button, Stack, Avatar, Menu, Text, Title, Card, SimpleGrid } from '@mantine/core';
import { IconHome, IconPlus, IconDatabase, IconChartBar, IconReportAnalytics, IconBook, IconLogout, IconUser } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLink = ({ icon: Icon, label, to, active, ...props }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="subtle"
      leftSection={<Icon size={20} />}
      onClick={() => navigate(to)}
      fullWidth
      style={{
        justifyContent: 'flex-start',
        padding: '10px 16px',
        height: 'auto',
        minHeight: '40px',
        backgroundColor: active ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

const features = [
  {
    title: 'Environments',
    description: 'Create and manage your trading environments with custom stock selections and date ranges.',
    icon: IconDatabase,
    path: '/home/environments',
    button: 'Go to Environments',
  },
  {
    title: 'Strategies',
    description: 'Configure and test different trading strategies with customizable parameters.',
    icon: IconChartBar,
    path: '/home/strategies',
    button: 'Go to Strategies',
  },
  {
    title: 'Strategy Info',
    description: 'Learn about available trading strategies, their parameters, and how they work.',
    icon: IconBook,
    path: '/home/strategy-info',
    button: 'Go to Strategy Info',
  },
  {
    title: 'Backtesting Results',
    description: 'Analyze the performance of your strategies with detailed reports and visualizations.',
    icon: IconReportAnalytics,
    path: '/home/backtesting-results',
    button: 'Go to Backtesting Results',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuth();

  const navigationItems = [
    { path: '/home', label: 'Home' },
    { path: '/create-environment', label: 'New Environment', icon: IconPlus },
    { path: '/environments', label: 'Environments', icon: IconDatabase },
    { path: '/strategies', label: 'Strategies', icon: IconChartBar },
    { path: '/strategy-info', label: 'Strategy Info', icon: IconBook },
    { path: '/backtesting-results', label: 'Backtesting Results', icon: IconReportAnalytics },
  ];

  return (
    <AppShell
      padding="md"
      header={
        <AppShell.Header height={60} p="xs">
          <Group position="apart">
            <div />
            <Group>
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <Button variant="subtle" leftSection={<Avatar color="blue" radius="xl">{username ? username[0].toUpperCase() : <IconUser />}</Avatar>}>
                    <Text size="sm" fw={500}>{username}</Text>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconLogout size={16} />} onClick={logout} color="red">
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </AppShell.Header>
      }
      navbar={
        <AppShell.Navbar p="md">
          <Stack>
            {navigationItems.map((item) => (
              <MainLink
                key={item.path}
                icon={item.icon}
                label={item.label}
                to={item.path}
                active={location.pathname === item.path}
              />
            ))}
          </Stack>
        </AppShell.Navbar>
      }
    >
      <Title order={2} mb="sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconHome size={28} style={{ marginRight: 8 }} />
        Welcome to Backtesting Platform
      </Title>
      <Text mb="lg" c="dimmed">
        Create trading environments, configure strategies, and analyze backtesting results to optimize your trading approach.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {features.map((feature) => (
          <Card key={feature.title} shadow="md" p="lg" radius="md" withBorder>
            <Group mb="md">
              <Avatar color="blue" radius="md">
                <feature.icon size={28} />
              </Avatar>
              <Title order={4} style={{ margin: 0 }}>{feature.title}</Title>
            </Group>
            <Text mb="md">{feature.description}</Text>
            <Button fullWidth color="blue" variant="filled" onClick={() => navigate(feature.path)}>
              {feature.button}
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </AppShell>
  );
};

export default Home; 