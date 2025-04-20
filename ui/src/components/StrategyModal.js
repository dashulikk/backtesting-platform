import { useState } from 'react';
import {
  Modal,
  Title,
  Select,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  Divider,
  Paper
} from '@mantine/core';

const strategyTypes = [
  { value: 'SMA', label: 'Simple Moving Average (SMA)' },
  { value: 'RSI', label: 'Relative Strength Index (RSI)' },
  { value: 'DIVIDENDS', label: 'Dividends Strategy' }
];

const StrategyModal = ({ opened, onClose, onAddStrategy }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [strategyParams, setStrategyParams] = useState({});
  
  // Default parameters for each strategy type
  const defaultParams = {
    SMA: {
      period: 20,
      exposure: 0.5,
      type: 'LONG'
    },
    RSI: {
      period: 14,
      overbought: 70,
      oversold: 30,
      exposure: 0.5,
      type: 'LONG'
    },
    DIVIDENDS: {
      minDividendYield: 3,
      maxPayoutRatio: 75,
      exposure: 0.5,
      type: 'LONG'
    }
  };

  const handleStrategyChange = (value) => {
    setSelectedStrategy(value);
    setStrategyParams(defaultParams[value] || {});
  };

  const handleParamChange = (param, value) => {
    setStrategyParams({
      ...strategyParams,
      [param]: value
    });
  };

  const handleSubmit = () => {
    if (!selectedStrategy) return;
    
    onAddStrategy({
      name: strategyTypes.find(s => s.value === selectedStrategy).label,
      type: strategyParams.type,
      exposure: strategyParams.exposure,
      parameters: { ...strategyParams }
    });
    
    onClose();
  };

  const renderStrategyParams = () => {
    if (!selectedStrategy) return null;
    
    switch (selectedStrategy) {
      case 'SMA':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Period"
              description="Number of days for the moving average"
              value={strategyParams.period}
              onChange={(value) => handleParamChange('period', value)}
              min={1}
              max={200}
            />
            <NumberInput
              label="Exposure"
              description="Portfolio exposure (0-1)"
              value={strategyParams.exposure}
              onChange={(value) => handleParamChange('exposure', value)}
              min={0.01}
              max={1}
              step={0.01}
              precision={2}
            />
            <Select
              label="Strategy Type"
              value={strategyParams.type}
              onChange={(value) => handleParamChange('type', value)}
              data={[
                { value: 'LONG', label: 'Long' },
                { value: 'SHORT', label: 'Short' }
              ]}
            />
          </Stack>
        );
        
      case 'RSI':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Period"
              description="Number of days for RSI calculation"
              value={strategyParams.period}
              onChange={(value) => handleParamChange('period', value)}
              min={1}
              max={100}
            />
            <NumberInput
              label="Overbought Level"
              description="RSI level considered overbought"
              value={strategyParams.overbought}
              onChange={(value) => handleParamChange('overbought', value)}
              min={50}
              max={100}
            />
            <NumberInput
              label="Oversold Level"
              description="RSI level considered oversold"
              value={strategyParams.oversold}
              onChange={(value) => handleParamChange('oversold', value)}
              min={0}
              max={50}
            />
            <NumberInput
              label="Exposure"
              description="Portfolio exposure (0-1)"
              value={strategyParams.exposure}
              onChange={(value) => handleParamChange('exposure', value)}
              min={0.01}
              max={1}
              step={0.01}
              precision={2}
            />
            <Select
              label="Strategy Type"
              value={strategyParams.type}
              onChange={(value) => handleParamChange('type', value)}
              data={[
                { value: 'LONG', label: 'Long' },
                { value: 'SHORT', label: 'Short' }
              ]}
            />
          </Stack>
        );
        
      case 'DIVIDENDS':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Minimum Dividend Yield (%)"
              description="Minimum dividend yield to consider"
              value={strategyParams.minDividendYield}
              onChange={(value) => handleParamChange('minDividendYield', value)}
              min={0.1}
              max={20}
              step={0.1}
              precision={1}
            />
            <NumberInput
              label="Exposure"
              description="Portfolio exposure (0-1)"
              value={strategyParams.exposure}
              onChange={(value) => handleParamChange('exposure', value)}
              min={0.01}
              max={1}
              step={0.01}
              precision={2}
            />
            <Select
              label="Strategy Type"
              value={strategyParams.type}
              onChange={(value) => handleParamChange('type', value)}
              data={[
                { value: 'LONG', label: 'Long' },
                { value: 'SHORT', label: 'Short' }
              ]}
            />
          </Stack>
        );
        
      default:
        return null;
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Add Strategy" 
      size="md"
    >
      <Stack spacing="md">
        <Select
          label="Strategy Type"
          placeholder="Select a strategy"
          data={strategyTypes}
          value={selectedStrategy}
          onChange={handleStrategyChange}
          searchable
        />
        
        {selectedStrategy && (
          <>
            <Divider my="sm" />
            <Title order={4}>Strategy Parameters</Title>
            {renderStrategyParams()}
          </>
        )}
        
        <Group position="right" mt="xl">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedStrategy}
          >
            Add Strategy
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default StrategyModal; 