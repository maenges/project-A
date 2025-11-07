import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';

export default class HealthCheckApis {
  fetchHealthCheck = async () => {
    const res = await callApi({
      service: Service.KAL_BE,
      url: '/api/v1/health',
      method: Method.GET,
    });
    return res.data;
  };
}
