import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import { Container, Form } from 'react-bootstrap';

const App = () => {
  const [month, setMonth] = useState('March');

  return (
    <Container>
      <Form.Control
        as="select"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        {[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Form.Control>
      <TransactionsTable month={month} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </Container>
  );
};

export default App;
