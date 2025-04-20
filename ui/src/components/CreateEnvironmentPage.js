import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  Checkbox,
  TextInput,
  ScrollArea,
  ActionIcon,
  Badge,
  Alert,
  Divider,
  Table,
  Modal
} from '@mantine/core';
import {
  IconArrowLeft,
  IconSearch,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';

function CreateEnvironmentPage({ onBack, onEnvironmentCreated }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [environmentName, setEnvironmentName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);

  // Mock SP500 stocks data - this should be replaced with actual data
  const sp500Stocks = [
    // Technology
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Technology' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Technology' },
    { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
    { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
    // ... add more technology stocks

    // Healthcare
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
    { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
    { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare' },
    { ticker: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },
    // ... add more healthcare stocks

    // Financials
    { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financials' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
    { ticker: 'BAC', name: 'Bank of America Corp.', sector: 'Financials' },
    { ticker: 'WFC', name: 'Wells Fargo & Company', sector: 'Financials' },
    { ticker: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financials' },
    // ... add more financial stocks

    // Consumer Discretionary
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'MCD', name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary' },
    { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer Discretionary' },
    // ... add more consumer stocks

    // ... add more sectors and stocks
  ];

  useEffect(() => {
    // Filter stocks based on search query
    const filtered = sp500Stocks.filter(stock => 
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchQuery]);

  const handleStockSelect = (ticker) => {
    if (selectedStocks.includes(ticker)) {
      setSelectedStocks(selectedStocks.filter(t => t !== ticker));
    } else {
      if (selectedStocks.length < 10) {
        setSelectedStocks([...selectedStocks, ticker]);
      }
    }
  };

  const handleCreateEnvironment = () => {
    setShowNameModal(true);
  };

  const handleSaveEnvironment = () => {
    if (environmentName.trim()) {
      const newEnvironment = {
        id: Date.now(), // Generate a unique ID
        name: environmentName,
        stocks: selectedStocks,
        date: new Date().toISOString().split('T')[0]
      };
      onEnvironmentCreated(newEnvironment);
      onBack(); // Go back to environments page
    }
  };

  const sectors = [...new Set(sp500Stocks.map(stock => stock.sector))];

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Group>
            <ActionIcon onClick={onBack} size="lg" variant="subtle">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Create Environment</Title>
          </Group>
          <Badge size="lg" variant="filled" color={selectedStocks.length === 10 ? 'green' : 'blue'}>
            {selectedStocks.length}/10 Stocks Selected
          </Badge>
        </Group>

        <Paper shadow="sm" p="md" withBorder>
          <Stack spacing="md">
            <TextInput
              placeholder="Search by ticker or company name"
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {selectedStocks.length === 10 && (
              <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                You have reached the maximum number of stocks (10). Unselect some stocks to add different ones.
              </Alert>
            )}

            <Divider />

            <ScrollArea h={600}>
              {sectors.map(sector => (
                <Stack key={sector} spacing="xs" mb="xl">
                  <Title order={3}>{sector}</Title>
                  <Table>
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}></th>
                        <th>Ticker</th>
                        <th>Company Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchQuery ? filteredStocks : sp500Stocks)
                        .filter(stock => stock.sector === sector)
                        .map((stock) => (
                          <tr key={stock.ticker}>
                            <td>
                              <Checkbox
                                checked={selectedStocks.includes(stock.ticker)}
                                onChange={() => handleStockSelect(stock.ticker)}
                                disabled={!selectedStocks.includes(stock.ticker) && selectedStocks.length >= 10}
                              />
                            </td>
                            <td>{stock.ticker}</td>
                            <td>{stock.name}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Stack>
              ))}
            </ScrollArea>
          </Stack>
        </Paper>

        <Group position="right">
          <Button
            variant="light"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateEnvironment}
            disabled={selectedStocks.length === 0}
          >
            Create Environment
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={showNameModal}
        onClose={() => setShowNameModal(false)}
        title="Name Your Environment"
      >
        <Stack spacing="md">
          <TextInput
            label="Environment Name"
            placeholder="Enter a name for your environment"
            value={environmentName}
            onChange={(e) => setEnvironmentName(e.target.value)}
          />
          <Group position="right">
            <Button variant="light" onClick={() => setShowNameModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEnvironment}
              disabled={!environmentName.trim()}
              leftIcon={<IconCheck size={16} />}
            >
              Save Environment
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default CreateEnvironmentPage; 