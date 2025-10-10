export type WorkType = 'development' | 'staging' | 'production';

interface ApiConfig {
  [key: string]: {
    auth: {
      domain: string;
      login: string;
      verify: string;
      headers: {
        'system-id': string;
        'Content-Type': string;
      };
    };
    featureFlags: {
      domain: string;
      endpoints: {
        list: string;
        create: string;
        update: string;
        delete: string;
      };
    };
  };
}

export const API_CONFIG: ApiConfig = {
  development: {
    auth: {
      domain: 'https://camsusermgmt-api-develop.mafrservicesstg.com/lastmile',
      login: '/v2/authenticate',
      verify: '/v2/authenticate/verify-otp',
      headers: {
        'system-id': 'CWINGS',
        'Content-Type': 'application/json',
      },
    },
    featureFlags: {
      domain: 'https://cwings-develop.mafrservicesstg.com/report/fulfilment',
      endpoints: {
        list: '/config',
        create: '/config',
        update: '/config',
        delete: '/config',
      },
    },
  },
  staging: {
    auth: {
      domain: 'https://camsusermgmt-api-test.mafrservicesstg.com/lastmile',
      login: '/v2/authenticate',
      verify: '/v2/authenticate/verify-otp',
      headers: {
        'system-id': 'CWINGS',
        'Content-Type': 'application/json',
      },
    },
    featureFlags: {
      domain: 'https://cwings-test.mafrservicesstg.com/report/fulfilment',
      endpoints: {
        list: '/config',
        create: '/config',
        update: '/config',
        delete: '/config',
      },
    },
  },
  production: {
    auth: {
      domain: 'https://camsusermgmt-api.mafrservices.com/lastmile',
      login: '/v2/authenticate',
      verify: '/v2/authenticate/verify-otp',
      headers: {
        'system-id': 'CWINGS',
        'Content-Type': 'application/json',
      },
    },
    featureFlags: {
      domain: 'https://cwings.mafrservices.com/report/fulfilment',
      endpoints: {
        list: '/config',
        create: '/config',
        update: '/config',
        delete: '/config',
      },
    },
  }
};

export const getAuthUrl = (workType: WorkType = 'development') => {
  const config = API_CONFIG[workType];
  return `${config.auth.domain}${config.auth.login}`;
};

export const validateOtpUrl = (workType: WorkType = 'development') => {
  const config = API_CONFIG[workType];
  return `${config.auth.domain}${config.auth.verify}`;
};

export const getAuthHeaders = (workType: WorkType = 'development') => {
  const config = API_CONFIG[workType];
  return config.auth.headers;
};

export const getFeatureFlagUrl = (endpoint: keyof ApiConfig['development']['featureFlags']['endpoints'], workType: WorkType = 'development') => {
  const config = API_CONFIG[workType];
  return `${config.featureFlags.domain}${config.featureFlags.endpoints[endpoint]}`;
};

