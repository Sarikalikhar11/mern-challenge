import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({
    totalSale: 0,
    soldItems: 0,
    notSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    const response = await axios.get(
      'http://localhost:4800/api/transactions/statistics',
      {
        params: { month },
      }
    );
    setStats(response.data);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Statistics</Card.Title>
        <Card.Text>Total Sale Amount: ${stats.totalSale}</Card.Text>
        <Card.Text>Total Sold Items: {stats.soldItems}</Card.Text>
        <Card.Text>Total Not Sold Items: {stats.notSoldItems}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Statistics;
