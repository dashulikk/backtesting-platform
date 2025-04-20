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
  Badge,
  Modal,
  TextInput,
  Checkbox,
  ScrollArea,
  Table,
  Divider
} from '@mantine/core';
import {
  IconArrowLeft,
  IconDots,
  IconPencil,
  IconTrash,
  IconFolder,
  IconPlus,
  IconSearch
} from '@tabler/icons-react';

function EnvironmentsPage({ onBack, environments, setEnvironments, onCreateNew }) {
  const [editingEnvironment, setEditingEnvironment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);

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

    // Healthcare
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
    { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
    { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare' },
    { ticker: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },

    // Financials
    { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financials' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
    { ticker: 'BAC', name: 'Bank of America Corp.', sector: 'Financials' },
    { ticker: 'WFC', name: 'Wells Fargo & Company', sector: 'Financials' },
    { ticker: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financials' },

    // Consumer Discretionary
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'MCD', name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary' },
    { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer Discretionary' }
  ];

  const handleEditEnvironment = (environment) => {
    setEditingEnvironment(environment);
    setSelectedStocks(environment.stocks);
    setShowEditModal(true);
  };

  const handleDeleteEnvironment = (environmentId) => {
    setEnvironments(environments.filter(env => env.id !== environmentId));
  };

  const handleSaveEdit = () => {
    if (editingEnvironment) {
      setEnvironments(environments.map(env => 
        env.id === editingEnvironment.id 
          ? { ...editingEnvironment, stocks: selectedStocks }
          : env
      ));
      setShowEditModal(false);
      setEditingEnvironment(null);
      setSelectedStocks([]);
    }
  };

  const handleStockSelect = (ticker) => {
    if (selectedStocks.includes(ticker)) {
      setSelectedStocks(selectedStocks.filter(t => t !== ticker));
    } else {
      if (selectedStocks.length < 10) {
        setSelectedStocks([...selectedStocks, ticker]);
      }
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
            <Title order={2}>Your Environments</Title>
          </Group>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={onCreateNew}
          >
            New Environment
          </Button>
        </Group>

        <Grid>
          {environments.map((environment) => (
            <Grid.Col key={environment.id} span={4}>
              <Card shadow="sm" padding="lg" withBorder>
                <Card.Section>
                  <Group position="apart" p="md">
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon>
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item 
                          icon={<IconPencil size={14} />}
                          onClick={() => handleEditEnvironment(environment)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item 
                          color="red" 
                          icon={<IconTrash size={14} />}
                          onClick={() => handleDeleteEnvironment(environment.id)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Card.Section>

                <Stack spacing="xs">
                  <Text size="lg" weight={500}>
                    {environment.name}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {environment.stocks.length} stocks selected
                  </Text>
                  <Text size="sm" color="dimmed">
                    Created: {environment.date}
                  </Text>
                  <Badge variant="light" color="blue">
                    {environment.stocks.join(', ')}
                  </Badge>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>

      <Modal
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Environment"
        size="xl"
      >
        <Stack spacing="md">
          <TextInput
            label="Environment Name"
            value={editingEnvironment?.name || ''}
            onChange={(e) => setEditingEnvironment({
              ...editingEnvironment,
              name: e.target.value
            })}
          />

          <TextInput
            placeholder="Search by ticker or company name"
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Badge size="lg" variant="filled" color={selectedStocks.length === 10 ? 'green' : 'blue'}>
            {selectedStocks.length}/10 Stocks Selected
          </Badge>

          <Divider />

          <ScrollArea h={400}>
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
                    {(searchQuery 
                      ? sp500Stocks.filter(stock => 
                          stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      : sp500Stocks)
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

          <Group position="right">
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default EnvironmentsPage; 