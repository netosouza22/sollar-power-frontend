import { schemaLogin, schemaProject, schemaUser } from "@/utils/schemas";
import * as yup from 'yup';

export type FormDataLogin = yup.InferType<typeof schemaLogin>;
export type FormDataUser = yup.InferType<typeof schemaUser>;
export type FormDataProject = yup.InferType<typeof schemaProject>;
