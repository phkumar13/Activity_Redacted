import * as paramsValidator from './paramsValidator';
import { ValidationError } from 'joi';

describe('prospect validator tests', () => {
  test('validate ProspectId function should fail', () => {
    let reqParams = '';
    const result = paramsValidator.validateProspectParam(reqParams);
    expect(result).toBeInstanceOf(ValidationError);
  });

  test('validate ProspectId function should pass', () => {
    let reqParams = '1001';
    const result = paramsValidator.validateProspectParam(reqParams);
    expect(result).toBe(undefined);
  });

  test('validate- Activity Param function should fail', () => {
    let reqParams = '';
    const result = paramsValidator.validateActivityParam(reqParams);
    expect(result).toBeInstanceOf(ValidationError);
  });

  test('validate Activity Param function should pass', () => {
    let reqParams = '101';
    const result = paramsValidator.validateActivityParam(reqParams);
    expect(result).toBe(undefined);
  });

  test('validate- Activity body function should fail', () => {
    let reqParams = {};
    const result = paramsValidator.validateActivityBody(reqParams);
    expect(result).toBeInstanceOf(ValidationError);
  });

  test('validate Activity body function should pass', () => {
    let reqParams = {
      activity: "Calculator",
      status: 'Inprogress',
      activityDate: '2023-02-14 03:02:46.383',
    };
    const result = paramsValidator.validateActivityBody(reqParams);
    expect(result).toBe(undefined);
  });

  
});
