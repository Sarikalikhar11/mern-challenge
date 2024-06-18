const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize Database
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );
    const transactions = response.data;
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);
    res.status(200).send('Database initialize with send data');
  } catch (error) {
    res.status(500).send('Error initializing database');
  }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;
  const start = new Date(`${month} 1,2020`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const query = {
    dateOfSale: { $gte: start, $lt: end },
    $or: [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { price: new RegExp(search, 'i') },
    ],
  };
  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
};

//Get Statistics
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1,2020`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  try {
    const totalSale = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end }, sold: true } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const soldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lt: end },
      sold: true,
    });
    const notSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lt: end },
      sold: false,
    });

    res.status(200).json({
      totalSale: totalSale[0]?.total || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).send('Error fetching statistics');
  }
};

//Get Bar Chart
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1, 2020`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  try {
    const priceRanges = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
          default: '901-above',
          output: { count: { $sum: 1 } },
        },
      },
    ]);
    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data');
  }
};

//Get Pie Chart
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1, 2020`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send('Error fetching pie chart data');
  }
};

//Get All Data

exports.getAllData = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await exports.getTransactions(req, res);
    const statistics = await exports.getStatistics(req, res);
    const barChart = await exports.getBarChart(req, res);
    const pieChart = await exports.getPieChart(req, res);

    res.status(200).json({
      transactions,
      statistics,
      barChart,
      pieChart,
    });
  } catch (error) {
    res.status(500).send('Error fetching all data');
  }
};
