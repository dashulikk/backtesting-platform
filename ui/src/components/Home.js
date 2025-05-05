import React from 'react';
import { AppShell, Header, Group, Button, ThemeIcon, Title, Stack } from '@mantine/core';
import { IconChartLine, IconHome, IconPlus, IconDatabase, IconChartBar, IconReportAnalytics, IconBook } from '@tabler/icons-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const MainLink = ({ icon: Icon, label, to, active, ...props }) => {
  const navigate = useNavigate();
  const { leftIcon, ...rest } = props;
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
      {...rest}
    >
      {label}
    </Button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: IconHome },
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
        <Header height={60} p="xs">
          <Group position="apart">
            <Group>
              <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                <IconChartLine size={20} />
              </ThemeIcon>
              <Title order={3}>Backtesting Platform</Title>
            </Group>
            <Group>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'filled' : 'light'}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Group>
          </Group>
        </Header>
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
      <Outlet />
    </AppShell>
  );
};

export default Home; 