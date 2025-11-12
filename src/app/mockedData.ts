import { Plan } from './models/plan.model';

const tonMaxProRates = [
  0.38, 0.38, 3.94, 3.94, 3.94, 3.94, 3.94, 7.64, 7.64, 7.64, 7.64, 7.64, 7.64,
];
const tonMaxPro2kRates = [
  1.98, 4.86, 10.86, 12.24, 13.59, 14.92, 16.22, 17.5, 18.76, 19.99, 21.19,
  21.39, 21.39,
];
const tonMaxPro5kRates = [
  1.66, 3.56, 7.78, 8.99, 9.99, 10.99, 11.99, 12.99, 13.94, 13.95, 13.96, 13.97,
  13.98,
];
const tonMaxPro10kRates = [
  1.64, 3.53, 7.58, 8.94, 9.94, 10.94, 11.94, 12.94, 13.15, 13.16, 13.17, 13.18,
  13.19,
];
const tonMaxPro15kRates = [
  1.6, 3.5, 7.48, 8.89, 9.89, 10.89, 11.89, 12.89, 13.11, 13.12, 13.13, 13.14,
  13.15,
];
const tonMaxPro15kPlusRates = [
  1.4, 3.3, 7.37, 8.04, 8.92, 9.79, 11.87, 12.87, 13.05, 13.06, 13.07, 13.08,
  13.09,
];
const tonProRates = [
  0.74, 0.74, 3.99, 4.99, 5.99, 6.99, 7.99, 8.99, 8.99, 8.99, 8.99, 8.99, 8.99,
];
const tonPro2KOnedayRates = [
  1.69, 3.86, 9.86, 11.24, 12.59, 13.92, 15.22, 16.5, 17.76, 18.99, 20.19,
  20.39, 20.39,
];
const tonPro2KSameDayRates = [
  1.98, 4.86, 10.86, 12.24, 13.59, 14.92, 16.22, 17.5, 18.76, 19.99, 21.19,
  21.39, 21.39,
];
const tonProRates2KPlusOneday = [
  1.45, 3.51, 6.99, 6.99, 7.99, 9.99, 10.99, 11.99, 11.99, 12.99, 13.99, 14.79,
  14.79,
];
const tonPro2KPlusSameDayRates = [
  1.66, 3.95, 7.99, 8.99, 9.99, 10.99, 11.99, 12.99, 13.99, 14.99, 14.99, 15.49,
  15.49,
];

const tonMax2kOneDayRates = [
  1.69, 3.86, 9.86, 11.24, 12.59, 13.92, 15.22, 16.5, 17.76, 18.99, 20.19,
  20.39, 20.39,
];

const tonMax5kOneDayRates = [
  1.45, 3.39, 6.73, 8.49, 9.49, 10.49, 11.49, 12.49, 13.29, 13.29, 13.29, 13.29,
  13.29,
];

const tonMax10kOneDayRates = [
  1.37, 3.35, 6.72, 8.44, 9.44, 10.44, 11.44, 12.44, 12.65, 12.66, 12.67, 12.68,
  12.69,
];

const tonMax15kOneDayRates = [
  1.35, 3.14, 6.71, 8.39, 9.39, 10.39, 11.39, 12.39, 12.61, 12.62, 12.63, 12.64,
  12.65,
];

const tonMax15kPlusOneDayRates = [
  1.29, 3.09, 6.7, 7.54, 8.42, 9.29, 11.37, 12.37, 12.55, 12.56, 12.57, 12.58,
  12.59,
];

const tonSuperSameDayRates = [
  1.98, 4.98, 9.91, 11.29, 12.64, 13.97, 15.27, 16.55, 17.81, 19.04, 20.24,
  21.43, 22.59,
];

const tonSuperOneDayRates = [
  1.98, 4.98, 10.91, 12.29, 13.64, 14.97, 16.27, 17.55, 18.81, 20.04, 21.24,
  22.43, 23.59,
];

export const mockedPlans: Plan[] = [
  new Plan('Plano ton Max Promocional', tonMaxProRates),
  new Plan('Plano Ton Max (Até 2k)', tonMaxPro2kRates),
  new Plan('Plano Ton Max (2k - 5k)', tonMaxPro5kRates),
  new Plan('Plano Ton Max (5k - 10k)', tonMaxPro10kRates),
  new Plan('Plano Ton Max (10k - 15k)', tonMaxPro15kRates),
  new Plan('Plano Ton Max (15k+)', tonMaxPro15kPlusRates),
  new Plan('Ton Pro Promocional', tonProRates),
  new Plan('Ton Pro ate R$2mil (1 Dia)', tonPro2KOnedayRates),
  new Plan('Ton Pro ate R$2mil (Mesmo Dia)', tonPro2KSameDayRates),
  new Plan('Ton Pro acima de R$2mil (1 Dia)', tonProRates2KPlusOneday),
  new Plan('Plano Ton Max (Até 2k - 1 Dia)', tonPro2KPlusSameDayRates),
  new Plan('Plano Ton Max (Até 2k - 1 Dia)', tonMax2kOneDayRates),
  new Plan('Plano Ton Max (2k - 5k - 1 Dia)', tonMax5kOneDayRates),
  new Plan('Plano Ton Max (5k - 10k - 1 Dia)', tonMax10kOneDayRates),
  new Plan('Plano Ton Max (10k - 15k - 1 Dia)', tonMax15kOneDayRates),
  new Plan('Plano Ton Max (15k +  - 1 Dia)', tonMax15kPlusOneDayRates),
  new Plan('Ton Super (Mesmo Dia)', tonSuperSameDayRates),
  new Plan('Ton Super  (1 Dia)', tonSuperOneDayRates),
];
