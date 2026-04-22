import dns from 'node:dns';
import mongoose from 'mongoose';

function configureDnsServers() {
  const fallbackDnsServers = ['1.1.1.1', '8.8.8.8'];
  const envDnsServers = process.env.MONGODB_DNS_SERVERS?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);
  const dnsServers = envDnsServers?.length ? envDnsServers : fallbackDnsServers;

  try {
    dns.setServers(dnsServers);
  } catch (error) {
    console.warn('Unable to set custom DNS servers:', error.message);
  }
}

async function connectDB() {
  configureDnsServers();
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });
  console.log('MongoDB connected');
}

export default connectDB;
