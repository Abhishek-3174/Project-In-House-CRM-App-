const redis = require('redis');

// Configure Redis client to connect to the cloud instance
const client = redis.createClient({
  url: 'redis://default:5DatUhldIYohkRwFfbar3CGrdCKu1IzX@redis-14446.c278.us-east-1-4.ec2.redns.redis-cloud.com:14446'
});

// Connect to Redis
client.connect();

// Handle connection events
client.on('connect', () => {
  console.log('Successfully connected to Redis Cloud!');
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Function to generate the next TaskNumber
const getNextTaskNumber = async () => {
  try {
    const nextValue = await client.incr('TaskNumber'); // Increments the value by 1
    return `TASK${String(nextValue).padStart(4, '0')}`; // Format as TASK0001, TASK0002, etc.
  } catch (err) {
    console.error('Error incrementing task number:', err);
    throw err;
  }
};

const getNextCaseNumber = async () => {
    try {
      const nextValue = await client.incr('CaseNumber'); // Increments the value by 1
      return `CASE${String(nextValue).padStart(4, '0')}`; // Format as TASK0001, TASK0002, etc.
    } catch (err) {
      console.error('Error incrementing case number:', err);
      throw err;
    }
  };
  const getNextOrderNumber = async () => {
    try {
      const nextValue = await client.incr('OrderNumber'); // Increments the value by 1
      return `ORDER${String(nextValue).padStart(4, '0')}`; // Format as TASK0001, TASK0002, etc.
    } catch (err) {
      console.error('Error incrementing order number:', err);
      throw err;
    }
  };
  const getNextPaymentNumber = async () => {
    try {
      const nextValue = await client.incr('PaymentNumber'); // Increments the value by 1
      return `PAYMENT-${String(nextValue).padStart(4, '0')}`; // Format as TASK0001, TASK0002, etc.
    } catch (err) {
      console.error('Error incrementing payment number:', err);
      throw err;
    }
  };
module.exports = { getNextTaskNumber,getNextCaseNumber,getNextOrderNumber,getNextPaymentNumber };
