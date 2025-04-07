export type WorkType = 'development' | 'staging' | 'production';

interface Service {
  name: string;
  url: string;
}

interface ServiceHealthConfig {
  [environment: string]: Service[];
}

export const SERVICE_HEALTH_CONFIG: ServiceHealthConfig = {
  development: [
    {
      name: 'CWINGS Express',
      url: 'https://cwings-express-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'EWINGS Driver',
      url: 'https://ewings-driver-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'CWINGS-UAE',
      url: 'https://cwings-develop.mafrservicesstg.com/mafuae/lastmile/health',
    },
    {
      name: 'CWINGS-KEN',
      url: 'https://cwings-develop.mafrservicesstg.com/mafken/lastmile/health',
    },
    {
      name: 'CWINGS-EGY',
      url: 'https://cwings-develop.mafrservicesstg.com/mafegy/lastmile/health',
    },
    {
      name: 'CWINGS-QAT',
      url: 'https://cwings-develop.mafrservicesstg.com/mafqat/lastmile/health',
    },
    {
      name: 'CWINGS-KSA',
      url: 'https://cwings-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'CWINGS-KWT',
      url: 'https://cwings-develop.mafrservicesstg.com/mafkwt/lastmile/health',
    },
    {
      name: 'CWINGS-PAK',
      url: 'https://cwings-develop.mafrservicesstg.com/mafpak/lastmile/health',
    },
    {
      name: 'CWINGS-LBN',
      url: 'https://cwings-develop.mafrservicesstg.com/maflbn/lastmile/health',
    },
    {
      name: 'CWINGS-OMN',
      url: 'https://cwings-develop.mafrservicesstg.com/mafomn/lastmile/health',
    },
    {
      name: 'CWINGS-JOR',
      url: 'https://cwings-develop.mafrservicesstg.com/mafjor/lastmile/health',
    },
    {
      name: 'CWINGS-BHR',
      url: 'https://cwings-develop.mafrservicesstg.com/mafbhr/lastmile/health',
    },
    {
      name: 'CWINGS-GEO',
      url: 'https://cwings-develop.mafrservicesstg.com/mafgeo/lastmile/health',
    },
    {
      name: 'FF-Reporting',
      url: 'https://cwings-develop.mafrservicesstg.com/report/fulfilment/health',
    },
    {
      name: 'Rule Engine',
      url: 'https://cams-lastmile-svc-develop-hc.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Aramex',
      url: 'https://cams-develop-hc.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Imile',
      url: 'https://camsimile-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Empost',
      url: 'https://cams-empost-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'OneClick',
      url: 'https://cams-oneclick-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Courier Partner Service',
      url: 'https://courier-service-develop.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Live Tracking',
      url: 'https://lm-livetrack-svc-develop-api.mafrservicesstg.com/lastmile/health',
    },
  ],
  staging: [
    {
      name: 'CWINGS Express',
      url: 'https://cwings-express-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'EWINGS Driver',
      url: 'https://ewings-driver-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'CWINGS-UAE',
      url: 'https://cwings-test.mafrservicesstg.com/mafuae/lastmile/health',
    },
    {
      name: 'CWINGS-KEN',
      url: 'https://cwings-test.mafrservicesstg.com/mafken/lastmile/health',
    },
    {
      name: 'CWINGS-EGY',
      url: 'https://cwings-test.mafrservicesstg.com/mafegy/lastmile/health',
    },
    {
      name: 'CWINGS-QAT',
      url: 'https://cwings-test.mafrservicesstg.com/mafqat/lastmile/health',
    },
    {
      name: 'CWINGS-KSA',
      url: 'https://cwings-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'CWINGS-KWT',
      url: 'https://cwings-test.mafrservicesstg.com/mafkwt/lastmile/health',
    },
    {
      name: 'CWINGS-PAK',
      url: 'https://cwings-test.mafrservicesstg.com/mafpak/lastmile/health',
    },
    {
      name: 'CWINGS-LBN',
      url: 'https://cwings-test.mafrservicesstg.com/maflbn/lastmile/health',
    },
    {
      name: 'CWINGS-OMN',
      url: 'https://cwings-test.mafrservicesstg.com/mafomn/lastmile/health',
    },
    {
      name: 'CWINGS-JOR',
      url: 'https://cwings-test.mafrservicesstg.com/mafjor/lastmile/health',
    },
    {
      name: 'CWINGS-BHR',
      url: 'https://cwings-test.mafrservicesstg.com/mafbhr/lastmile/health',
    },
    {
      name: 'CWINGS-GEO',
      url: 'https://cwings-test.mafrservicesstg.com/mafgeo/lastmile/health',
    },
    {
      name: 'FF-Reporting',
      url: 'https://cwings-test.mafrservicesstg.com/report/fulfilment/health',
    },
    {
      name: 'Rule Engine',
      url: 'https://cams-lastmile-svc-test-hc.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Aramex',
      url: 'https://cams-test-hc.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Imile',
      url: 'https://camsimile-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Empost',
      url: 'https://cams-empost-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'OneClick',
      url: 'https://cams-oneclick-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Courier Partner Service',
      url: 'https://courier-service-test.mafrservicesstg.com/lastmile/health',
    },
    {
      name: 'Live Tracking',
      url: 'https://lm-livetrack-svc-test-api.mafrservicesstg.com/lastmile/health',
    },
  ],
  production: [
    {
      name: 'CWINGS-Express',
      url: 'https://cwings-express.mafrservices.com/lastmile/health',
    },
    {
      name: 'EWINGS-Driver',
      url: 'https://ewings-driver.mafrservices.com/lastmile/health',
    },
    {
      name: 'CWINGS-UAE',
      url: 'https://cwings.mafrservices.com/mafuae/lastmile/health',
    },
    {
      name: 'CWINGS-KEN',
      url: 'https://cwings.mafrservices.com/mafken/lastmile/health',
    },
    {
      name: 'CWINGS-EGY',
      url: 'https://cwings.mafrservices.com/mafegy/lastmile/health',
    },
    {
      name: 'CWINGS-QAT',
      url: 'https://cwings.mafrservices.com/mafqat/lastmile/health',
    },
    {
      name: 'CWINGS-KSA',
      url: 'https://cwings.mafrservices.com/lastmile/health',
    },
    {
      name: 'CWINGS-KWT',
      url: 'https://cwings.mafrservices.com/mafkwt/lastmile/health',
    },
    {
      name: 'CWINGS-PAK',
      url: 'https://cwings.mafrservices.com/mafpak/lastmile/health',
    },
    {
      name: 'CWINGS-LBN',
      url: 'https://cwings.mafrservices.com/maflbn/lastmile/health',
    },
    {
      name: 'CWINGS-OMN',
      url: 'https://cwings.mafrservices.com/mafomn/lastmile/health',
    },
    {
      name: 'CWINGS-JOR',
      url: 'https://cwings.mafrservices.com/mafjor/lastmile/health',
    },
    {
      name: 'CWINGS-BHR',
      url: 'https://cwings.mafrservices.com/mafbhr/lastmile/health',
    },
    {
      name: 'CWINGS-GEO',
      url: 'https://cwings.mafrservices.com/mafgeo/lastmile/health',
    },
    {
      name: 'FF-Reporting',
      url: 'https://cwings.mafrservices.com/report/fulfilment/health',
    },
    {
      name: 'Rule Engine',
      url: 'https://cams-lastmile-svc-hc.mafrservices.com/lastmile/health',
    },
    {
      name: 'Aramex',
      url: 'https://cams-hc.mafrservices.com/lastmile/health',
    },
    {
      name: 'Imile',
      url: 'https://cams-imile-api.mafrservices.com/lastmile/health',
    },
    {
      name: 'Empost',
      url: 'https://cams-empost.mafrservices.com/lastmile/health',
    },
    {
      name: 'OneClick',
      url: 'https://cams-oneclick.mafrservices.com/lastmile/health',
    },
    {
      name: 'Courier Partner Service',
      url: 'https://courier-service.mafrservices.com/lastmile/health',
    },
    {
      name: 'Live Tracking',
      url: 'https://lm-livetrack-svc-api.mafrservices.com/lastmile/health',
    },
  ]
};

export const getServiceHealthUrl = (workType: WorkType = 'development') => {
  const config = SERVICE_HEALTH_CONFIG[workType];
  return config;
};

