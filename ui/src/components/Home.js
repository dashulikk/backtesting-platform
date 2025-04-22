import React, { useState } from 'react';
import { AppShell, Header, Group, Button, ThemeIcon, Title, Stack } from '@mantine/core';
import { IconChartLine, IconHome, IconPlus, IconDatabase, IconChartBar, IconReportAnalytics } from '@tabler/icons-react';
import HomePage from './HomePage';
import EnvironmentsPage from './EnvironmentsPage';
import CreateEnvironmentPage from './CreateEnvironmentPage';
import StrategiesPage from './StrategiesPage';
import BacktestingResultsPage from './BacktestingResultsPage';

const Home = () => {
  const [activePage, setActivePage] = useState('home');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={setActivePage} />;
      case 'environments':
        return <EnvironmentsPage onBack={() => setActivePage('home')} />;
      case 'create-environment':
        return <CreateEnvironmentPage onBack={() => setActivePage('environments')} />;
      case 'strategies':
        return <StrategiesPage onBack={() => setActivePage('home')} />;
      case 'backtesting-results':
        return <BacktestingResultsPage onBack={() => setActivePage('home')} />;
      default:
        return <HomePage onNavigate={setActivePage} />;
    }
  };

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
              <Button
                variant={activePage === 'home' ? 'filled' : 'light'}
                onClick={() => setActivePage('home')}
              >
                Home
              </Button>
              <Button
                variant={activePage === 'environments' ? 'filled' : 'light'}
                onClick={() => setActivePage('environments')}
              >
                Environments
              </Button>
              <Button
                variant={activePage === 'strategies' ? 'filled' : 'light'}
                onClick={() => setActivePage('strategies')}
              >
                Strategies
              </Button>
              <Button
                variant={activePage === 'backtesting-results' ? 'filled' : 'light'}
                onClick={() => setActivePage('backtesting-results')}
              >
                Backtesting Results
              </Button>
            </Group>
          </Group>
        </Header>
      }
      navbar={
        <AppShell.Navbar p="md">
          <Stack>
            <MainLink
              icon={IconHome}
              color="blue"
              label="Home"
              onClick={() => setActivePage('home')}
              active={activePage === 'home'}
              style={{ backgroundColor: activePage === 'home' ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }}
            />
            <MainLink
              icon={IconPlus}
              color="blue"
              label="New Environment"
              onClick={() => setActivePage('create-environment')}
              active={activePage === 'create-environment'}
              style={{ backgroundColor: activePage === 'create-environment' ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }}
            />
            <MainLink
              icon={IconDatabase}
              color="blue"
              label="Environments"
              onClick={() => setActivePage('environments')}
              active={activePage === 'environments'}
              style={{ backgroundColor: activePage === 'environments' ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }}
            />
            <MainLink
              icon={IconChartBar}
              color="blue"
              label="Strategies"
              onClick={() => setActivePage('strategies')}
              active={activePage === 'strategies'}
              style={{ backgroundColor: activePage === 'strategies' ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }}
            />
            <MainLink
              icon={IconReportAnalytics}
              color="blue"
              label="Backtesting Results"
              onClick={() => setActivePage('backtesting-results')}
              active={activePage === 'backtesting-results'}
              style={{ backgroundColor: activePage === 'backtesting-results' ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }}
            />
          </Stack>
        </AppShell.Navbar>
      }
    >
      {renderContent()}
    </AppShell>
  );
};

export default Home; 