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

const tonBlack20kOneDayRates = [
  1.36, 3.14, 5.38, 6.11, 6.84, 7.56, 8.27, 8.98, 9.68, 10.37, 11.05, 11.73,
  12.39,
];

const tonBlack20kSameDayRates = [
  2.28, 5.48, 10.88, 11.98, 12.58, 13.28, 13.98, 14.98, 15.58, 16.18, 16.88,
  17.88, 18.28,
];

const tonBlack40kOneDayRates = [
  0.84, 2.88, 4.21, 4.82, 5.43, 6.04, 6.63, 7.23, 7.81, 8.4, 8.97, 9.55, 10.11,
];

const tonBlack40kSameDayRates = [
  2.28, 5.48, 10.88, 11.98, 12.58, 13.28, 13.98, 14.98, 15.58, 16.18, 16.88,
  17.88, 18.28,
];

const tonBlack80kOneDayRates = [
  0.78, 2.78, 4.07, 4.64, 5.2, 5.76, 6.31, 6.86, 7.41, 7.95, 8.48, 9.02, 9.55,
];

const tonBlack80kSameDayRates = [
  2.28, 5.48, 10.88, 11.98, 12.58, 13.28, 13.98, 14.98, 15.58, 16.18, 16.88,
  17.88, 18.28,
];

const tonBlackPlus80kOneDayRates = [
  0.74, 2.68, 3.93, 4.45, 4.97, 5.48, 5.98, 6.5, 6.98, 7.5, 7.98, 8.48, 8.98,
];

const tonBlackPlus80kSameDayRates = [
  2.28, 5.48, 10.88, 11.98, 12.58, 13.28, 13.98, 14.98, 15.58, 16.18, 16.88,
  17.88, 18.28,
];

export const mockedPlans: Plan[] = [
  new Plan(1, 'Ton Max Promocional', tonMaxProRates),
  new Plan(2, 'Ton Max até 2k', tonMaxPro2kRates),
  new Plan(3, 'Ton Max 2k-5k', tonMaxPro5kRates),
  new Plan(4, 'Ton Max 5k-10k', tonMaxPro10kRates),
  new Plan(5, 'Ton Max 10k-15k', tonMaxPro15kRates),
  new Plan(6, 'Ton Max 15k+', tonMaxPro15kPlusRates),
  new Plan(7, 'Ton Max até 2k - D+0', tonPro2KPlusSameDayRates),
  new Plan(8, 'Ton Max até 2k - 1 dia', tonMax2kOneDayRates),
  new Plan(9, 'Ton Max 2k-5k - 1 dia', tonMax5kOneDayRates),
  new Plan(10, 'Ton Max 5k-10k - 1 dia', tonMax10kOneDayRates),
  new Plan(11, 'Ton Max 10k-15k - 1 dia', tonMax15kOneDayRates),
  new Plan(12, 'Ton Max 15k+ - 1 dia', tonMax15kPlusOneDayRates),
  new Plan(13, 'Ton Pro Promocional', tonProRates),
  new Plan(14, 'Ton Pro até 2k - D+0', tonPro2KSameDayRates),
  new Plan(15, 'Ton Pro até 2k - 1 dia', tonPro2KOnedayRates),
  new Plan(16, 'Ton Pro 2k+ - 1 dia', tonProRates2KPlusOneday),
  new Plan(17, 'Ton Super - D+0', tonSuperSameDayRates),
  new Plan(18, 'Ton Super - 1 dia', tonSuperOneDayRates),
  new Plan(19, 'Ton Black 20k - D+0', tonBlack20kSameDayRates),
  new Plan(20, 'Ton Black 40k - D+0', tonBlack40kSameDayRates),
  new Plan(21, 'Ton Black 80k - D+0', tonBlack80kSameDayRates),
  new Plan(22, 'Ton Black +80k - D+0', tonBlackPlus80kSameDayRates),
  new Plan(23, 'Ton Black 20k - 1 dia', tonBlack20kOneDayRates),
  new Plan(24, 'Ton Black 40k - 1 dia', tonBlack40kOneDayRates),
  new Plan(25, 'Ton Black 80k - 1 dia', tonBlack80kOneDayRates),
  new Plan(26, 'Ton Black +80k - 1 dia', tonBlackPlus80kOneDayRates),
];
