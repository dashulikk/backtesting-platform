import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  Divider
} from '@mantine/core';

const StrategyModal = ({ opened, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      setName('');
      setType('');
      setParameters({});
    }
  }, [opened]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields based on strategy type
      if (type === 'ExampleStrategy' && (!parameters.days || !parameters.n)) {
        throw new Error('Days and N are required for ExampleStrategy');
      }
      if (type === 'ExampleStrategy2' && (!parameters.a || !parameters.b)) {
        throw new Error('Parameters A and B are required for ExampleStrategy2');
      }
      if (type === 'SMAStrategy' && !parameters.days) {
        throw new Error('Days is required for SMA Strategy');
      }

      await onSubmit({
        name,
        type,
        parameters: type === 'ExampleStrategy'
          ? { days: parameters.days, n: parameters.n }
          : type === 'ExampleStrategy2'
          ? { a: parameters.a, b: parameters.b }
          : { days: parameters.days }
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderParameterInputs = () => {
    switch (type) {
      case 'ExampleStrategy':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Days"
              value={parameters.days || 0}
              onChange={(value) => setParameters({ ...parameters, days: value })}
              min={1}
              required
            />
            <NumberInput
              label="N"
              value={parameters.n || 0}
              onChange={(value) => setParameters({ ...parameters, n: value })}
              min={1}
              required
            />
          </Stack>
        );
      case 'ExampleStrategy2':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Parameter A"
              value={parameters.a || 0}
              onChange={(value) => setParameters({ ...parameters, a: value })}
              required
            />
            <NumberInput
              label="Parameter B"
              value={parameters.b || 0}
              onChange={(value) => setParameters({ ...parameters, b: value })}
              required
            />
          </Stack>
        );
      case 'SMAStrategy':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Days"
              value={parameters.days || 0}
              onChange={(value) => setParameters({ ...parameters, days: value })}
              min={1}
              required
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
        <TextInput
          label="Strategy Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Select
          label="Strategy Type"
          value={type}
          onChange={setType}
          data={[
            { value: 'ExampleStrategy', label: 'Example Strategy' },
            { value: 'ExampleStrategy2', label: 'Example Strategy 2' },
            { value: 'SMAStrategy', label: 'SMA Strategy' }
          ]}
          required
        />

        {type && (
          <>
            <Divider />
            <Text weight={500}>Parameters</Text>
            {renderParameterInputs()}
          </>
        )}

        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        <Group position="right" mt="md">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={loading}
            disabled={!name || !type || 
                     (type === 'ExampleStrategy' && (!parameters.days || !parameters.n)) || 
                     (type === 'ExampleStrategy2' && (!parameters.a || !parameters.b)) ||
                     (type === 'SMAStrategy' && !parameters.days)}
          >
            Add Strategy
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default StrategyModal; 