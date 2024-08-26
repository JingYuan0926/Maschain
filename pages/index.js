import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [walletFormData, setWalletFormData] = useState({
    name: '',
    email: '',
    ic: '',
    phone: '',
    wallet_name: ''
  });
  const [mintFormData, setMintFormData] = useState({
    wallet_address: '',
    to: '',
    contract_address: '',
    name: '',
    description: '',
    callback_url: ''
  });
  const [transactionFormData, setTransactionFormData] = useState({
    wallet_address: '',
    contract_address: '',
    filter: 'to|from',
    status: ''
  });
  const [certificateFormData, setCertificateFormData] = useState({
    from: '',
    to: '',
    contract_address: '',
    tx_id: '',
    status: 'success'
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState(null);
  const [certificates, setCertificates] = useState(null);

  const handleWalletInputChange = (e) => {
    const { name, value } = e.target;
    setWalletFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMintInputChange = (e) => {
    const { name, value } = e.target;
    setMintFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCertificateInputChange = (e) => {
    const { name, value } = e.target;
    setCertificateFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const createUserWallet = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post(
        'https://service-testnet.maschain.com/api/wallet/create-user',
        walletFormData,
        {
          headers: {
            'client_id': '1e8dbcc087be49d0d271a2001f8d67e685ce4661e11e96e51dec70c3ddaf056d',
            'client_secret': 'sk_66d96c8ce3486d1f6f681bd974dfa2ff4d4c98e97949cf3f24e5486bfd3fa21e',
            'content-type': 'application/json'
          }
        }
      );
      
      console.log('Wallet Creation API Response:', response.data);
      
      setMessage('User wallet created successfully. Check the console for details.');
      setWalletFormData({
        name: '',
        email: '',
        ic: '',
        phone: '',
        wallet_name: ''
      });
    } catch (err) {
      console.error('Error creating user wallet:', err.response?.data || err.message);
      setMessage('Error creating user wallet. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const mintCertificate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      Object.keys(mintFormData).forEach(key => {
        formData.append(key, mintFormData[key]);
      });
      formData.append('file', file);
      formData.append('attributes', JSON.stringify([]));

      const response = await axios.post(
        'https://service-testnet.maschain.com/api/certificate/mint-certificate',
        formData,
        {
          headers: {
            'client_id': '1e8dbcc087be49d0d271a2001f8d67e685ce4661e11e96e51dec70c3ddaf056d',
            'client_secret': 'sk_66d96c8ce3486d1f6f681bd974dfa2ff4d4c98e97949cf3f24e5486bfd3fa21e',
            'content-type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Mint Certificate API Response:', response.data);
      
      setMessage('Certificate minted successfully. Check the console for details.');
      setMintFormData({
        wallet_address: '',
        to: '',
        contract_address: '',
        name: '',
        description: '',
        callback_url: ''
      });
      setFile(null);
    } catch (err) {
      console.error('Error minting certificate:', err.response?.data || err.message);
      setMessage('Error minting certificate. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCertificateTransactions = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.get(
        'https://service-testnet.maschain.com/api/token/get-certificate-transaction',
        {
          params: transactionFormData,
          headers: {
            'client_id': '9b16ae5638534ae1961fb370f874b6cc',
            'client_secret': 'sk_9b16ae5638534ae1961fb370f874b6cc',
            'content-type': 'application/json'
          }
        }
      );
      
      console.log('Get Certificate Transactions API Response:', response.data);
      
      setTransactions(response.data.result);
      setMessage('Transactions fetched successfully. Check the results below.');
    } catch (err) {
      console.error('Error fetching certificate transactions:', err.response?.data || err.message);
      setMessage('Error fetching certificate transactions. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCertificate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.get(
        'https://service-testnet.maschain.com/api/certificate/get-certificate',
        {
          params: certificateFormData,
          headers: {
            'client_id': '1e8dbcc087be49d0d271a2001f8d67e685ce4661e11e96e51dec70c3ddaf056d',
            'client_secret': 'sk_66d96c8ce3486d1f6f681bd974dfa2ff4d4c98e97949cf3f24e5486bfd3fa21e',
            'content-type': 'application/json'
          }
        }
      );
      
      console.log('Get Certificate API Response:', response.data);
      
      setCertificates(response.data.result);
      setMessage('Certificates fetched successfully. Check the results below.');
      console.log(response.data.result);
    } catch (err) {
      console.error('Error fetching certificates:', err.response?.data || err.message);
      setMessage('Error fetching certificates. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create User Wallet</h1>
      <form onSubmit={createUserWallet} className="space-y-4 mb-8">
        <input
          type="text"
          name="name"
          value={walletFormData.name}
          onChange={handleWalletInputChange}
          placeholder="Name"
          className="border p-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={walletFormData.email}
          onChange={handleWalletInputChange}
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="ic"
          value={walletFormData.ic}
          onChange={handleWalletInputChange}
          placeholder="IC"
          className="border p-2 w-full"
          required
        />
        <input
          type="tel"
          name="phone"
          value={walletFormData.phone}
          onChange={handleWalletInputChange}
          placeholder="Phone"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="wallet_name"
          value={walletFormData.wallet_name}
          onChange={handleWalletInputChange}
          placeholder="Wallet Name (Optional)"
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create User Wallet'}
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">Mint NFT Certificate</h1>
      <form onSubmit={mintCertificate} className="space-y-4">
        <input
          type="text"
          name="wallet_address"
          value={mintFormData.wallet_address}
          onChange={handleMintInputChange}
          placeholder="Wallet Address (Owner)"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="to"
          value={mintFormData.to}
          onChange={handleMintInputChange}
          placeholder="To (Receiver)"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="contract_address"
          value={mintFormData.contract_address}
          onChange={handleMintInputChange}
          placeholder="Contract Address"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="name"
          value={mintFormData.name}
          onChange={handleMintInputChange}
          placeholder="Certificate Name"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="description"
          value={mintFormData.description}
          onChange={handleMintInputChange}
          placeholder="Description"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="callback_url"
          value={mintFormData.callback_url}
          onChange={handleMintInputChange}
          placeholder="Callback URL"
          className="border p-2 w-full"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Minting...' : 'Mint Certificate'}
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">Get Certificate Transactions</h1>
      <form onSubmit={getCertificateTransactions} className="space-y-4 mb-8">
        <input
          type="text"
          name="wallet_address"
          value={transactionFormData.wallet_address}
          onChange={handleTransactionInputChange}
          placeholder="Wallet Address"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="contract_address"
          value={transactionFormData.contract_address}
          onChange={handleTransactionInputChange}
          placeholder="Contract Address"
          className="border p-2 w-full"
          required
        />
        <select
          name="filter"
          value={transactionFormData.filter}
          onChange={handleTransactionInputChange}
          className="border p-2 w-full"
          required
        >
          <option value="to|from">To | From</option>
          <option value="to">To</option>
          <option value="from">From</option>
        </select>
        <select
          name="status"
          value={transactionFormData.status}
          onChange={handleTransactionInputChange}
          className="border p-2 w-full"
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="fail">Fail</option>
        </select>
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Fetching...' : 'Get Transactions'}
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">Get Certificate</h1>
      <form onSubmit={getCertificate} className="space-y-4 mb-8">
        <input
          type="text"
          name="from"
          value={certificateFormData.from}
          onChange={handleCertificateInputChange}
          placeholder="From Address"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="to"
          value={certificateFormData.to}
          onChange={handleCertificateInputChange}
          placeholder="To Address"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="contract_address"
          value={certificateFormData.contract_address}
          onChange={handleCertificateInputChange}
          placeholder="Contract Address"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="tx_id"
          value={certificateFormData.tx_id}
          onChange={handleCertificateInputChange}
          placeholder="Transaction ID"
          className="border p-2 w-full"
        />
        <select
          name="status"
          value={certificateFormData.status}
          onChange={handleCertificateInputChange}
          className="border p-2 w-full"
        >
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="fail">Fail</option>
        </select>
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Fetching...' : 'Get Certificate'}
        </button>
      </form>

      {transactions && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Transaction Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border p-2">To</th>
                  <th className="border p-2">From</th>
                  <th className="border p-2">Block Number</th>
                  <th className="border p-2">Transaction Hash</th>
                  <th className="border p-2">Method</th>
                  <th className="border p-2">Token Name</th>
                  <th className="border p-2">Timestamp</th>
                  </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="border p-2">{tx.to}</td>
                    <td className="border p-2">{tx.from}</td>
                    <td className="border p-2">{tx.blockNumber}</td>
                    <td className="border p-2">{tx.transactionHash.substring(0, 10)}...</td>
                    <td className="border p-2">{tx.method}</td>
                    <td className="border p-2">{tx.token.name}</td>
                    <td className="border p-2">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {certificates && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Certificate Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border p-2">From Wallet</th>
                  <th className="border p-2">To Wallet</th>
                  <th className="border p-2">Is Mint</th>
                  <th className="border p-2">Block Number</th>
                  <th className="border p-2">NFT Token ID</th>
                  <th className="border p-2">Transaction Hash</th>
                  <th className="border p-2">Certificate File</th>
                  <th className="border p-2">Created At</th>
                  <th className="border p-2">Token Info</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <tr key={index}>
                    <td className="border p-2">{cert.from_wallet}</td>
                    <td className="border p-2">{cert.to_wallet}</td>
                    <td className="border p-2">{cert.is_mint ? 'Yes' : 'No'}</td>
                    <td className="border p-2">{cert.blockNumber}</td>
                    <td className="border p-2">{cert.nft_token_id}</td>
                    <td className="border p-2">{cert.transactionHash.substring(0, 10)}...</td>
                    <td className="border p-2">{cert.certificate_file || 'N/A'}</td>
                    <td className="border p-2">{new Date(cert.created_at).toLocaleString()}</td>
                    <td className="border p-2">
                      <p>Name: {cert.token.name}</p>
                      <p>Symbol: {cert.token.symbol}</p>
                      <p>Contract: {cert.token.contract_address.substring(0, 10)}...</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100' : 'bg-green-100'}`}>
          <p className={message.includes('Error') ? 'text-red-700' : 'text-green-700'}>{message}</p>
        </div>
      )}
    </div>
  );
}