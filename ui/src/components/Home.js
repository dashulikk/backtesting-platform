import React, { useState } from 'react';
import { AppShell, Header, Group, Button, ThemeIcon, Title } from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';
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
    >
      {renderContent()}
    </AppShell>
  );
};

export default Home; 