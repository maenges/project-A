import React, { useState } from 'react';
import HealthCheckApis from '@services/api/common/HealthCheckApis';
import { HealthCheckResult } from '@models/common/HealthCheck';

const healthApis = new HealthCheckApis();

const HealthCheck: React.FC = () => {
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await healthApis.fetchHealthCheck();
      setResult(data);
    } catch {
      setError('API 호출 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Health Check API 샘플</h2>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold mb-4"
        onClick={handleCheck}
        disabled={loading}
      >
        {loading ? '확인 중...' : 'Health Check 호출'}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {result && (
        <pre className="bg-gray-100 rounded p-4 text-sm mt-2">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default HealthCheck;
