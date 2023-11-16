import joi from 'joi';
import { JsonObject } from 'swagger-ui-express';

const prospectSchema = joi.object({
  prospectId: joi.string().required(),
});

const activitySchema = joi.object({
  activity: joi.string().required(),
});

const activityBodySchema = joi.object({
  activity: joi.string().regex(/^[\w\-\s]+$/).required(),
  status: joi.string().regex(/^[\w\-\s]+$/).required(),
  activityDate: joi.string().required(),
});

export const validateProspectParam = (reqProspectId: string) => {
  const { error } = prospectSchema.validate(
    { prospectId: reqProspectId },
    { abortEarly: false }
  );
  return error;
};

export const validateActivityParam = (reqActivity: string) => {
  const { error } = activitySchema.validate(
    { activity: reqActivity },
    { abortEarly: false }
  );
  return error;
};

export const validateActivityBody = (reqBody: JsonObject) => {
  const { error } = activityBodySchema.validate(
    reqBody,
    { abortEarly: false }
  );
  return error;
};
