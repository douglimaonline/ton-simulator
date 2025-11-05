import { Plan } from './models/plan.model';

const tonMaxProRates = [
  0.59, 0.59, 3.99, 3.99, 4.99, 5.99, 6.99, 7.99, 7.99, 7.99, 7.99, 7.99, 7.99,
];
const tomMaxPro2kRates = [
  1.98, 4.86, 10.86, 12.24, 13.59, 14.92, 16.22, 17.5, 18.76, 19.99, 21.19,
  21.39, 21.39,
];
const tomMaxPro5kRates = [
  1.66, 3.56, 7.78, 8.99, 9.99, 10.99, 11.99, 12.99, 13.94, 13.95, 13.96, 13.97,
  13.98,
];
const tomMaxPro10kRates = [
  1.64, 3.53, 7.58, 8.94, 9.94, 10.94, 11.94, 12.94, 13.15, 13.16, 13.17, 13.18,
  13.19,
];
const tomMaxPro15kRates = [
  1.6, 3.5, 7.48, 8.89, 9.89, 10.89, 11.89, 12.89, 13.11, 13.12, 13.13, 13.14,
  13.15,
];
const tomMaxPro15kPlusRates = [
  1.4, 3.3, 7.37, 8.04, 8.92, 9.79, 11.87, 12.87, 13.05, 13.06, 13.07, 13.08,
  13.09,
];
const tomProRates = [
  0.74, 0.74, 3.99, 4.99, 5.99, 6.99, 7.99, 8.99, 8.99, 8.99, 8.99, 8.99, 8.99,
];
const tomProRates2KOneday = [
  1.69, 3.86, 9.86, 11.24, 12.59, 13.92, 15.22, 16.5, 17.76, 18.99, 20.19,
  20.39, 20.39,
];
const tomProRates2KSameDay = [
  1.98, 4.86, 10.86, 12.24, 13.59, 14.92, 16.22, 17.5, 18.76, 19.99, 21.19,
  21.39, 21.39,
];
const tomProRates2KPlusOneday = [
  1.45, 3.51, 6.99, 6.99, 7.99, 9.99, 10.99, 11.99, 11.99, 12.99, 13.99, 14.79,
  14.79,
];
const tomProRates2KPlusSameDay = [
  1.66, 3.95, 7.99, 8.99, 9.99, 10.99, 11.99, 12.99, 13.99, 14.99, 14.99, 15.49,
  15.49,
];

export const mockedPlans: Plan[] = [
  new Plan('Plano ton Max Promocional', tonMaxProRates),
  new Plan('Plano Ton Max (Até 2k)', tomMaxPro2kRates),
  new Plan('Plano Ton Max (2k - 5k)', tomMaxPro5kRates),
  new Plan('Plano Ton Max (5k - 10k)', tomMaxPro10kRates),
  new Plan('Plano Ton Max (10k - 15k)', tomMaxPro15kRates),
  new Plan('Plano Ton Max (15k+)', tomMaxPro15kPlusRates),
  new Plan('Ton Pro Promocional', tomProRates),
  new Plan('Ton Pro ate R$2mil (1 Dia)', tomProRates2KOneday),
  new Plan('Ton Pro ate R$2mil (Mesmo Dia)', tomProRates2KSameDay),
  new Plan('Ton Pro acima de R$2mil (1 Dia)', tomProRates2KPlusOneday),
  new Plan('Ton Pro acima de R$2mil (Mesmo Dia)', tomProRates2KPlusSameDay),
];
