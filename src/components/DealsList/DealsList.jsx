import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './DealsList.css';

const DealsList = ({ customerID }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const endpoint = process.env.REACT_APP_DEALS_API_ENDPOINT;
        const response = await axios.get(
          `${endpoint}?customerID=${customerID}`
        );
        const customerDeals = response.data.deals;
        setDeals(customerDeals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [customerID]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="deals-container">
      <h2>Deals for User {customerID}</h2>
      <ul className="deals-list">
        {deals?.map((deal) => (
          <li className="deal-item" key={deal.dealID}>
            <p>
              <strong>Deal Type</strong> {deal.dealType}
            </p>
            <p>
              <strong>Status</strong> {deal.status}
            </p>
            <p>
              <strong>Created At</strong>{' '}
              {new Date(deal.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At</strong>{' '}
              {new Date(deal.updatedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

DealsList.propTypes = {
  customerID: PropTypes.string.isRequired,
};

export default DealsList;
